import cn from 'classnames'
import omit from 'lodash/omit'
import React from 'react'
import PropTypes from 'prop-types'
import { Binding } from 'topeka'
import warning from 'warning'
import memoize from 'memoize-one'
import shallowequal from 'shallowequal'

import config from './config'
import isNativeType from './utils/isNativeType'
import resolveFieldComponent from './utils/resolveFieldComponent'
import {
  EMPTY_ERRORS,
  inclusiveMapMessages,
  filterAndMapMessages,
} from './utils/ErrorUtils'
import { withState } from './FormContext'
import createEventHandler from './utils/createEventHandler'

function notify(handler, args) {
  handler && handler(...args)
}

function isFilterMessagesEqual(a, b) {
  let isEqual =
    (a.messages === b.messages || shallowequal(a.messages, b.messages)) &&
    a.names === b.names &&
    a.mapMessages === b.mapMessages

  // !isEqual && console.log('filter equal', a.messages, b.messages)
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
 * ```editable
 * <Form
 *   noValidate
 *   schema={modelSchema}
 *   defaultValue={{
 *     name: { first: 'Sally'},
 *     colorID: 0
 *   }}
 * >
 *   <label>Name</label>
 *   <Form.Field
 *     name='name.first'
 *     placeholder='First name'
 *   />
 *
 *   <label>Favorite Color</label>
 *   <Form.Field name='colorId' type='select'>
 *     <option value={0}>Red</option>
 *     <option value={1}>Yellow</option>
 *     <option value={2}>Blue</option>
 *     <option value={3}>other</option>
 *   </Form.Field>
 *   <Form.Submit type='submit'>Submit</Form.Submit>
 * </Form>
 * ```
 */
class Field extends React.PureComponent {
  static defaultProps = {
    type: '',
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

    this.memoFilterAndMapMessages = memoize(
      filterAndMapMessages,
      isFilterMessagesEqual
    )
  }

  buildMeta() {
    let {
      name,
      exclusive,
      messages,
      formMethods,
      yupContext,
      submitting = false,
      errorClass = config.errorClass,
    } = this.props

    let schema
    try {

      schema = formMethods.getSchemaForPath && name && formMethods.getSchemaForPath(name)
    } catch (err) { /* ignore */ } // prettier-ignore

    let meta = {
      schema,
      errorClass,
      context: yupContext,
      onError: this.handleFieldError,
    }

    const errors = this.memoFilterAndMapMessages({
      messages,
      names: name,
      mapMessages: !exclusive ? inclusiveMapMessages : undefined,
    })

    meta.errors = errors
    meta.invalid = !!Object.keys(errors).length
    meta.valid = !meta.invalid
    meta.submitting = submitting

    return meta
  }

  handleValidateField(event, args) {
    const {
      name,
      alsoValidates,
      onlyValidates,
      formMethods,
      noValidate,
    } = this.props

    if (noValidate || !formMethods) return

    let fieldsToValidate = [name]

    if (onlyValidates != null) fieldsToValidate = onlyValidates
    else if (alsoValidates != null) fieldsToValidate.concat(alsoValidates)

    formMethods.onValidate(fieldsToValidate, event, args)
  }

  handleFieldError = errors => {
    let { name, formMethods } = this.props

    return formMethods.onFieldError(name, errors)
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
      formMethods,
      events = config.events,
    } = this.props

    let fieldProps = Object.assign(
      { name },
      omit(this.props, Object.keys(Field.propTypes)),
      bindingProps,
      this.getEventHandlers(events)
    )

    // ensure that no inputs are left uncontrolled
    fieldProps.value =
      bindingProps.value === undefined ? null : bindingProps.value

    const meta = this.buildMeta()

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !formMethods || noValidate || !name || meta.schema,
        `There is no corresponding schema defined for this field: "${name}" ` +
          "Each Field's `name` prop must be a valid path defined by the parent Form schema"
      )
    }

    let [Component, resolvedType] = !noResolveType
      ? resolveFieldComponent(type, meta.schema)
      : [null, type]

    fieldProps.type = isNativeType(resolvedType) ? resolvedType : undefined

    meta.resolvedType = resolvedType

    if (!noValidate) {
      fieldProps.className = cn(className, meta.invalid && meta.errorClass)
    }

    if (!noMeta) fieldProps.meta = meta
    if (fieldRef) fieldProps.ref = fieldRef

    // Escape hatch for more complex Field types.
    if (typeof children === 'function') {
      return children(fieldProps, Component)
    }

    return <Component {...fieldProps}>{children}</Component>
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
   * The Component Input the form should render. You can sepcify a builtin type
   * with a string name e.g `'text'`, `'datetime-local'`, etc. or provide a Component
   * type class directly. When no type is provided the Field will attempt determine
   * the correct input from the corresponding scheme. A Field corresponding to a `yup.number()`
   * will render a `type='number'` input by default.
   *
   * ```editable
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
   *     type={MyDateInput}/>
   *
   * </Form>
   * ```
   * Custom Inputs should comply with the basic input api contract: set a value via a `value` prop and
   * broadcast changes to that value via an `onChange` handler.
   *
   * You can also permenantly map Components to a string `type` name via the top-level
   * `addInputType()` api.
   */
  type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /**
   * Event name or array of event names that the Field should trigger a validation.
   */
  events: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  /**
   * Customize how the Field value maps to the overall Form `value`.
   * `mapFromValue` can be a a string property name or a function that returns a
   * value for `name`'d path, allowing you to set commuted values from the Field.
   *
   * ```js
   * <Form.Field name='name'
   *   mapFromValue={fieldValue => fieldValue.first + ' ' + fieldValue.last}
   * />
   * ```
   *
   * You can also provide an object hash, mapping paths of the Form `value`
   * to fields in the field value using a string field name, or a function accessor.
   *
   * ```editable
   * <Form
   *   schema={modelSchema}
   *   defaultValue={modelSchema.default()}
   * >
   *   <label>Name</label>
   *   <Form.Field
   *     name='name.first'
   *     placeholder='First name'
   *   />
   *
   *   <label>Date of Birth</label>
   *   <Form.Field name='dateOfBirth'
   *     mapFromValue={{
   *       'dateOfBirth': date => date,
   *       'age': date =>
   *         (new Date()).getFullYear() - date.getFullYear()
   *   }}/>

   *   <label>Age</label>
   *   <Form.Field name='age'/>
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
   * Tells the Field to trigger validation for addition paths as well as its own (`name`).
   * Useful when used in conjuction with a `mapFromValue` hash that updates more than one value, or
   * if you want to trigger validation for the parent path as well.
   *
   * ```js
   * <Form.Field name='name.first' alsoValidates="name" />
   * <Form.Field name='name.last' alsoValidates={['name', 'surname']} />
   * ```
   */
  alsoValidates: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  onlyValidates: PropTypes.oneOfType([
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
  messages: PropTypes.object,
  /** @private */
  formMethods: PropTypes.object,
  /** @private */
  getSchemaForPath: PropTypes.func,
  /** @private */
  submitting: PropTypes.bool,
}

export default withState(
  (
    formMethods,
    messages = EMPTY_ERRORS,
    submitting,
    noValidate,
    yupContext,
    props,
    ref
  ) => {
    let { mapToValue, mapFromValue, name, fieldRef, ...rest } = props

    return (
      <Binding bindTo={mapToValue || name} mapValue={mapFromValue}>
        {bindingProps => (
          <Field
            {...rest}
            name={name}
            fieldRef={fieldRef || ref}
            bindingProps={bindingProps}
            submitting={submitting}
            messages={messages}
            yupContext={yupContext}
            formMethods={formMethods}
            noValidate={
              props.noValidate == null ? noValidate : props.noValidate
            }
          />
        )}
      </Binding>
    )
  },
  [
    state => state.formMethods,
    state => state.messages,
    state => state.submitting,
    state => state.noValidate,
    state => state.yupContext,
  ]
)
