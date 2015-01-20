'use strict';
var Validator = require('react-input-error/lib/components/Validator')
var React   = require('react')
  , update  = require('react/lib/update')
  , yup     = require('yup')
  , expr    = require('property-expr')
  , assign  = require('xtend/mutable');

var Form = React.createClass({

  propTypes: {
    schema: React.PropTypes.instanceOf(yup.mixed).isRequired,
    model:  React.PropTypes.func.isRequired
  },

  render() {
    var { 
        children
      , schema
      , onChange
      , ...props } = this.props;
      
    addChildContext(children, { 
      schema: path => yup.reach(schema, path), 
      onChange: (path, val) => 
        onChange && onChange(update(props.value, specFromPath(path, val)))
    })

    return (
      <Validator onValidate={this._validate}>
        <form {...props}>
          { children }
        </form>
      </Validator>
    );
  },

  _validate( path, input) {
    var model = this.props.value
      , field = yup.reach(this.props.schema, path)
      , value = expr.getter(path)(model);

    return field.validate(value, { strict: true })
      .then(() => void 0)       
      .catch(err => err.errors) 
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