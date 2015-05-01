'use strict';
var Validator = require('react-input-message/lib/Validator')
var Container = require('react-input-message/lib/MessageContainer')

var React    = require('react')
  , uncontrollable = require('uncontrollable')
  , getChildren = require('./util/parentContext')
  , updateIn = require('react/lib/update')
  , yup      = require('yup')
  , prop = require('property-expr');

let parent = path => prop.join(prop.split(path).slice(0, -1))

class Form extends React.Component {

  static propTypes = {
    value: React.PropTypes.object,

    onChange: React.PropTypes.func,

    novalidate: React.PropTypes.bool,

    component: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string,
    ]),

    schema: (props, name, componentName) => {
      var err = React.PropTypes.any.isRequired(props, name, componentName)

      if (!err && !props[name].__isYupSchema__) 
        err = new Error('`schema` must be a proper yup schema: (' + componentName + ')')

      return err
    }
  }

  static defaultProps = {
    component: 'form',
    strict: true,
    updater: (model, path, val) => updateIn(model, specFromPath(path, val))
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
      var model = props.value
        , field = yup.reach(props.schema, path)
        , value = prop.getter(path)(model)
        , context = prop.getter(parent(path))(model);

      return field.validate(value, { strict: props.strict, context })
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

      schema:   path => yup.reach(this.props.schema, path), 

      value:    path => prop.getter(path)(this.props.value),

      onChange: (path, updates, val) => this._update(path, val, updates)
    })
  }

  _update(path, widgetValue, mapValue){
    var model = this.props.value
      , updater = this.props.updater;

    if (typeof mapValue === 'function')
      model = updater(model, path, mapValue(widgetValue))

    else if (mapValue){
      for( var key in mapValue ) if ( mapValue.hasOwnProperty(key))
        model = updater(model, key, getValue(widgetValue, key, mapValue))
    }
    else
      model = updater(model, path, widgetValue)

    this.props.onChange(model)

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
    
    let handleValidationRequest = e => {
      if( e.event === 'onChange')
        return this._queueValidation(e.field)
      
      this.validator.validate(e.field, this.props) 
        .then(() => this.setState({ errors: this.validator.errors() }))
        .catch( e => setTimeout(()=> { throw e }))
    }

    return (
      <Container
        ref={ref => this._container = ref}
        messages={this.state.errors} 
        onValidationNeeded={props.novalidate ? null : handleValidationRequest}>
        
        <Element {...props} onSubmit={this._submit.bind(this)} noValidate>
          { this.state.children }
        </Element>
      </Container>
    );
  }

  _submit(e){
    e.preventDefault()

    this.props.schema.validate(this.props.value, { strict: this.props.strict, abortEarly: false })
      .then(() => undefined)     
      .catch(err => err.inner.reduce((a, e) => {
        a[e.path] = (a[e.path] || (a[e.path] = [])).concat(e.errors)
        return a
      }, {}))
      .then(errors => this.setState({ errors }))
  }

  _queueValidation(path){
    var queue = this._queue || (this._queue = [])

    if (queue.indexOf(path) === -1)
      queue.push(path)
  }

  _flushValidations(props){
    var validator = this.validator
      , fields = this._queue || [];

    this._queue = []

    this.validator.validate(fields, props)
      .then(() => this.setState({ errors: validator.errors() }))
      .catch( e => setTimeout(() => { throw e }))
  }
}

module.exports = uncontrollable(Form, { value: 'onChange' })

function specFromPath(path, value){
  var parts = prop.split(path)
    , obj = {}, current = obj;

  parts.forEach(part => current = (current[part] = {}))

  current.$set = value

  return obj
}