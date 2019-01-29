import cn from 'classnames'
import omit from 'lodash/omit'
import React from 'react'
import PropTypes from 'prop-types'
import elementType from 'prop-types-extra/lib/elementType'
import { Binding } from 'topeka'
import warning from 'warning'
import memoize from 'memoize-one'
import shallowequal from 'shallowequal'

import config from './config'
import isNativeType from './utils/isNativeType'
import { inclusiveMapErrors, filterAndMapErrors } from './utils/ErrorUtils'
import { withState, FORM_DATA, FormActionsContext } from './Contexts'
import createEventHandler from './utils/createEventHandler'

function notify(handler, args) {
  handler && handler(...args)
}

function resolveToNativeType(type) {
  if (type === 'boolean') return 'checkbox'
  return isNativeType(type) ? type : 'text'
}

function getValueProps(type, value, props) {
  if (value == null) value = ''
  switch (type) {
    case 'radio':
    case 'checkbox':
      return { value: props.value, checked: value }
    case 'file':
      return { value: '' }
    default:
      return { value }
  }
}
function isFilterErrorsEqual([a], [b]) {
  let isEqual =
    (a.errors === b.errors || shallowequal(a.errors, b.errors)) &&
    a.names === b.names &&
    a.mapErrors === b.mapErrors

  // !isEqual && console.log('filter equalg cm ""', a.errors, b.errors)
  return isEqual
}

/**
 * The Field Component renders a form control and handles input value updates and validations.
 * Changes to the Field value are automatically propagated back up to the containing Form
 * Component.
 *
 * Fields provide a light abstraction over normal input components where values and onChange handlers
 * are take care of for you. Beyond that they just render the input for their type, Fields whille pass along
 * any props and children to the input so you can easily configure new input types.
 *
 * ```jsx { "editable": true }
 * <Form
 *   noValidate
 *   schema={modelSchema}
 *   defaultValue={{
 *     name: { first: 'Sally'},
 *     colorID: 0
 *   }}
 * >
 *     <label htmlFor="example-firstName">Name</label>
 *     <Form.Field
 *       name='name.first'
 *       placeholder='First name'
 *       id="example-firstName"
 *     />
 *     <label htmlFor="example-color">Favorite Color</label>
 *     <Form.Field
 *       as='select'
 *       name='colorId'
 *       id="example-color"
 *     >
 *       <option value={0}>Red</option>
 *       <option value={1}>Yellow</option>
 *       <option value={2}>Blue</option>
 *       <option value={3}>other</option>
 *     </Form.Field>
 *   <Form.Submit type='submit'>Submit</Form.Submit>
 * </Form>
 * ```
 *
 * In addition to injecting Field components with events and the field `value`, a
 * special prop called `meta` is also provided to all Field renderer components. `meta`
 * contains a bunch of helpful context as well some methods for doing advanced field operations.
 *
 * ```ts
 * interface Meta {
 *   value: any;                // the Field Value
 *   valid: boolean;            // Whether the field is currently valid
 *   invalid: boolean;          // inverse of valid
 *   touched: boolean:          // whether the field has been touched yet
 *   errors: ErrorObjectMap;    // the errors for this field and any neted fields
 *   schema?: YupSchema;        // The schema for this field
 *   context: YupSchemaContext; // the yup context object
 *   // onError allows manually _replacing_ errors for the Field `name`
 *   // any existing errors for this path will be removed first
 *   onError(errors: ErrorObjectMap): void
 * }
 * ```
 *
 */
class Field extends React.PureComponent {
  static defaultProps = {
    as: 'input',
    exclusive: false,
    fieldRef: null,
  }

  constructor(...args) {
    super(...args)
    this.eventHandlers = {}

    this.getEventHandlers = createEventHandler(event => (...args) => {
      notify(this.props[event], args)
      notify(this.props.bindingProps[event], args)
      this.handleValidateField(event, args)
    })

    this.memoFilterAndMapErrors = memoize(
      filterAndMapErrors,
      isFilterErrorsEqual
    )
  }

