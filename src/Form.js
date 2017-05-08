import omit from 'lodash/omit'
import pick from 'lodash/pick';
import expr from 'property-expr';
import React from 'react';
import Container from 'react-input-message/MessageContainer';
import { BindingContext as BC } from 'topeka';
import uncontrollable from 'uncontrollable';
import Promise from 'universal-promise';
import warning from 'warning';
import reach from 'yup/lib/util/reach';
import shallowEqual from 'recompose/shallowEqual';

import errorManager from './errorManager';
import contextTypes from './util/contextType';
import errToJSON from './util/errToJSON';
import createTimeoutManager from './util/timeoutManager';
import registerWithContext from './util/registerWithContext';
import * as ErrorUtils from './util/ErrorUtils';

let BindingContext = BC.ControlledComponent;

let done = e => setTimeout(() => { throw e })
let splitPath = path => {
  let parts = expr.split(path);
  let tail = parts.pop()
  return [expr.join(parts), tail]
}

let isValidationError = err => err && err.name === 'ValidationError';

const YUP_OPTIONS = ['context', 'stripUnknown', 'recursive', 'abortEarly', 'strict'];

function maybeWarn(debug, errors, target) {
  if (!debug) return;

  if (process.env.NODE_ENV !== 'production') {
    let keys = Object.keys(errors)
    warning(!keys.length,
      `[react-formal] (${target}) invalid fields: ${keys.join(', ')}`)
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
class Form extends React.Component {

  static propTypes = {

    /**
     * Form value object, can be left [uncontrolled](/controllables);
     * use the `defaultValue` prop to initialize an uncontrolled form.
     */
    value: React.PropTypes.object,

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
    onChange: React.PropTypes.func,

    /**
     * A unique key that names a `Form` within a surrounding `Form.Context`.
     * Corresponding `Form.Button`s with the same `formKey` will trigger validation.
     */
    formKey: React.PropTypes.string,

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
    errors: React.PropTypes.object,

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
    onError: React.PropTypes.func,

    /**
     * Callback that is called whenever a validation is triggered.
     * It is called _before_ the validation is actually run.
     * ```js
     * function onValidate(event){
     *   let { type, fields, args } = event
     * }
     * ```
     */
    onValidate: React.PropTypes.func,

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
    onSubmit: React.PropTypes.func,

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
    onInvalidSubmit: React.PropTypes.func,

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
    getter: React.PropTypes.func,

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
    setter: React.PropTypes.func,

    /**
     * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
     * made at the expense of a slight delay. Helpful for performance.
     */
    delay: React.PropTypes.number,

    /**
     * Validations will be strict, making no attempt to coarce input values to the appropriate type.
     */
    strict: React.PropTypes.bool,

    /**
     * Turns off input validation for the Form, value updates will continue to work.
     */
    noValidate: React.PropTypes.bool,

    /**
     * A tag name or Component class the Form should render.
     *
     * If `null` are `false` the form will simply render it's child. In
     * this instance there must only be one child.
     */
    component: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string,
      React.PropTypes.oneOf([null, false])
    ]),

    /**
     * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
     * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
     * @type {YupSchema}
     */
    schema(props, name, componentName, ...args) {
      var err = !props.noValidate &&
        React.PropTypes.any.isRequired(props, name, componentName, ...args)

      if (props[name]) {
        let schema = props[name];
        if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate))
          err = new Error('`schema` must be a proper yup schema: (' + componentName + ')')
      }

      return err
    },

    /**
     * yup schema context
     */
    context: React.PropTypes.object,

    /**
     * toggle debug mode, which `console.warn`s validation errors
     */
    debug: React.PropTypes.bool,
  }

  static defaultProps = {
    ...BindingContext.defaultProps,
    component: 'form',
    strict: false,
    delay: 300,
    getter: (path, model) => path ? expr.getter(path, true)(model || {}) : model
  }

  static contextTypes = {
    reactFormalContext: React.PropTypes.object
  }

  static childContextTypes = contextTypes

  constructor(props, context){
    super(props, context)

    this.queue = []
    this.pathOptions = Object.create(null)
    this.timeouts = createTimeoutManager(this);
    this.errors = errorManager(this.handleValidate)

    registerWithContext(this, this.submit);
  }

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props, nextProps)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.schema !== this.props.schema){
      this.enqueue(Object.keys(nextProps.errors || {}))
    }
    this.flush(nextProps.delay)
  }

  getChildContext() {
    let { noValidate, schema, ...options } = this.props
    let context = this._context && this._context.reactFormalContext;

    if (
      !context ||
      context.schema !== schema ||
      context.noValidate !== noValidate
    ) {
      this._context = {
        reactFormalContext: {
          options,
          noValidate,
          registerForm: null,
          submitForm: this.handleContextSubmit,
          schema: this.getSchemaForPath,
          onFieldError: this.handleFieldError,
        }
      }
    }

    return this._context;
  }

  handleValidate = (path, { props }) => {
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

  handleValidationRequest = (e) => {
    let { noValidate, delay } = this.props;

    if (noValidate)
      return

    this.notify('onValidate', e)
    this.enqueue(e.fields)

    if (e.type !== 'onChange')
      this.flush(delay)
  }

  handleFieldError = (name, fieldErrors) => {
    const { errors } = this.props;

    this.handleError(Object.assign(
      ErrorUtils.remove(errors, name),
      fieldErrors
    ))
  }

  handleError = errors => {
    this.notify('onError', errors)
  }

  handleContextSubmit = (formName) => {
    let key = this.props.formKey || '@@parent'

    if (formName && formName !== key)
      throw new Error('Cannot trigger a submit for a Form from within a different form')

    this.handleSubmit()
  }

  handleSubmit = e => {
    if (e && e.preventDefault)
      e.preventDefault()

    clearTimeout(this.submitTimer)
    this.submitTimer = setTimeout(()=> this.submit().catch(done), 0)
  }

  enqueue(fields) {
    this.queue = this.queue.concat(fields)
  }

  flush(delay) {
    this.timeouts.set('flush-validations', () => {
      let fields = this.queue;
      let props = this.props;

      if (!fields.length)
        return;

      this.queue = [];
      this._validate(fields, this.props)
        .then(errors => {
          if (errors !== this.props.errors) {
            maybeWarn(props.debug, errors, 'field validation')
            this.notify('onError', errors)
          }
        })
        .catch(done)
    }, delay)
  }

  getSchemaForPath = (path, props = this.props) => {
    let { schema, value, context } = props;

    return schema && path && reach(schema, path, value, context)
  }

  submit = () => {
    var { schema, noValidate, value, debug, ...options } = this.props

    options.abortEarly = false
    options.strict = false

    if (noValidate)
      return Promise.resolve(true)
        .then(() => this.notify('onSubmit', value))

    let handleSuccess = validatedValue =>
      this.notify('onSubmit', validatedValue)

    let handleError = err => {
      if (!isValidationError(err))
        throw err;

      var errors = errToJSON(err)

      maybeWarn(debug, errors, 'onSubmit')

      this.notify('onError', errors)
      this.notify('onInvalidSubmit', errors)
    }

    return schema
      .validate(value, options)
      // no catch, we aren't interested in errors from onSubmit handlers
      .then(handleSuccess, handleError)
  }

  _validate(fields, props = this.props) {
    return this.errors.collect(
      fields,
      props.errors,
      { props }
    )
  }

  validate(fields) {
    return this._validate(fields)
  }

  validateGroup(groups) {
    let fields = this._container.fieldsForGroup(groups);
    return this.validate(fields)
  }

  render() {
    var {
        children
      , onChange
      , value
      , component: Element
      , getter
      , setter
      , errors
      , __messageContainer: containerProps = {} // eslint-disable-line
    } = this.props;

    let props = omit(this.props, [
      '__messageContainer',
      ...YUP_OPTIONS,
      ...Object.keys(Form.propTypes),
    ]);

    if (Element === 'form')
      props.noValidate = true // disable html5 validation

    props.onSubmit = this.handleSubmit

    if (Element === null || Element === false) {
      children = React.cloneElement(
        React.Children.only(children),
        props
      )
    } else  {
      children = (
        <Element {...props}>
          { children }
        </Element>
      )
    }

    if (!containerProps.passthrough) {
      containerProps.messages = errors
    }

    return (
      <BindingContext
        value={value}
        onChange={onChange}
        getter={getter}
        setter={setter}
      >
        <Container
          {...containerProps}
          ref={ref => this._container = ref}
          onValidationNeeded={this.handleValidationRequest}
        >
          {children}
        </Container>
      </BindingContext>
    );
  }

  notify(event, ...args){
    if (this.props[event])
      this.props[event](...args)
  }
}

export default uncontrollable(Form,
  {
    value: 'onChange',
    errors: 'onError'
  },
  ['submit', 'validateGroup', 'validate']
)
