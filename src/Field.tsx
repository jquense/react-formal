import PropTypes from 'prop-types'
import elementType from 'prop-types-extra/lib/elementType'
import React from 'react'
import useField, {
  FieldMeta,
  MapFromValue,
  MapToValue,
  TriggerEvents,
} from './useField'
import { useMergedHandlers } from './utils/useEventHandlers'

interface FieldProps {
  /**
   * The Component Input the form should render. You can sepcify a native element such as 'textbox' or 'select'
   * or provide a Component type class directly. When no type is provided the Field will attempt determine
   * the correct input from the Field's schema. A Field corresponding to a `yup.number()`
   * will render a `type='number'` input by default.
   *
   * ```jsx
   * <Form noValidate schema={modelSchema}>
   *   Use the schema to determine type
   *   <Form.Field
   *     name='dateOfBirth'
   *     placeholder='date'
   *   />
   *
   *   Override it!
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
   *     as={MyDateInput}/>
   *
   * </Form>
   * ```
   *
   * Custom Inputs should comply with the basic input api contract: set a value via a `value` prop and
   * broadcast changes to that value via an `onChange` handler.
   */
  as?: React.ElementType

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
  name: string

  /**
   * Event name or array of event names that the Field should trigger a validation.
   * You can also specify a function that receives the Field `meta` object and returns an array of events
   * in order to change validation strategies based on validity.
   */
  events?: TriggerEvents

  /**
   * Customize how the Field value maps to the overall Form `value`.
   * `mapFromValue` can be a a string property name or a function that returns a
   * value for `name`'d path, allowing you to set commuted values from the Field.
   *
   * ```js static
   * <Form.Field
   *   name='name'
   *   mapFromValue={fieldValue => fieldValue.first + ' ' + fieldValue.last}
   * />
   * ```
   *
   * You can also provide an object hash, mapping paths of the Form `value`
   * to fields in the field value using a string field name, or a function accessor.
   *
   * ```js
   * <Form
   *   schema={modelSchema}
   *   defaultValue={modelSchema.default()}
   * >
   *   <label htmlFor="ex-mapToValue-firstName">Name</label>
   *   <Form.Field
   *     name='name.first'
   *     placeholder='First name'
   *     id="ex-mapToValue-firstName"
   *   />
   *
   *   <label htmlFor="ex-mapToValue-dob">Date of Birth</label>
   *   <Form.Field
   *     name='dateOfBirth'
   *     id="ex-mapToValue-dob"
   *     mapFromValue={{
   *       'dateOfBirth': date => date,
   *       'age': date =>
   *         (new Date()).getFullYear() - date.getFullYear()
   *   }}/>
   *
   *   <label htmlFor="ex-mapToValue-age">Age</label>
   *   <Form.Field name='age' id="ex-mapToValue-age"/>
   *
   *   <Form.Submit type='submit'>Submit</Form.Submit>
   * </Form>
   * ```
   */
  mapFromValue?: MapFromValue

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
  mapToValue?: MapToValue

  /**
   * The css class added to the Field Input when it fails validation
   */
  errorClass?: string

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
  validates?: string | string[]

  /**
   * Indicates whether child fields of the named field
   * affect the active state ofthe field.
   *
   * ```
   * -> 'names'
   * -> 'names.first'
   * -> 'names.last'
   * ```
   *
   * Are all considered "part" of a field named `'names'` by default.
   */
  exclusive?: boolean

  /**
   * Disables validation for the Field.
   */
  noValidate?: boolean

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
    | ((fieldProps: FieldProps, meta: FieldMeta) => React.ReactNode)

  /**
   * A value to pass to checkboxs/radios/boolean inputs
   */
  htmlValue: any

  className?: string

  /**
   * Instruct the field to not inject the `meta` prop into the input
   */
  noMeta?: boolean

  /** An HTML input type attribute */
  type?: string

  asProps?: any
}

const Field = React.forwardRef((props: FieldProps, ref) => {
  const {
    children,
    noMeta,
    type,
    asProps,
    as: Input = 'input',
    name,
    mapFromValue,
    mapToValue,
    validates,
    events,
    htmlValue,
    exclusive,
    noValidate,
    errorClass,
    className,
    ...rest
  } = props
  const [field, meta] = useField({
    name,
    type,
    mapFromValue,
    mapToValue,
    validates,
    events,
    exclusive,
    noValidate,
    errorClass,
    className,
    // @ts-ignore
    value: props.value || htmlValue,
  })

  let fieldProps: any = {
    type,
    ...field,
    ...useMergedHandlers(meta.events, props, field),
  }

  if (!noMeta) fieldProps.meta = meta
  if (ref) fieldProps.ref = ref

  // Escape hatch for more complex Field types.
  if (typeof children === 'function') {
    return children(fieldProps, meta)
  }
  console.log('H', fieldProps)

  return (
    <Input {...rest} {...asProps} {...fieldProps} type={meta.nativeType}>
      {children}
    </Input>
  )
})

Field.displayName = 'Field'
Field.defaultProps = {
  as: 'input',
  exclusive: false,
}

// @ts-ignore
Field.propTypes = {
  name: PropTypes.string.isRequired,
  as: PropTypes.oneOfType([elementType, PropTypes.string]),
  events: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
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
  noMeta: PropTypes.bool,
}

export default Field
