import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import useField, {
  FieldMeta,
  MapFromValue,
  MapToValue,
  UseFieldProps,
  ValidateOnConfig,
} from './useField';
import notify from './utils/notify';

export type FieldEventHandlers = {
  onBlur?: (...args: any[]) => any;
  onChange?: (...args: any[]) => any;
};

export function useMergedEventHandlers(
  { onBlur: onFieldBlur, onChange: onFieldChange }: FieldEventHandlers,
  { onBlur, onChange }: FieldEventHandlers,
) {
  return useMemo(
    () => ({
      onChange: (...args: any[]) => {
        notify(onChange, args);
        notify(onFieldChange, args);
      },
      onBlur: (...args: any[]) => {
        notify(onBlur, args);
        notify(onFieldBlur, args);
      },
    }),
    [onFieldBlur, onFieldChange, onBlur, onChange],
  );
}

export type FieldRenderProps<TValue = any> = UseFieldProps<TValue> & {
  type: string;
  ref?: React.Ref<any>;
};

/**
 * When Field renders an Element, it injects a few props.
 * In the case none DOM elements it also injects `meta`
 */
export type FieldInjectedProps<TValue = any> = FieldRenderProps<TValue> & {
  meta?: FieldMeta;
};

export type FieldProps<TAs extends React.ElementType = any> = {
  /**
   * The Component Input the form should render. You can sepcify a native element such as 'input' or 'select'
   * or provide a Component type class directly. When no type is provided the Field will attempt determine
   * the correct input from the Field's schema. A Field corresponding to a `yup.number()`
   * will render a `type='number'` etc.
   *
   * ```jsx
   * import Form from 'react-formal';
   *
   * function MyDateInput({ meta: _, ...props }) {
   *   return <input {...props} type='datetime-local' />
   * }
   *
   * <Form>
   *   Provide a type directly
   *   <Form.Field
   *     name='dateOfBirth'
   *     type='time'
   *     placeholder='time only'
   *   />
   *
   *   Use a custom Component
   *   (need native 'datetime' support to see it)
   *   <Form.Field
   *     name='dateOfBirth'
   *     as={MyDateInput}
   *   />
   *
   * </Form>
   * ```
   *
   * Custom Inputs should comply with the basic input api contract: set a value via a `value` prop and
   * broadcast changes to that value via an `onChange` handler.
   */
  as?: TAs;

  /**
   * The Field name, which should be path corresponding to a specific form `value` path.
   *
   * ```jsx static
   * // given the form value
   * value = {
   *   name: { first: '' }
   *   languages: ['english', 'spanish']
   * }
   *
   * // the path "name.first" would update the "first" property of the form value
   * <Form.Field name='name.first' />
   *
   * // use indexes for paths that cross arrays
   * <Form.Field name='languages[0]' />
   *
   * ```
   */
  name: string | string;

  /**
   * Configure whether validation occur: onChange, onBlur, or both
   * You can also specify a function that receives the Field `meta` object and returns a configuration map
   * in order to change validation strategies based on validity or other metadata.
   */
  validateOn?: ValidateOnConfig;

  /**
   * Customize how the Field value maps to the overall Form `value`.
   * `mapFromValue` can be a a string property name or a function that returns a
   * value for `name`'d path, allowing you to set commuted values from the Field.
   *
   * ```jsx static
   * <Form.Field
   *   name='name'
   *   mapFromValue={fieldValue => `${fieldValue.first} ${fieldValue.last}`}
   * />
   * ```
   *
   * You can also provide an object hash, mapping paths of the Form `value`
   * to fields in the field value using a string field name, or a function accessor.
   *
   * ```jsx
   * import Form from '@docs/components/FormWithResult';
   * import * as yup from 'yup';
   *
   * const getYear = () => (new Date()).getFullYear()
   *
   * const schema = yup.object({
   *   dateOfBirth: yup.date().required('Required'),
   *   age: yup.number()
   * });
   *
   * <Form
   *   schema={schema}
   *   defaultValue={schema.default()}
   * >
   *   <label>
   *     Date of Birth
   *     <Form.Field
   *       name='dateOfBirth'
   *       mapFromValue={{
   *         'dateOfBirth': event => event.target.value,
   *         'age': ({ target }) => target.valueAsDate ?
   *            getYear() - target.valueAsDate.getFullYear() : null
   *      }}/>
   *   </label>
   *   <label>
   *     Age
   *     <Form.Field name='age' />
   *   </label>
   *
   *   <Form.Submit type='submit'>Submit</Form.Submit>
   * </Form>
   * ```
   */
  mapFromValue?: MapFromValue;

  /**
   * Map the Form value to the Field value. By default
   * the `name` of the Field is used to extract the relevant
   * property from the Form value.
   *
   * ```jsx static
   * <Form.Field
   *   name='location'
   *   type="dropdownlist"
   *   mapToValue={model=> pick(model, 'location', 'locationId')}
   * />
   * ```
   */
  mapToValue?: MapToValue;

  /**
   * The css class added to the Field Input when it fails validation
   */
  errorClass?: string;

  /**
   * Tells the Field to trigger validation for specific paths.
   * Useful when used in conjuction with a `mapFromValue` hash that updates more than one value, or
   * if you want to trigger validation for the parent path as well.
   *
   * > NOTE! This overrides the default behavior of validating the field itself by `name`,
   * include the `name` if you want the field to validate itself.
   *
   * ```jsx static
   * <Form.Field name='name.first' validates="name.last" />
   * <Form.Field name='name' validates={['name', 'surname']} />
   * ```
   */
  validates?: string | string[];

  /**
   * Indicates whether child paths of the current Field
   * affect the active state of the field.
   *
   * ```
   * 'names'
   *   - 'first'
   *   - 'last'
   * ```
   *
   * Are all considered "part" of a field named `'names'` by default. Does not
   * affect which paths are validated, only whether `meta.valid` considers child
   * paths for its state.
   */
  exclusive?: boolean;

  /**
   * Disables validation for the Field.
   */
  noValidate?: boolean;

  /**
   * When children is the traditional react element or nodes, they are
   * passed through as-is to the Field `type` component.
   *
   * ```jsx static
   * <Field type='select'>
   *   <option>red</option>
   *   <option>red</option>
   * </Field>
   * ```
   *
   * When `children` is a function, its called with the processed field
   * props and field meta.
   *
   * **Tip:** you can pass `onChange` and `onBlur` handlers
   * to the `<Field>` component and it will handle merging them with its own injected
   * handlers.
   *
   * ```jsx static
   * <Field name='birthDate'>
   *  {(props, meta) =>
   *    <DataProvider>
   *      <Input {...props} />
   *    </DataProvider>
   *  }
   * </Field>
   * ```
   */
  children?:
    | React.ReactNode
    | ((fieldProps: FieldRenderProps, meta: FieldMeta) => React.ReactNode);

  /**
   * A value to pass to checkboxs/radios/boolean inputs
   */
  value?: any;

  className?: string;

  /**
   * Instruct the field to not inject the `meta` prop into the input,
   * defaults to `true` when `as` is a non DOM component
   */
  injectMeta?: boolean;

  /** An HTML input type attribute */
  type?: string;

  /** A local onChange handler, will be merged with the injected onChange */
  onChange?: (...args: any[]) => any;

  /** A local onBlur handler, will be merged with the injected onBlur */
  onBlur?: (...args: any[]) => any;
};

