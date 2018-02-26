import omit from 'lodash/omit'
import pick from 'lodash/pick'
import expr from 'property-expr'
import React from 'react'
import PropTypes from 'prop-types'
import { BindingContext as BC } from 'topeka'
import uncontrollable from 'uncontrollable'
import warning from 'warning'
import createContext from 'create-react-context'
import reach from 'yup/lib/util/reach'

import errorManager from './errorManager'
import errToJSON from './utils/errToJSON'
import createTimeoutManager from './utils/timeoutManager'
import * as ErrorUtils from './utils/ErrorUtils'
import MessageContext from './MessageContext'

let BindingContext = BC.ControlledComponent

const ALL_FIELDS = '@all'

let done = e =>
  setTimeout(() => {
    throw e
  })

let uniq = array => array.filter((item, idx) => array.indexOf(item) === idx)

let add = (array, item) => array.indexOf(item) === -1 && array.push(item)

let remove = (array, item) => array.filter(i => i !== item)

let splitPath = path => {
  let parts = expr.split(path)
  let tail = parts.pop()
  return [expr.join(parts), tail]
}

let isValidationError = err => err && err.name === 'ValidationError'

export const { Provider, Consumer } = createContext({
  options: null,
  noValidate: false,
  onFieldError() {},
  getSchemaForPath() {},
  registerForm() {},
  submitForm() {},
  isBusy: null,
  onBusy: null,
})

const YUP_OPTIONS = [
  'context',
  'stripUnknown',
  'recursive',
  'abortEarly',
  'strict',
]

function maybeWarn(debug, errors, target) {
  if (!debug) return

  if (process.env.NODE_ENV !== 'production') {
    let keys = Object.keys(errors)
    warning(
      !keys.length,
      `[react-formal] (${target}) invalid fields: ${keys.join(', ')}`
    )
  }
}

/**
 * Form component renders a `value` to be updated and validated by child Fields.
 * Forms can be thought of as `<input/>`s for complex values, or models. A Form aggregates
 * a bunch of smaller inputs, each in charge of updating a small part of the overall model.
 * The Form will integrate and validate each change and fire a single unified `onChange` with the new `value`.
 *
 * Validation messages can be displayed anywhere inside a Form with Message Components.
 *
 * ```editable
 * var defaultStr = yup.string().default('')
 *
 * var customerSchema = yup
 *   .object({
 *     name: yup.object({
 *       first: defaultStr
 *         .required('please enter a first name'),
 *
 *       last: defaultStr
 *         .required('please enter a surname'),
 *     }),
 *
 *     dateOfBirth: yup.date()
 *       .max(new Date(), "Are you a time traveler?!"),
 *
 *     colorId: yup.number()
 *       .nullable()
 *       .required('Please select a dank color')
 *   });
 *
 * var form = (
 *   <Form
 *     schema={customerSchema}
 *     defaultValue={customerSchema.default()}
 *   >
 *     <div>
 *       {\/\*'grandchildren' are no problem \*\/}
 *       <label>Name</label>
 *
 *       <Form.Field
 *         name='name.first'
 *         placeholder='First name'
 *       />
 *       <Form.Field
 *         name='name.last'
 *         placeholder='Surname'
 *       />
 *
 *       <Form.Message for={['name.first', 'name.last']}/>
 *     </div>
 *
 *     <label>Date of Birth</label>
 *     <Form.Field name='dateOfBirth'/>
 *     <Form.Message for='dateOfBirth'/>
 *
 *     <label>Favorite Color</label>
 *     <Form.Field name='colorId' type='select'>
 *       <option value={null}>Select a color...</option>
 *       <option value={0}>Red</option>
 *       <option value={1}>Yellow</option>
 *       <option value={2}>Blue</option>
 *       <option value={3}>other</option>
 *     </Form.Field>
 *     <Form.Message for='colorId'/>
 *
 *   <Form.Button type='submit'>
 *     Submit
 *   </Form.Button>
 * </Form>)
 * ReactDOM.render(form, mountNode);
 * ```
 */
