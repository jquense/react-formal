'use strict';
var Validator    = require('react-input-error/lib/Validator')
var React        = require('react')
  , ReactElement = require('react/lib/ReactElement')
  , update  = require('react/lib/update')
  , yup     = require('yup')
  , getter  = require('property-expr').getter;

var Form = React.createClass({

  propTypes: {
    schema: React.PropTypes.instanceOf(yup.mixed).isRequired,
    onChange:  React.PropTypes.func,

    value:  function(props, propName, componentName, location){
      if(props[propName] !== undefined){
        if ( !props.onChange )
          return new Error(
              `You have provided a \`value\` prop to \`${componentName}\` 
              without an \`onChange()\` handler. This will render a read-only form.`)
      }

      return React.PropTypes.func.isRequired(props, propName, componentName, location)
    }
  },

  getInitialState() {
      return {
        children: attachChildren(
            this.props.children
          , this.getChildContext())
    };
  },

  componentWillReceiveProps(nextProps){
    this.setState({ 
      children: attachChildren(
          nextProps.children
        , this.getChildContext())
    })
  },

  componentDidUpdate(prevProps) {
    if(prevProps.value !== this.props.value)
      this._flushValidations()
  },

  childContextTypes: {
    schema:   React.PropTypes.func,
    value:    React.PropTypes.func,
    onChange: React.PropTypes.func,
  },

  getChildContext() {

    return this._context || (this._context = { 

      schema:   path => yup.reach(this.props.schema, path), 

      value:    path => getter(path)(this.props.value),

      onChange: (path, val, updates) => this._update(path, val, updates)
    })
  },

  _update(path, widgetValue, updateMap){
    var model = this.props.value
      , updater = (model, path, val) => update(this.props.value, specFromPath(path, val))

    if (updateMap) {
      for( var key in updateMap ) if ( updateMap.hasOwnProperty(key))
        model = updater(model, key, val[updateMap[key]])
    }
    else
      model = updater(model, path, widgetValue)

    this.props.onChange && 
      this.props.onChange(model)
  },

  render() {
    var { 
        children
      , onChange
      , ...props } = this.props;
      
    return (
      <Validator ref='validator' validate={this._validate} onValidate={this._validateEvent}>
        <form {...props}>
          { this.state.children }
        </form>
      </Validator>
    );
  },

  _validateEvent(e){
    if( e.event === 'onChange'){
      e.preventDefault()
      this._queueValidation(e.field)
    }
  },

  _validate( path) {
    var model = this.props.value
      , field = yup.reach(this.props.schema, path)
      , value = getter(path)(model);

    return field.validate(value, { strict: true })
      .then(() => void 0)       
      .catch(err => err.errors) 
  },

  _queueValidation(path){
    var queue = this._queue || (this._queue = [])

    if (queue.indexOf(path) === -1)
      queue.push(path)
  },

  _flushValidations(){
    var validator = this.refs.validator
      , queue = this._queue || []
      , path;

    while( (path = queue.shift()) ) 
      validator.validateField(path)
  }
});

module.exports = Form;


/*
 * “Do not be afraid; our fate Cannot be taken from us; it is a gift.” 
 * ― Dante Alighieri, Inferno
 */
function attachChildren(children, context) {

  if ( typeof children === 'string' || React.isValidElement(children))
    return clone(children)

  return React.Children.map(children, clone)

  function clone (child) {
    var props = child.props

    if ( !React.isValidElement(child) )
      return child;

    if ( props.children )
      props = { ...child.props, children: attachChildren(props.children, context) }

    return new ReactElement(
      child.type,
      child.key,
      child.ref,
      child._owner,
      !child.type._isYupFormField 
        ? child._context
        : { ...child._context, ...context},
      props
    )
  }
}

function specFromPath(path, value){
  var parts = path.split('.')
    , obj = {}, current = obj;

  parts.forEach((part, idx) => {
    current = (current[part] = {})

    if( idx === (parts.length - 1))
      current.$set = value
  })

  return obj
}