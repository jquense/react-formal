import cn from 'classnames';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { useBinding } from 'topeka';
import { Schema } from 'yup';
import {
  FormActionsContext,
  FormSubmitsContext,
  FormTouchedContext,
} from './Contexts';
import config from './config';
import { Errors } from './types';
import isNativeType from './utils/isNativeType';
import { toArray } from './utils/paths';
import useEventHandlers, { notify } from './utils/useEventHandlers';
import useErrors from './useErrors';
import { ValidationPathSpec } from './errorManager';

function resolveNativeInputConfig(type: unknown) {
  let tagName: 'input' | 'select' | 'textarea' = 'input';

  if (type === 'boolean') type = 'checkbox';
  if (type === 'array') {
    tagName = 'select';
  }

  return tagName === 'input'
    ? { tagName, type: isNativeType(type) ? type : 'text' }
    : { tagName };
}

const onChange: FieldEvents = ['onChange'];

const onBlur: FieldEvents = ['onBlur'];

const onChangeAndBlur: FieldEvents = ['onChange', 'onBlur'];

const onBlurThenChangeAndBlur: FieldEvents = meta =>
  meta.valid ? ['onBlur'] : ['onChange', 'onBlur'];

export const EventStrategies = {
  onChange,
  onBlur,
  onChangeAndBlur,
  onBlurThenChangeAndBlur,
};

export interface UseFieldMetaOptions {
  name: string;
  type?: string;
  exclusive?: boolean;
  noValidate?: boolean;
  errorClass?: string;
  mapToValue?: MapToValue;
  mapFromValue?: MapFromValue;
  validates: Array<string | ValidationPathSpec>;
}

export interface FieldMeta {
  invalid: boolean;
  valid: boolean;
  errors: Errors;
  touched: boolean;

  schema?: Schema<unknown>;
  errorClass?: string;
  context: any;
  /**
   * The abstract field type, either as provided by the field e.g. checkbox,
   * or derived from the field's schema, e.g. number
   */
  resolvedType: string;

  /** A valid HTML input type, only set if `nativeTagName` is 'input' */
  nativeType: string;

  /** The infered native HTML element. */
  nativeTagName: 'input' | 'select' | 'textarea';

  onError: (errors: Errors) => void;

  value: any;

  /** Updates the field value in formData, does not trigger any Validation */
  update: (nextFieldValue: unknown, ...args: any[]) => void;

  /**
   * Handle a change event for a field, updates the field value and triggers
   * validation if applicable.
   */
  onChange: (nextFieldValue: unknown, ...args: any[]) => void;

  events: string[] | null;
}

const passThrough = v => v;

export function useFieldMeta(opts: UseFieldMetaOptions) {
  let {
    name,
    type,
    validates,
    exclusive,
    noValidate,
    mapToValue,
    mapFromValue = passThrough,
    errorClass = config.errorClass,
  } = opts;

  const [value, onChange] = useBinding(mapToValue || name, mapFromValue);

  const warned = useRef(false);
  const actions = useContext(FormActionsContext);
  const submits = useContext(FormSubmitsContext);
  const touched = useContext(FormTouchedContext);
  const filteredErrors = useErrors(name, { inclusive: !exclusive });

  let handleFieldError = (errors: Errors) =>
    actions!.onFieldError(name, errors);

  let schema: Schema<any> | undefined;
  try {
    if (name) schema = actions!.getSchemaForPath(name)
  } catch (err) { /* ignore */ } // prettier-ignore

  if (process.env.NODE_ENV !== 'production') {
    const shouldWarn =
      warned.current === false &&
      !schema &&
      !noValidate &&
      actions?.formHasValidation();

    if (shouldWarn) {
      warned.current = true;
      console.warn(
        `There is no corresponding schema defined for this field: "${name}" ` +
          "Each Field's `name` prop must be a valid path defined by the parent Form schema",
      );
    }
  }

  const onValidate = actions?.onValidate;

  let meta: Partial<FieldMeta> = {
    schema,
    errorClass,
    context: actions?.yupContext,
    touched: touched[name],
    onError: handleFieldError,
    value,
    update: onChange,
    // Add an onChange handler to `meta` so that custom inputs
    // don't need to infer the events configured for a Field
    onChange: useCallback(
      (...args) => {
        onChange(...args);
        if (noValidate || !onValidate) return;
        onValidate(validates, 'onChange', args);
      },
      [onChange, validates, noValidate, onValidate],
    ),
    ...submits,
  };

  meta.errors = filteredErrors;
  meta.invalid = !!Object.keys(filteredErrors!).length;
  meta.valid = !meta.invalid;

  // @ts-ignore
  let resolvedType: string = type || (meta.schema && meta.schema._type);
  meta.resolvedType = resolvedType;
  let nativeConfig = resolveNativeInputConfig(resolvedType);
  meta.nativeType = nativeConfig.type;
  meta.nativeTagName = nativeConfig.tagName;

  return meta as FieldMeta;
}

