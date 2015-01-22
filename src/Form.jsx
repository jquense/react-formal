'use strict';
var Validator = require('react-input-error/lib/components/Validator')
var React   = require('react')
  , update  = require('react/lib/update')
  , yup     = require('yup')
  , getter  = require('property-expr').getter
  , assign  = require('xtend/mutable');

var Form = React.createClass({

  propTypes: {
    schema: React.PropTypes.instanceOf(yup.mixed).isRequired,
    onChange:  React.PropTypes.func,

    value:  function(props, propName, componentName, location){
      if(props[propName] !== undefined){
        if ( !props.onChange )
          return new Error(
              `ReactWidgets: you have provided a \`value\` prop to \`${componentName}\` 
              without an \`onChange()\` handler. This will render a read-only form.`)
      }

      return React.PropTypes.func.isRequired(props, propName, componentName, location)
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.value !== this.props.value)
      this._flushValidations()
  },

  render() {
    var { 
        children
      , schema
      , onChange
      , ...props } = this.props;
      
    addChildContext(children, { 
      schema: path => yup.reach(schema, path), 
      value:  path => getter(path)(props.value),
      onChange: (path, val) => 
        onChange && onChange(update(props.value, specFromPath(path, val)))
    })

    return (
      <Validator ref='validator' validate={this._validate} onValidate={this._validateEvent}>
        <form {...props}>
          { children }
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

  _validate( path, input) {
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

function addChildContext(children, context) {

  React.Children.forEach(children, function(child)  {
    if( !React.isValidElement(child) ) 
      return 

    if( child.type.contextTypes )
      assign(child._context, context)
    
    if ( child.props.children) 
      addChildContext(child.props.children, context)
  });
}

function specFromPath(path, value){
  var parts = path.split('.')
    , obj = {}, current = obj;

  parts.forEach( (part, idx) => {
    current = (current[part] = {})

    if( idx === (parts.length - 1))
      current['$set'] = value
  })

  return obj
}