export type FieldPropsWithAs<TAs extends React.ElementType> = FieldProps<TAs> &
  React.RefAttributes<any> &
  Omit<
    React.ComponentPropsWithoutRef<TAs>,
    | keyof FieldProps
    | 'meta'
    | 'name'
    | 'value'
    | 'checked'
    | 'onChange'
    | 'onBlur'
  >;

export declare interface Field<
  TDefaultControl extends React.ElementType = 'input'
> {
  <TAs extends React.ElementType = TDefaultControl>(
    props: FieldPropsWithAs<TAs>,
  ): React.ReactElement | null;

  displayName?: string;

  propTypes?: any;
}

/**
 * @alias Field
 * @memberof Form
 */
const _Field: Field = React.forwardRef((props: FieldProps, ref) => {
  let {
    children,
    type,
    as: asProp,
    injectMeta,
    name,
    mapFromValue,
    mapToValue,
    validates,
    validateOn,
    value,
    noValidate,
    errorClass,
    className,
    onChange,
    onBlur,
    exclusive = false,
    ...rest
  } = props;
  const hasRenderProp = typeof children === 'function';

  const [field, meta] = useField({
    name,
    type,
    // XXX: opt out of inferred props for fn children
    as: asProp || hasRenderProp,
    mapFromValue,
    mapToValue,
    validates,
    validateOn,
    exclusive,
    noValidate,
    errorClass,
    className,
    onChange,
    onBlur,
    value,
  });

  let fieldProps: Partial<FieldInjectedProps> = field;
  if (ref) fieldProps.ref = ref;

  if (typeof children === 'function') {
    return children(fieldProps as FieldRenderProps, meta);
  }

  let Input = asProp || meta.nativeTagName;

  if (injectMeta ?? typeof Input !== 'string') {
    fieldProps.meta = meta;
  }

  return (
    <Input {...rest} {...fieldProps} type={meta.nativeType}>
      {children}
    </Input>
  );
});

_Field.displayName = 'Field';

_Field.propTypes = {
  name: PropTypes.string.isRequired,

  as: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string]),
  validateOn: PropTypes.oneOfType([
    PropTypes.shape({
      change: PropTypes.bool,
      blur: PropTypes.bool,
    }),
    PropTypes.oneOf(['change', 'blur']),
    PropTypes.func,
  ]),
  mapFromValue: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object,
  ]),
  mapToValue: PropTypes.func,
  errorClass: PropTypes.string,
  validates: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  exclusive: PropTypes.bool,
  noValidate: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  injectMeta: PropTypes.bool,
};

export default _Field;
