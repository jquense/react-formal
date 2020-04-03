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
import notify from './utils/notify';
import useErrors from './useErrors';
import { ValidationPathSpec } from './errorManager';

function useEvents(
  validateOn: ValidateOnConfig = config.validateOn,
  meta: FieldMeta,
) {
  validateOn = validateOn === undefined ? config.validateOn : validateOn;
  validateOn = typeof validateOn === 'function' ? validateOn(meta) : validateOn;

  return (
    (typeof validateOn === 'string' ? { [validateOn]: true } : validateOn) || {}
  );
}

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

const onChange: ValidateOnConfig = { change: true };

const onBlur: ValidateOnConfig = { blur: true };

const onChangeAndBlur: ValidateOnConfig = { change: true, blur: true };

const onBlurThenChangeAndBlur: ValidateOnConfig = meta => ({
  blur: true,
  change: !meta.valid,
});

export const ValidateStrategies = {
  Change: onChange,
  Blur: onBlur,
  ChangeAndBlur: onChangeAndBlur,
  BlurThenChangeAndBlur: onBlurThenChangeAndBlur,
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
  nativeType: string | undefined;

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

  validateOn: TriggerEventConfig;
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

export type ValueMapper = (value: unknown, ...args: any[]) => any;

export type MapFromValue =
  | string
  | ValueMapper
  | Record<string, string | ValueMapper>;

export type MapToValue = (formValue: {}) => any;

export type TriggerEvent = 'change' | 'blur';
export type TriggerEventConfig = { blur?: boolean; change?: boolean };

export type ValidateOnConfig =
  | null
  | TriggerEvent
  | TriggerEventConfig
  | ((meta: FieldMeta) => TriggerEventConfig | TriggerEvent | null);

export interface UseFieldOptions
  extends Omit<UseFieldMetaOptions, 'validates'> {
  name: string;
  value?: any;
  mapToValue?: MapToValue;
  mapFromValue?: MapFromValue;
  className?: string;
  validates?: string | string[] | null;
  validateOn?: ValidateOnConfig;
  onChange?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
}

export type EventHandlers = Record<string, (...args: any[]) => any>;

export type UseFieldProps<TValue = any> = {
  value: TValue;
  type?: string;
  name: string;
  multiple?: boolean;
  className?: string;
  onChange: (nextFieldValue: unknown, ...args: any[]) => any;
  onBlur: (...args: any[]) => any;
  checked?: boolean;
};

/**
 * Create a new form field for the provided name, takes the same options
 * as `Field` props.
 *
 *
 * ```jsx
 * function MyNameField(props) {
 *   const [fieldProps, meta] = useField('firstName')
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
function useField(name: string): [UseFieldProps, FieldMeta];

/**
 * Create a new form field for the provided name, takes the same options
 * as `Field` props.
 *
 * ```jsx
 * function MyNameField(props) {
 *   const [fieldProps, meta] = useField({ name: 'firstName' })
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
 * @param {('change' | 'blur' | { blur?: boolean; change?: boolean } | (meta: FieldMeta) => { blur?: boolean; change?: boolean })=} options.validateOn configure which events trigger validation.
 */
function useField(options: UseFieldOptions): [UseFieldProps, FieldMeta];

function useField(
  optionsOrName: UseFieldOptions | string,
): [UseFieldProps, FieldMeta] {
  let options =
    typeof optionsOrName === 'string' ? { name: optionsOrName } : optionsOrName;

  let { name, validates, noValidate, onChange, onBlur } = options;

  const fieldsToValidate = useMemo<string[]>(
    () => (validates != null ? toArray(validates) : [name]),
    [name, validates],
  );
  const formActions = useContext(FormActionsContext);

  const meta = useFieldMeta({ ...options, validates: fieldsToValidate });

  meta.validateOn = useEvents(options.validateOn, meta);

  const { blur, change } = meta.validateOn;

  const { update } = meta;
  const validate = formActions?.onValidate;

  const fieldProps: Partial<UseFieldProps> = {
    onChange: useCallback(
      (...args: any[]) => {
        notify(onChange, args as any);
        notify(update, args as any);

        if (!change || noValidate || !validate) return;

        validate(fieldsToValidate, 'onChange', args);
      },
      [change, fieldsToValidate, noValidate, onChange, update, validate],
    ),
    onBlur: useCallback(
      (...args: any[]) => {
        notify(onBlur, args as any);

        if (!blur || noValidate || !validate) return;
        validate(fieldsToValidate, 'onBlur', args);
      },
      [blur, fieldsToValidate, noValidate, onBlur, validate],
    ),
  };

  // always include an onChange
  if (!fieldProps.onChange) {
    fieldProps.onChange = update;
  }

  fieldProps.type = meta.nativeType || options.type;

  fieldProps.name = name;
  fieldProps.value = meta.value == null ? '' : meta.value;

  if (meta.nativeType && /checkbox|radio/.test(meta.nativeType)) {
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

  return [fieldProps as any, meta];
}

export default useField;