  buildMeta() {
    let {
      name,
      touched,
      exclusive,
      errors,
      actions,
      yupContext,
      submits,
      bindingProps,
      errorClass = config.errorClass,
    } = this.props

    let schema
    try {

      schema = actions.getSchemaForPath && name && actions.getSchemaForPath(name)
    } catch (err) { /* ignore */ } // prettier-ignore

    let meta = {
      schema,
      touched,
      errorClass,
      context: yupContext,
      onError: this.handleFieldError,
      ...submits,
    }

    const filteredErrors = this.memoFilterAndMapErrors({
      errors,
      names: name,
      mapErrors: !exclusive ? inclusiveMapErrors : undefined,
    })

    meta.errors = filteredErrors
    meta.invalid = !!Object.keys(filteredErrors).length
    meta.valid = !meta.invalid

    // put the original value on meta incase the coerced one differs
    meta.value = bindingProps.value
    return meta
  }

  handleValidateField(event, args) {
    const { name, validates, actions, noValidate } = this.props

    if (noValidate || !actions) return

    let fieldsToValidate = validates != null ? [].concat(validates) : [name]

    actions.onValidate(fieldsToValidate, event, args)
  }

  handleFieldError = errors => {
    let { name, actions } = this.props

    return actions.onFieldError(name, errors)
  }

  render() {
    let {
      name,
      type,
      children,
      className,
      fieldRef,
      noMeta,
      noValidate,
      noResolveType,
      bindingProps,
      actions,
      as: Input,
      asProps,
      events = config.events,
    } = this.props

    const meta = this.buildMeta()

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !actions || noValidate || !name || meta.schema,
        `There is no corresponding schema defined for this field: "${name}" ` +
          "Each Field's `name` prop must be a valid path defined by the parent Form schema"
      )
    }

    let resolvedType = type || (meta.schema && meta.schema._type)

    meta.resolvedType = resolvedType
    // console.log(meta, events(meta))
    let eventHandlers = this.getEventHandlers(
      typeof events === 'function' ? events(meta) : events
    )

    let fieldProps = Object.assign(
      { name, type },
      omit(this.props, Object.keys(Field.propTypes)),
      bindingProps,
      eventHandlers
    )

    // ensure that no inputs are left uncontrolled
    let value = bindingProps.value === undefined ? null : bindingProps.value

    fieldProps.value = value

    if (!noValidate) {
      fieldProps.className = cn(className, meta.invalid && meta.errorClass)
    }

    if (!noMeta) fieldProps.meta = meta
    if (fieldRef) fieldProps.ref = fieldRef

    // Escape hatch for more complex Field types.
    if (typeof children === 'function') {
      fieldProps.type = resolveToNativeType(resolvedType)
      return children(fieldProps)
    }

    // in the case of a plain input do some schema -> native type mapping
    if (Input === 'input' && !type) {
      fieldProps.type = resolveToNativeType(resolvedType)
    }

    return (
      <Input
        {...asProps}
        {...fieldProps}
        {...getValueProps(fieldProps.type, value, this.props)}
      >
        {children}
      </Input>
    )
  }
}

