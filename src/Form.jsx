'use strict';
var React     = require('react')
  , invariant = require('react/lib/invariant')
  , reach     = require('yup/lib/util/reach')
  , expr      = require('property-expr')
  , updateIn  = require('react/lib/update')
  , Validator = require('react-input-message/lib/Validator')
  , Container = require('react-input-message/lib/MessageContainer')
  , uncontrollable = require('uncontrollable')
  , getChildren    = require('./util/parentContext')
  , toUpdateSpec   = require('./util/pathToUpdateSpec');


let done = e => setTimeout(() => { throw e })

let parent = path => expr.join(expr.split(path).slice(0, -1))

class Form extends React.Component {

  static propTypes = {

    /**
     * Form value object, can be left uncontrolled; 
     * use the `defaultValue` prop to initialize an uncontrolled form
     */
    value: React.PropTypes.object,

    /**
     * Callback that is called when the `value` prop changes.
     */
    onChange: React.PropTypes.func,

    /**
     * An object hash of field errors for the form. The object should be keyed with paths
     * with the values being string messages or an array of messages. Errors can be left 
     * uncontrolled, or managed along with the `onError` callback
     * ```
     * errors={{
     *  "name.first": ['First names are required', "Names must be at least 2 characters long"],
     * }}
     */
    errors: React.PropTypes.object,

    /**
     * Callback that is called when a validation error occures. It is called with an `errors` object
     * ```
     * function onError(errors){
     *   errors['name.first'] // => 'First names are required', "Names must be at least 2 characters long"]
     * }
     * ```
     */
    onError: React.PropTypes.func,

    /**
     * Callback that is called whenever a validation is triggered. 
     * It is called _before_ the validation is actually run.
     * ```
     * function onError(e){
     *   { event, field, args, target } = e
     * }
     * ```
     */
    onValidate: React.PropTypes.func,

    /**
     * A value getter function. `getter` is called with `path` and `value` and 
     * should return the plain **javascript** value at the path
      * ```
     * function(
     *  path: string,
     *  value: any,
     * ) -> object
     * ```
     */
    getter: React.PropTypes.func,

    /**
     * A value setter function. `setter` is called with `path`, the `formValue` and the `pathValue`. 
     * The `setter` must return updated `formvalue`, which allows you to leave the original value unmutated.
     * ```
     * function(
     *  path: string,
     *  formValue: object,
     *  pathValue: any
     * ) -> object
     * ```
     */
    setter: React.PropTypes.func.isRequired,

    strict: React.PropTypes.bool,
    noValidate: React.PropTypes.oneOf([true, 'heelo', 5]),

    otherProp: React.PropTypes.instanceOf(Message),

    component: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string,
    ]).isRequired,

    schema(props, name, componentName) {
      var err = React.PropTypes.any.isRequired(props, name, componentName)

      if (!err && !props[name].__isYupSchema__) 
        err = new Error('`schema` must be a proper yup schema: (' + componentName + ')')

      return err
    }
  }

  static defaultProps = {
    component: 'form',
    strict: true,
    getter: (path, model) => expr.getter(path)(model),
    setter: (path, model, val) => updateIn(model, toUpdateSpec(path, val)),
  }   
    
  static childContextTypes = {

    schema:   React.PropTypes.func,
    value:    React.PropTypes.func,
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func
    
  }

  constructor(props, context){
    super(props, context)

    this.validator = new Validator((path, props) => {
      var model   = props.value
        , schema  = yup.reach(props.schema, path)
        , value   = props.getter(path, model)
        , context = props.getter(parent(path), model);

      return schema.validate(value, { strict: props.strict, context })
        .then(() => void 0)       
        .catch(err => err.errors) 
    })

    this.state = {
      children: getChildren(
            this.props.children
          , this.getChildContext())
    }
  }

  componentWillReceiveProps(nextProps){

    this._flushValidations(nextProps)

    this.setState({ 
      children: getChildren(
          nextProps.children
        , this.getChildContext())
    })
  }

  getChildContext() {

    return this._context || (this._context = { 

      schema:   path => reach(this.props.schema, path), 

      value:    path => this.props.getter(path, this.props.value),

      onChange: (path, updates, val) => this._update(path, val, updates)
    })
  }

  _update(path, widgetValue, mapValue){
    var model = this.props.value
      , updater = this.props.setter;

    if ( process.env.NODE_ENV !== 'production' )
      updater = wrapSetter(updater)

    if (typeof mapValue === 'function')
      model = updater(path, model, mapValue(widgetValue))

    else if (mapValue){
      for( var key in mapValue ) if ( mapValue.hasOwnProperty(key))
        model = updater(key, model, getValue(widgetValue, key, mapValue))
    }
    else
      model = updater(path, model, widgetValue)

    this.notify('onChange', model)

    function getValue(val, key, map){
      let field = map[key]
      return typeof field === 'function' ? field(val) : val[field]
    }
  }

  render() {
    var { 
        children
      , onChange
      , value
      , component: Element
      , ...props } = this.props;
    
    if ( Element === 'form')
      props.noValidate = true // disable html5 validation

    return (
      <Container
        ref={ref => this._container = ref}
        messages={this.props.errors} 
        onValidationNeeded={this.props.noValidate ? ()=> {} : e => this._handleValidationRequest(e)}>
        
        <Element {...props} onSubmit={this._submit.bind(this)}>
          { this.state.children }
        </Element>
      </Container>
    );
  }

  _handleValidationRequest(e) {
    this.notify('onValidate', e)

    if( e.event === 'onChange')
      return this._queueValidation(e.field)
    
    this.validator.validate(e.field, this.props) 
      .then(() => this.notify('onError', this.validator.errors()))
      .catch(done)
  }

  _submit(e){
    var options = { 
      strict: this.props.strict, 
      abortEarly: false 
    }

    e.preventDefault()

    this.props.schema
      .validate(this.props.value, options)   
      .catch(err => {
        var errors = err.inner.reduce((list, e) => {
          list[e.path] = (list[e.path] || (list[e.path] = [])).concat(e.errors)
          return list
        }, {})

        this.notify('onError', errors)
      })
  }

  _queueValidation(path){
    var queue = this._queue || (this._queue = [])

    if (queue.indexOf(path) === -1)
      queue.push(path)
  }

  _flushValidations(newProps){
    var newValue = newProps.value
      , oldValue = this.props.value
      , validator = this.validator
      , fields = this._queue || [];

    this._queue = []

    if ( fields.length ) {
      this.validator
        .validate(fields, newProps)
        .then(() => this.notify('onError', validator.errors()))
        .catch(done)
    }
  }

  notify(event, arg){
    this.props[event] && this.props[event](arg)
  }
}

module.exports = uncontrollable(Form, { value: 'onChange', errors: 'onError' })

function wrapSetter(setter){
  return (...args) => {
    var result = setter(...args)
    invariant(result && typeof result === 'object', 
      '`setter(..)` props must return the form value object after updating a value.')
    return result
  }
}