class Form extends React.PureComponent {
  static propTypes = {
    /**
     * Form value object, can be left [uncontrolled](/controllables);
     * use the `defaultValue` prop to initialize an uncontrolled form.
     */
    value: PropTypes.object,

    /**
     * Callback that is called when the `value` prop changes.
     *
     * ```js
     * function(
     *   value: object,
     *   updatedPaths: array<string>
     * )
     * ```
     */
    onChange: PropTypes.func,

    /**
     * A unique key that names a `Form` within a surrounding `Form.Context`.
     * Corresponding `Form.Button`s with the same `formKey` will trigger validation.
     */
    formKey: PropTypes.string,

    /**
     * An object hash of field errors for the form. The object should be keyed with paths
     * with the values being an array of messages or message objects. Errors can be
     * left [uncontrolled](/controllables) (use `defaultErrors` to set an initial value)
     * or managed along with the `onError` callback. You can use any object shape you'd like for
     * messages, as long as you provide the Form.Message component an `extract` prop that
     * understands how to pull out the strings message. By default it understands strings and objects
     * with a `'message'` property.
     *
     * ```js
     * <Form errors={{
     *  "name.first": [
     *    'First names are required',
     *    {
     *    	message: "Names must be at least 2 characters long",
     *    	type: 'min'
     *    }
     *  ],
     * }}/>
     * ```
     */
    errors: PropTypes.object,

    /**
     * Callback that is called when a validation error occurs. It is called with an `errors` object
     *
     * ```editable
     * <Form schema={modelSchema}
     *   defaultValue={modelSchema.default()}
     *   errors={this.state ? this.state.errors : {}}
     *   onError={errors => {
     *     if( errors.dateOfBirth )
     *       errors.dateOfBirth = 'hijacked!'
     *     this.setState({ errors })
     *   }}>
     *
     *   <Form.Field name='dateOfBirth'/>
     *   <Form.Message for='dateOfBirth'/>
     *
     *   <Form.Button type='submit'>Submit</Form.Button>
     * </Form>
     * ```
     */
    onError: PropTypes.func,

    /**
     * Callback that is called whenever a validation is triggered.
     * It is called _before_ the validation is actually run.
     * ```js
     * function onValidate(event){
     *   let { type, fields, args } = event
     * }
     * ```
     */
    onValidate: PropTypes.func,

    /**
     * Callback that is fired when the native onSubmit event is triggered. Only relevant when
     * the `component` prop renders a `<form/>` tag. onSubmit will trigger only if the form is valid.
     *
     * ```js
     * function onSubmit(formValue){
     *   // do something with valid value
     * }
     * ```
     */
    onSubmit: PropTypes.func,

    /* */
    submitForm: PropTypes.func,

    /**
     * Callback that is fired when the native onSubmit event is triggered. Only relevant when
     * the `component` prop renders a `<form/>` tag. onInvalidSubmit will trigger only if the form is invalid.
     *
     * ```js
     * function onInvalidSubmit(errors){
     *   // do something with errors
     * }
     * ```
     */
    onInvalidSubmit: PropTypes.func,

    /**
     * A value getter function. `getter` is called with `path` and `value` and
     * should return the plain **javascript** value at the path.
     *
     * ```js
     * function(
     *  path: string,
     *  value: any,
     * ) -> object
     * ```
     */
    getter: PropTypes.func,

    /**
     * A value setter function. `setter` is called with `path`, the form `value` and the path `value`.
     * The `setter` must return updated form `value`, which allows you to leave the original value unmutated.
     *
     * The default implementation uses the [react immutability helpers](http://facebook.github.io/react/docs/update.html),
     * letting you treat the form `value` as immutable.
     * ```js
     * function(
     *  path: string,
     *  formValue: object,
     *  pathValue: any
     * ) -> object
     * ```
     */
    setter: PropTypes.func,

    /**
     * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
     * made at the expense of a slight delay. Helpful for performance.
     */
    delay: PropTypes.number,

    /**
     * Validations will be strict, making no attempt to coarce input values to the appropriate type.
     */
    strict: PropTypes.bool,

    /**
     * Turns off input validation for the Form, value updates will continue to work.
     */
    noValidate: PropTypes.bool,

    /**
     * A tag name or Component class the Form should render.
     *
     * If `null` are `false` the form will simply render it's child. In
     * this instance there must only be one child.
     */
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.oneOf([null, false]),
    ]),

    /**
     * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
     * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
     * @type {YupSchema}
     */
    schema(props, name, componentName, ...args) {
      var err =
        !props.noValidate &&
        PropTypes.any.isRequired(props, name, componentName, ...args)

      if (props[name]) {
        let schema = props[name]
        if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate))
          err = new Error(
            '`schema` must be a proper yup schema: (' + componentName + ')'
          )
      }

      return err
    },

    /**
     * yup schema context
     */
    context: PropTypes.object,

    /**
     * toggle debug mode, which `console.warn`s validation errors
     */
    debug: PropTypes.bool,
  }

  static defaultProps = {
    ...BindingContext.defaultProps,
    component: 'form',
    strict: false,
    delay: 300,
    errors: Object.create(null),
    getter: (path, model) =>
      path ? expr.getter(path, true)(model || {}) : model,
  }

  constructor(props, context) {
    super(props, context)

    this.queue = []
    this.groups = Object.create(null)
    this.timeouts = createTimeoutManager(this)
    this.errors = errorManager(this.validatePath)

    this._staticFormContext = {
      registerForm: null,
      submitForm: this.handleContextSubmit,
      getSchemaForPath: this.getSchemaForPath,
      onFieldError: this.handleFieldError,
      onBusy: this.handleIsBusy,
      isBusy: false,
      noValidate: props.noValidate,
      context: props.context,
    }

    this.messageContext = this.getMessageContext(props)
  }

  componentWillReceiveProps(nextProps) {
    const schemaChanged = nextProps.schema !== this.props.schema

    if (nextProps.errors !== this.props.errors)
      this.messageContext = this.getMessageContext(nextProps)

    if (schemaChanged || nextProps.noValidate !== this.props.noValidate) {
      this._staticFormContext = {
        ...this._staticFormContext,
        context: nextProps.context,
        noValidate: nextProps.noValidate,
      }
    }

    if (schemaChanged) {
      this.enqueue(Object.keys(nextProps.errors || {}))
    }

    this.flush(nextProps.delay)
  }

  getMessageContext({ errors }) {
    const { groups: allGroups } = this

    return {
      messages: errors,
      onValidate: this.handleValidationRequest,
      namesForGroup(groups) {
        groups = groups ? [].concat(groups) : []

        if (groups.indexOf(ALL_FIELDS) !== -1) {
          groups = Object.keys(allGroups)
        }
        return uniq(
          groups.reduce((fields, group) => fields.concat(allGroups[group]), [])
        )
      },
      addToGroup(grpName, names) {
        if (grpName === ALL_FIELDS) return

        grpName = grpName || '@@unassigned-group'

        names = names && [].concat(names)

        let group = allGroups[grpName]

        if (!names || !names.length) return
        if (!group) group = allGroups[grpName] = []

        names.forEach(name => add(group, name))
        return () => names.forEach(name => remove(group, name))
      },
    }
  }

  getFormContext() {
    return this._staticFormContext
  }

  validatePath = (path, { props }) => {
    let options = pick(props, YUP_OPTIONS)
    let abortEarly = options.abortEarly == null ? false : options.abortEarly

    let { value, getter } = props
    let schema = this.getSchemaForPath(path, props)

    let [parentPath, currentPath] = splitPath(path)
    let parent = getter(parentPath, value) || {}
    let pathValue = parent != null ? parent[currentPath] : value

    return schema
      .validate(pathValue, { ...options, abortEarly, parent, path })
      .then(() => null)
      .catch(err => err)
  }

  handleValidationRequest = (fields, type, args) => {
    let { noValidate, delay } = this.props
    if (noValidate || !fields || !fields.length) return

    this.notify('onValidate', { type, fields, args })
    this.enqueue(fields)

    if (type !== 'onChange') this.flush(delay)
  }

  handleFieldError = (name, fieldErrors) => {
    const { errors } = this.props

    this.handleError(
      Object.assign(ErrorUtils.remove(errors, name), fieldErrors)
    )
  }

  handleError = errors => {
    this.notify('onError', errors)
  }

  handleSubmitSuccess = validatedValue => {
    const { submitForm } = this.props
    this.notify('onSubmit', validatedValue)

    return Promise.resolve(submitForm && submitForm(validatedValue))
  }

  handleSubmitError = err => {
    if (!isValidationError(err)) throw err

    var errors = errToJSON(err)

    maybeWarn(this.props.debug, errors, 'onSubmit')

    this.notify('onError', errors)
    this.notify('onInvalidSubmit', errors)
  }

  handleContextSubmit = formName => {
    let key = this.props.formKey || '@@parent'

    if (formName && formName !== key)
      throw new Error(
        'Cannot trigger a submit for a Form from within a different form'
      )

    this.handleSubmit()
  }

  handleSubmit = e => {
    if (e && e.preventDefault) e.preventDefault()

    clearTimeout(this.submitTimer)
    this.submitTimer = setTimeout(() => this.submit().catch(done), 0)
  }

  enqueue(fields) {
    this.queue = this.queue.concat(fields)
  }

  flush(delay) {
    this.timeouts.set(
      'flush-validations',
      () => {
        let fields = this.queue
        let props = this.props

        if (!fields.length) return

        this.queue = []
        this.collectErrors(fields, this.props)
          .then(errors => {
            if (errors !== this.props.errors) {
              maybeWarn(props.debug, errors, 'field validation')
              this.notify('onError', errors)
            }
          })
          .catch(done)
      },
      delay
    )
  }

  getSchemaForPath = (path, props = this.props) => {
    let { schema, value, context } = props

    return schema && path && reach(schema, path, value, context)
  }

  submit = () => {
    var { schema, noValidate, value, ...options } = this.props

    options.abortEarly = false
    options.strict = false

    if (noValidate)
      return Promise.resolve(true).then(() => this.notify('onSubmit', value))

    return (
      schema
        .validate(value, options)
        // no catch, we aren't interested in errors from onSubmit handlers
        .then(this.handleSubmitSuccess, this.handleSubmitError)
    )
  }

  collectErrors(fields, props = this.props) {
    return this.errors.collect(fields, props.errors, { props })
  }

  notify(event, ...args) {
    if (this.props[event]) this.props[event](...args)
  }

  validate(fields) {
    return this.collectErrors(fields)
  }

  validateGroup(groups) {
    let fields = this._container.fieldsForGroup(groups)
    return this.validate(fields)
  }

  renderForm(formContext) {
    var {
      children,
      onChange,
      value,
      component: Element,
      getter,
      setter,
    } = this.props

    let props = omit(this.props, [
      ...YUP_OPTIONS,
      ...Object.keys(Form.propTypes),
    ])

    if (Element === 'form') props.noValidate = true // disable html5 validation

    props.onSubmit = this.handleSubmit

    if (Element === null || Element === false) {
      children = React.cloneElement(React.Children.only(children), props)
    } else {
      children = <Element {...props}>{children}</Element>
    }
    return (
      <Provider value={formContext}>
        <MessageContext.Provider value={this.messageContext}>
          <BindingContext
            value={value}
            onChange={onChange}
            getter={getter}
            setter={setter}
          >
            {children}
          </BindingContext>
        </MessageContext.Provider>
      </Provider>
    )
  }
  render() {
    return (
      <Consumer>
        {formContext => {
          formContext.registerForm(this.props.formKey, this.submit)
          return this.renderForm(this.getFormContext(formContext))
        }}
      </Consumer>
    )
  }
}

export default uncontrollable(
  Form,
  {
    value: 'onChange',
    errors: 'onError',
  },
  ['submit', 'validateGroup', 'validate']
)