export type TriggerEvents =
  | null
  | string[]
  | string
  | ((meta: FieldMeta) => string[] | string);

export type ValueMapper = (value: unknown, ...args: any[]) => any;

export type MapFromValue =
  | string
  | ValueMapper
  | Record<string, string | ValueMapper>;

export type MapToValue = (formValue: {}) => any;

export type FieldEvents =
  | string[]
  | string
  | null
  | ((meta: FieldMeta) => string[] | string | null);

export interface UseFieldOptions
  extends Omit<UseFieldMetaOptions, 'validates'> {
  name: string;
  value?: any;
  mapToValue?: MapToValue;
  mapFromValue?: MapFromValue;
  className?: string;
  validates?: string | string[] | null;
  events?: FieldEvents;
}

export type RenderFieldProps<TValue = any> = Record<
  string,
  (...args: any[]) => any
> & {
  value: TValue;
  onChange: (nextFieldValue: unknown, ...args: any[]) => any;
  checked?: boolean;
};

/**
 * @callback MapToValue
 * @param {Object} formValue The root value for the entire _Form_.
 * @returns {any}
 */

/**
 * Create a new form field for the provided name, takes the same options
 * as `Field` props.
 *
 * ```jsx
 * function MyNameField(props) {
 *   const [fieldProps, meta] = useFieldProps('firstName')
 *
 *   return (
 *      <input
 *        {...fieldProps}
 *        className={meta.invalid ? 'field-error' : ''}
 *      />
 *   )
 * }
 * ```
 *
 * @param {string} name The Field name, which should be path corresponding to a specific form `value` path.
 */
function useField(name: string): [RenderFieldProps, FieldMeta];
/**
 * @callback MapToValue
 * @param {Object} formValue The root value for the entire _Form_.
 * @returns {any}
 */

/**
 * Create a new form field for the provided name, takes the same options
 * as `Field` props.
 *
 * ```jsx
 * function MyNameField(props) {
 *   const [fieldProps, meta] = useFieldProps({ name: 'firstName' })
 *
 *   return (
 *      <input
 *        {...fieldProps}
 *        className={meta.invalid ? 'field-error' : ''}
 *      />
 *   )
 * }
 * ```
 *
 * @param options
 * @param {string} options.name The Field name, which should be path corresponding to a specific form `value` path.
 * @param {any=}   options.value For checkbox/boolean fields override the HTML default value for checks from `'on'`
 * @param {MapToValue=} options.mapToValue A mapper from the form value to fieldProps.value`
 * @param {(string|MapFromValue)=} options.mapFromValue A mapper from the form value to fieldProps.value`
 * @param {(string|string[]|null)=} options.validates Triggers validation for additional field paths
 * @param {(string|string[]|EventMapper)=} options.events A set of event names to generate field handlers for.
 */
function useField(
  optionsOrName: UseFieldOptions,
): [RenderFieldProps, FieldMeta];
function useField(
  optionsOrName: UseFieldOptions | string,
): [RenderFieldProps, FieldMeta] {
  let options =
    typeof optionsOrName === 'string' ? { name: optionsOrName } : optionsOrName;

  let { name, validates, noValidate } = options;

  const fieldsToValidate = useMemo<string[]>(
    () => (validates != null ? toArray(validates) : [name]),
    [name, validates],
  );
  const formActions = useContext(FormActionsContext);

  const meta = useFieldMeta({ ...options, validates: fieldsToValidate });

  let events = options.events === undefined ? config.events : options.events;

  events = toArray(typeof events === 'function' ? events(meta) : events);

  meta.events = events as string[];

  const { update } = meta;
  const validate = formActions?.onValidate;

  const fieldProps: any = useEventHandlers(
    events,
    useCallback(
      (event, args) => {
        if (event === 'onChange') {
          notify(update, args as any);
        }
        if (noValidate || !validate) return;

        validate(fieldsToValidate, event, args);
      },
      [update, fieldsToValidate, noValidate, validate],
    ),
  );

  // always include an onChange
  if (!fieldProps.onChange) {
    fieldProps.onChange = update;
  }

  fieldProps.name = name;
  fieldProps.value = meta.value == null ? '' : meta.value;

  if (/checkbox|radio/.test(meta.nativeType)) {
    if (options.value === undefined) {
      fieldProps.checked = !!fieldProps.value;
    } else {
      fieldProps.checked =
        meta.nativeType === 'radio'
          ? fieldProps.value === options.value
          : Array.isArray(fieldProps.value) &&
            fieldProps.value.includes(options.value);
    }

    fieldProps.value = options.value;
  } else if (meta.nativeType === 'file') {
    fieldProps.value = '';
  } else if (
    meta.nativeTagName === 'select' &&
    meta.resolvedType === 'array' &&
    meta.value == null
  ) {
    fieldProps.value = [];
    fieldProps.multiple = true;
  }

  if (!noValidate) {
    fieldProps.className = cn(
      options.className,
      meta.invalid && meta.errorClass,
    );
  }

  return [fieldProps, meta];
}

export default useField;
