import PropTypes from 'prop-types';
import React from 'react';
import { UseFieldProps, MapToValue } from './useField';
import useFieldArray, {
  FieldArrayHelpers,
  FieldArrayMeta,
  UseFieldArrayOptions,
} from './useFieldArray';

export type RenderFieldArrayProps = UseFieldProps & {
  arrayHelpers: FieldArrayHelpers;
  meta: FieldArrayMeta;
  ref: React.Ref<any>;
};

export type FieldArrayProps<T = any> = UseFieldArrayOptions & {
  name: string;
  type?: string;

  /**
   * Indicates whether child paths of the current FieldArray
   * affect the active state of the FieldArray. Does not
   * affect which paths are validated, only whether `meta.valid`
   * considers child paths for its state.
   */
  exclusive?: boolean;

  /**
   * Disables validation for the FieldArray.
   */
  noValidate?: boolean;

  /**
   * Map the Form value to the Field value. By default
   * the `name` of the Field is used to extract the relevant
   * property from the Form value.
   *
   * ```jsx static
   * <Form.Field
   *   name='location'
   *   type="dropdownlist"
   *   mapToValue={formData=> pick(formData, 'location', 'locationId')}
   * />
   * ```
   */
  mapToValue?: MapToValue;

  children: (
    value: T[],
    helpers: FieldArrayHelpers<T>,
    meta: FieldArrayMeta,
  ) => React.ReactNode;
};

/**
 * `<FieldArray>`, unlike `<Field>`, does not render any component, and
 * is essentially a render prop version of [`useFieldArray`](/api/useFieldArray), accepting all
 * the same options.
 */
function FieldArray<T = any>({ children, ...props }: FieldArrayProps<T>) {
  const [values, arrayHelpers, meta] = useFieldArray<T>(props);

  return <>{children(values, arrayHelpers, meta)}</>;
}

FieldArray.displayName = 'FieldArray';

// @ts-ignore
FieldArray.propTypes = {
  name: PropTypes.string.isRequired,

  /**
   * The similar signature as providing a function to `<Field>` but with an
   * additional `arrayHelpers` object passed to the render function:
   *
   * ```tsx static
   * <Form.FieldArray>
   *   {(values, arrayHelpers, meta) => ... }
   * </Form.FieldArray>
   * ```
   *
   * @type {(value: T, arrayHelpers: FieldArrayHelpers, meta; FieldMeta) => ReactNode}
   */
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

export default FieldArray;
