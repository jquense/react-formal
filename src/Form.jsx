import React from 'react';
import scu from 'react-pure-render/function';
import warning from 'warning';
import reach from 'yup/lib/util/reach';
import expr from 'property-expr';
import Validator from 'react-input-message/Validator';
import Container from 'react-input-message/MessageContainer';
import uncontrollable from 'uncontrollable';
import paths from './util/paths';
import contextTypes from './util/contextType';
import errToJSON from './util/errToJSON';
import { BindingContext as BC } from 'topeka';

let BindingContext = BC.ControlledComponent;

let done = e => setTimeout(() => { throw e })
let getParent = path => expr.join(expr.split(path).slice(0, -1))

let isValidationError = err => err && err.name === 'ValidationError';

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
    ]).isRequired,

    /**
     * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
     * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
     * @type {YupSchema}
     */
    schema(props, name, componentName) {
      var err = !props.noValidate && React.PropTypes.any.isRequired(props, name, componentName)

      if (props[name]) {
        let schema = props[name];
        if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate))
          err = new Error('`schema` must be a proper yup schema: (' + componentName + ')')
      }

      return err
    }
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

    this._queue = []
    this._pathOptions = Object.create(null)
    this._handleValidationRequest = this._handleValidationRequest.bind(this)

    this._schema = this._schema.bind(this)
    this.submit = this.submit.bind(this)
    // silence the real submit
    let timer;
    this.onSubmit = e => {
      if (e && e.preventDefault)
        e.preventDefault()

      clearTimeout(timer)
      timer = setTimeout(()=> this.submit().catch(done), 0)
    }

    this._setPathOptions = (path, options) => {
      this._pathOptions[path] = options;
    }

    this.validator = new Validator((path, { props }) => {
      var model = props.value
        , schema = this._schema(path)
        , value = props.getter(path, model)
        , parent = props.getter(getParent(path), model) || {}
        , options = this._pathOptions[path] || {};

      return schema
        .validate(value, { ...props, ...options, parent, path })
        .then(() => void 0)
        .catch(err => {
          if (isValidationError(err))
            return errToJSON(err)
          throw err;
        })
    })

    syncErrors(this.validator, props.errors || {})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return scu.call(this, nextProps, nextState)
  }

  componentDidMount() {
    this._registerWithContext();
  }

  componentWillUnmount() {
    var timers = this._timers || {};

    this._unmounted = true;
    for (var k in timers) if (has(timers, k))
      clearTimeout(timers[k])
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this._registerWithContext(nextContext);

    if (nextProps.schema !== this.props.schema){
      this._queueValidation({
        fields: Object.keys(nextProps.errors || {})
      })
    }

    syncErrors(this.validator, nextProps.errors || {})

    //if (nextProps.value !== this.props.value)
    this._flushValidations(nextProps.delay)
  }

  getChildContext() {
    let { noValidate, schema } = this.props
    let context = this._context && this._context.reactFormalContext;

    if (!context || context.noValidate !== noValidate || context.schema !== schema )
      this._context = {
        reactFormalContext: {
          noValidate,
          schema: this._schema,
          onSubmit: this.onSubmit,
          onOptions: this._setPathOptions,
          submit: null
        }
      }

    return this._context
  }

  render() {
    var {
        children
      , onChange
      , value
      , component: Element
      , getter, setter
      , ...props } = this.props;

    if (Element === 'form')
      props.noValidate = true // disable html5 validation

    props.onSubmit = this.onSubmit

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

    return (
      <BindingContext
        value={value}
        onChange={onChange}
        getter={getter}
        setter={setter}
      >
        <Container
          ref={ref => this._container = ref}
          messages={this.props.errors}
          onValidationNeeded={this._handleValidationRequest}
        >
          {children}
        </Container>
      </BindingContext>
    );
  }

  _handleValidationRequest(e) {
    if (this.props.noValidate)
      return

    this.notify('onValidate', e)
    this._queueValidation(e)

    if (e.type !== 'onChange')
      this._flushValidations(this.props.delay)
  }

  _processValidations(fields, props) {
    return this
      ._validate(fields, props)
      .then(errors => {
        this._maybeWarnDebug(props.debug, errors, 'field validation')
        this.notify('onError', errors)
      })
      .catch(done)
  }

  _validate(fields, props = this.props) {
    return this.validator
      .validate(fields, { props })
  }

  validate(fields) {
    return this._validate(fields)
  }

  validateGroup(groups) {
    let fields = this._container.fieldsForGroup(groups);

    return this._validate(fields)
  }

  submit() {
    var { schema, noValidate, value, debug, ...options } = this.props

    options.abortEarly = false
    options.strict = false

    if (noValidate)
      return this.notify('onSubmit', value)

    let handleSubmit = validatedValue =>
      this.notify('onSubmit', validatedValue)

    let handleError = err => {
      if (!isValidationError(err))
        throw err;

      var errors = errToJSON(err)

      this._maybeWarnDebug(debug, errors, 'onSubmit')

      this.notify('onError', errors)
      this.notify('onInvalidSubmit', errors)
    }

    return schema
      .validate(value, options)
      // no catch, we aren't interested in errors from onSubmit handlers
      .then(handleSubmit, handleError)
  }

  timeout(key, fn, ms){
    this._timers || (this._timers = Object.create(null));

    if (this._unmounted) return

    clearTimeout(this._timers[key])
    this._timers[key] = setTimeout(fn, ms)
  }

  _schema(path) {
    let { schema, value, context } = this.props;

    return schema && path && reach(schema, path, value, context)
  }

  _queueValidation(e){
    this._queue = paths.reduce(uniq(this._queue.concat(e.fields)))
  }

  _flushValidations(delay){
    this.timeout('flush-validations', () => {
      var fields = this._queue;
      this._queue = [];
      if (fields.length)
        this._processValidations(fields, this.props)
    }, delay)
  }

  _registerWithContext(context = this.context) {
    if (context.reactFormalContext) {
      let { registerSubmit } = context.reactFormalContext;

      if (registerSubmit)
        registerSubmit(this.submit)
    }
  }

  _maybeWarnDebug(debug, errors, target) {
    if (!debug) return;

    if (process.env.NODE_ENV !== 'production') {
      let keys = Object.keys(errors)
      warning(!keys.length,
        `[react-formal] (${target}) invalid fields: ${keys.join(', ')}`)
    }
  }

  notify(event, ...args){
    this.props[event] && this.props[event](...args)
  }
}


module.exports = uncontrollable(Form,
  { value: 'onChange', errors: 'onError' },
  ['submit', 'validateGroup', 'validate']
)


function uniq(arr){
  return arr.filter((item, i) => arr.indexOf(item) === i)
}



function syncErrors(validator, errors = {}){
  validator._errors = {}
  Object.keys(errors).forEach(key => {
    if (errors[key] != null)
      validator._errors[key] = [].concat(errors[key])
  })
}

function has(o, k){
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false
}
