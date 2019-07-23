import cn from 'classnames'
import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import elementType from 'prop-types-extra/lib/elementType'
import { useBinding } from 'topeka'
import warning from 'warning'
import memoize from 'memoize-one'
import shallowequal from 'shallowequal'

import config from './config'
import isNativeType from './utils/isNativeType'
import useEventHandlers, {
  useMergedHandlers,
  notify,
} from './utils/useEventHandlers'
import { inclusiveMapErrors, filterAndMapErrors } from './utils/ErrorUtils'
import {
  FormActionsContext,
  FormErrorContext,
  FormSubmitsContext,
  FormTouchedContext,
} from './Contexts'

function resolveToNativeType(type) {
  if (type === 'boolean') return 'checkbox'
  return isNativeType(type) ? type : 'text'
}

function isFilterErrorsEqual([a], [b]) {
  let isEqual =
    (a.errors === b.errors || shallowequal(a.errors, b.errors)) &&
    a.names === b.names &&
    a.mapErrors === b.mapErrors

  // !isEqual && console.log('filter equalg cm ""', a.errors, b.errors)
  return isEqual
}

function useFieldMeta(props, actions) {
  let {
    name,
    type,
    exclusive,
    noValidate,
    errorClass = config.errorClass,
  } = props

  const submits = useContext(FormSubmitsContext)
  const touched = useContext(FormTouchedContext)
  const errors = useContext(FormErrorContext)

  // this is so we get a memoized function that is instance specific
  const memoizedFilter = useMemo(
    () => memoize(filterAndMapErrors, isFilterErrorsEqual),
    []
  )

  let handleFieldError = errors => actions.onFieldError(name, errors)

  let schema
  try {
    schema = actions.getSchemaForPath && name && actions.getSchemaForPath(name)
  } catch (err) { /* ignore */ } // prettier-ignore

  if (process.env.NODE_ENV !== 'production') {
    warning(
      !actions || noValidate || !name || schema,
      `There is no corresponding schema defined for this field: "${name}" ` +
        "Each Field's `name` prop must be a valid path defined by the parent Form schema"
    )
  }

  let meta = {
    schema,
    errorClass,
    context: actions.yupContext,
    touched: touched[name],
    onError: handleFieldError,
    ...submits,
  }

  const filteredErrors = memoizedFilter({
    errors,
    names: name,
    mapErrors: !exclusive ? inclusiveMapErrors : undefined,
  })

  meta.errors = filteredErrors
  meta.invalid = !!Object.keys(filteredErrors).length
  meta.valid = !meta.invalid

  let resolvedType = type || (meta.schema && meta.schema._type)
  meta.resolvedType = resolvedType
  meta.nativeType = resolveToNativeType(resolvedType)

  return meta
}

export function useField(props) {
  let { mapToValue, mapFromValue, name, validates, noValidate } = props

  const formActions = useContext(FormActionsContext)

  const [value, onChange] = useBinding(mapToValue || name, mapFromValue)

  const fieldsToValidate = useMemo(
    () => (validates != null ? [].concat(validates) : [name]),
    [name, validates]
  )

  const meta = useFieldMeta(props, formActions)
  // put the original value on meta in case the coerced one differs
  meta.value = value

  let events = props.events || config.events
  events = typeof events === 'function' ? events(meta) : events

  meta.events = events

  const fieldProps = useEventHandlers(
    events,
    useCallback(
      (event, args) => {
        // console.log(onChange.toString())
        notify(onChange, args)

        if (noValidate || !formActions) return
        formActions.onValidate(fieldsToValidate, event, args)
      },
      [
        onChange,
        noValidate,
        fieldsToValidate,
        formActions && formActions.onValidate,
      ]
    )
  )
  fieldProps.name = name
  fieldProps.value = value == null ? '' : value

  if (/checkbox|radio/.test(meta.nativeType)) {
    fieldProps.checked = fieldProps.value
    fieldProps.value = props.value
  } else if (meta.nativeType === 'file') {
    fieldProps.value = ''
  }

  if (!noValidate) {
    fieldProps.className = cn(props.className, meta.invalid && meta.errorClass)
  }

  return [fieldProps, meta]
}

const Field = React.forwardRef((props, ref) => {
  const { children, noMeta, type, asProps, as: Input } = props
  const [field, meta] = useField(props)

  let fieldProps = {
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

  return (
    <Input {...asProps} {...fieldProps} type={meta.nativeType}>
      {children}
    </Input>
  )
})

Field.displayName = 'Field'
Field.defaultProps = {
  as: 'input',
  exclusive: false,
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

export default Field
