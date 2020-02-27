import cn from 'classnames';
import memoize from 'memoize-one';
import { useCallback, useContext, useMemo } from 'react';
import shallowequal from 'shallowequal';
import { useBinding } from 'topeka';
import { Schema } from 'yup';
import {
  FormActions,
  FormActionsContext,
  FormErrorContext,
  FormSubmitsContext,
  FormTouchedContext,
} from './Contexts';
import config from './config';
import { Errors } from './types';
import { filterAndMapErrors, inclusiveMapErrors } from './utils/ErrorUtils';
import isNativeType from './utils/isNativeType';
import { toArray } from './utils/paths';
import useEventHandlers, { notify } from './utils/useEventHandlers';

function resolveToNativeType(type: unknown) {
  if (type === 'boolean') return 'checkbox';
  return isNativeType(type) ? type : 'text';
}

function isFilterErrorsEqual([a], [b]) {
  let isEqual =
    (a.errors === b.errors || shallowequal(a.errors, b.errors)) &&
    a.names === b.names &&
    a.mapErrors === b.mapErrors;

  return isEqual;
}

interface UseFieldMetaOptions {
  name: string;
  type?: string;
  exclusive?: boolean;
  noValidate?: boolean;
  errorClass?: string;
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
  /** A valid HTML input type */
  nativeType: string;
  onError: (errors: Errors) => void;

  value: any;
  onChange: (nextFieldValue: unknown) => void;

  events: string[];
}

function useFieldMeta(opts: UseFieldMetaOptions, actions: FormActions) {
  let {
    name,
    type,
    exclusive,
    noValidate,
    errorClass = config.errorClass,
  } = opts;

  const submits = useContext(FormSubmitsContext);
  const touched = useContext(FormTouchedContext);
  const errors = useContext(FormErrorContext);

  // this is so we get a memoized function that is instance specific
  const memoizedFilter = useMemo(
    () => memoize(filterAndMapErrors, isFilterErrorsEqual),
    [],
  );

  let handleFieldError = (errors: Errors) => actions.onFieldError(name, errors);

  let schema: Schema<any> | undefined;
  try {
    if (name) schema = actions.getSchemaForPath?.(name)
  } catch (err) { /* ignore */ } // prettier-ignore

  if (process.env.NODE_ENV !== 'production') {
    if (!(!actions || noValidate || !name || schema))
      console.warn(
        `There is no corresponding schema defined for this field: "${name}" ` +
          "Each Field's `name` prop must be a valid path defined by the parent Form schema",
      );
  }

  let meta: Partial<FieldMeta> = {
    schema,
    errorClass,
    context: actions.yupContext,
    touched: touched[name],
    onError: handleFieldError,
    ...submits,
  };

  const filteredErrors = memoizedFilter({
    errors,
    names: name,
    mapErrors: !exclusive ? inclusiveMapErrors : undefined,
  });

  meta.errors = filteredErrors;
  meta.invalid = !!Object.keys(filteredErrors!).length;
  meta.valid = !meta.invalid;

  // @ts-ignore
  let resolvedType: string = type || (meta.schema && meta.schema._type);
  meta.resolvedType = resolvedType;
  meta.nativeType = resolveToNativeType(resolvedType);

  return meta as FieldMeta;
}

export type TriggerEvents =
  | string[]
  | string
  | ((meta: FieldMeta) => string[] | string);

export type ValueMapper = (value: unknown, ...args: any[]) => any;

export type MapFromValue =
  | string
  | ValueMapper
  | Record<string, string | ValueMapper>;

export type MapToValue = (formValue: {}) => any;

export interface UseFieldOptions extends UseFieldMetaOptions {
  name: string;
  value?: any;
  mapToValue?: MapToValue;
  mapFromValue?: MapFromValue;
  className?: string;
  validates?: string | string[] | null;
  events?: string[] | string | ((meta: FieldMeta) => string[] | string) | null;
}

export type RenderFieldProps<TValue = any> = Record<
  string,
  (...args: any[]) => any
> & {
  value: TValue;
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
 *   const [fieldProps, meta] = useFieldProps({ name: 'firstName })
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
export default function useField(options: UseFieldOptions) {
  let { mapToValue, mapFromValue, name, validates, noValidate } = options;

  const formActions = useContext(FormActionsContext);

  const [value, onChange] = useBinding(mapToValue || name, mapFromValue);

  const fieldsToValidate = useMemo<string[]>(
    () => (validates != null ? toArray(validates) : [name]),
    [name, validates],
  );

  const meta = useFieldMeta(options, formActions!);

  // put the original value on meta in case the coerced one differs
  meta.value = value;

  let events = options.events || config.events;
  events = typeof events === 'function' ? events(meta) : events;

  meta.events = events;

  // Add an onChange handler to `meta` so that custom inputs
  // don't need to infer the events configured for a Field
  meta.onChange = useCallback(
    (value: any) => {
      onChange(value);
      if (noValidate || !formActions) return;
      formActions.onValidate(fieldsToValidate, 'onChange', [value]);
    },
    [onChange, fieldsToValidate, formActions && formActions.onValidate],
  );

  const fieldProps: any = useEventHandlers(
    events,
    useCallback(
      (event, args) => {
        notify(onChange, args);
        if (noValidate || !formActions) return;
        formActions.onValidate(fieldsToValidate, event, args);
      },
      [onChange, fieldsToValidate, formActions && formActions.onValidate],
    ),
  );
  fieldProps.name = name;
  fieldProps.value = value == null ? '' : value;

  if (/checkbox|radio/.test(meta.nativeType)) {
    fieldProps.checked = fieldProps.value;
    fieldProps.value = options.value;
  } else if (meta.nativeType === 'file') {
    fieldProps.value = '';
  }

  if (!noValidate) {
    fieldProps.className = cn(
      options.className,
      meta.invalid && meta.errorClass,
    );
  }

  return [fieldProps, meta] as [RenderFieldProps, FieldMeta];
}