Field.propTypes = {
  /**
   * The Field name, which should be path corresponding to a specific form `value` path.
   *
   * ```js
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
  name: PropTypes.string.isRequired,

  /**
   * The Component Input the form should render. You can sepcify a native element such as 'textbox' or 'select'
   * or provide a Component type class directly. When no type is provided the Field will attempt determine
   * the correct input from the Field's schema. A Field corresponding to a `yup.number()`
   * will render a `type='number'` input by default.
   *
   * ```jsx { "editable": true }
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
  as: PropTypes.oneOfType([elementType, PropTypes.string]),

  /**
   * Event name or array of event names that the Field should trigger a validation.
   * You can also specify a function that receives the Field `meta` object and returns an array of events
   * in order to change validation strategies based on validity.
   */
  events: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.func,
  ]),

  /**
   * Customize how the Field value maps to the overall Form `value`.
   * `mapFromValue` can be a a string property name or a function that returns a
   * value for `name`'d path, allowing you to set commuted values from the Field.
   *
   * ```js
   * <Form.Field
   *   name='name'
   *   mapFromValue={fieldValue => fieldValue.first + ' ' + fieldValue.last}
   * />
   * ```
   *
   * You can also provide an object hash, mapping paths of the Form `value`
   * to fields in the field value using a string field name, or a function accessor.
   *
   * ```js { "editable": true }
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
  mapFromValue: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object,
  ]),

  /**
   * Map the Form value to the Field value. By default
   * the `name` of the Field is used to extract the relevant
   * property from the Form value.
   *
   * ```js
   * <Form.Field
   *   name='location'
   *   type="dropdownlist"
   *   mapToValue={model=> pick(model, 'location', 'locationId')}
   * />
   * ```
   */
  mapToValue: PropTypes.func,

  /**
   * The css class added to the Field Input when it fails validation
   */
  errorClass: PropTypes.string,

  /**
   * Tells the Field to trigger validation for specific paths.
   * Useful when used in conjuction with a `mapFromValue` hash that updates more than one value, or
   * if you want to trigger validation for the parent path as well.
   *
   * > NOTE! This overrides the default behavior of validating the field itself by `name`,
   * include the `name` if you want the field to validate itself.
   *
   * ```jsx
   * <Form.Field name='name.first' validates="name.last" />
   * <Form.Field name='name' validates={['name', 'surname']} />
   * ```
   */
  validates: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  /**
   * Indicates whether child fields of the named field
   * affect the active state ofthe field.
   *
   * ```js
   * -> 'names'
   * -> 'names.first'
   * -> 'names.last'
   * ```
   *
   * Are all considered "part" of a field named `'names'` by default.
   */
  exclusive: PropTypes.bool,

  /**
   * Disables validation for the Field.
   */
  noValidate: PropTypes.bool,

  /**
   * When children is the traditional react element or nodes, they are
   * passed through as-is to the Field `type` component.
   *
   * ```jsx
   * <Field type='select'>
   *   <option>red</option>
   *   <option>red</option>
   * </Field>
   * ```
   *
   * When `children` is a function, its called with the processed field
   * props and the resolved Field Input component, for more advanced use cases
   *
   * ```jsx
   * <Field name='birthDate'>
   *  {(props, Input) =>
   *    <DataProvider>
   *      <Input {...props} />
   *    </DataProvider>
   *  }
   * </Field>
   * ```
   */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  /**
   * Instruct the field to not inject the `meta` prop into the input
   */
  noMeta: PropTypes.bool,

  /**
   * Attach a ref to the rendered input component
   */
  fieldRef: PropTypes.func,

  /** @private */
  noResolveType: PropTypes.bool,
  /** @private */
  bindingProps: PropTypes.object,
  /** @private */
  yupContext: PropTypes.any,
  /** @private */
  errors: PropTypes.object,
  /** @private */
  touched: PropTypes.bool,
  /** @private */
  actions: PropTypes.object,
  /** @private */
  submits: PropTypes.shape({
    submitAttempts: PropTypes.number,
    submitCount: PropTypes.number,
    submitting: PropTypes.bool,
  }),
}

export default withState((ctx, props, ref) => {
  let { mapToValue, mapFromValue, name, fieldRef, ...rest } = props

  return (
    <Binding bindTo={mapToValue || name} mapValue={mapFromValue}>
      {bindingProps => (
        <FormActionsContext.Consumer>
          {actions => (
            <Field
              {...rest}
              name={name}
              actions={actions}
              fieldRef={fieldRef || ref}
              bindingProps={bindingProps}
              errors={ctx.errors}
              yupContext={ctx.yupContext}
              noValidate={ctx.noValidate}
              submits={ctx.submits}
              touched={ctx.touched[name]}
              noValidate={
                props.noValidate == null ? ctx.noValidate : props.noValidate
              }
            />
          )}
        </FormActionsContext.Consumer>
      )}
    </Binding>
  )
}, FORM_DATA.ERRORS | FORM_DATA.TOUCHED | FORM_DATA.SUBMITS | FORM_DATA.YUP_CONTEXT | FORM_DATA.NO_VALIDATE)
