'use strict';
var Validator = require('react-input-message/lib/Validator')
var Container = require('react-input-message/lib/MessageContainer')

var React    = require('react')
  , getChildren = require('./util/parentContext')
  , updateIn = require('react/lib/update')
  , yup      = require('yup')
  , getter   = require('property-expr').getter;

class Form extends React.Component {

  static propTypes = {

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
    },

    value: (props, propName, componentName, location) => {
      if(props[propName] !== undefined){
        if ( !props.onChange )
          return new Error(
              `You have provided a \`value\` prop to \`${componentName}\` 
              without an \`onChange()\` handler. This will render a read-only form.`)
      }

      return React.PropTypes.object.isRequired(props, propName, componentName, location)
    }
  }

  static defaultProps = {
    component: 'form'
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
        , value = getter(path)(model);

      return field.validate(value, { strict: true })
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

      value:    path => getter(path)(this.props.value),

      onChange: (path, updates, val) => this._update(path, val, updates)
    })
  }

  _update(path, widgetValue, updateMap){
    var model = this.props.value
      , updater = (model, path, val) => updateIn(model, specFromPath(path, val))


    if (updateMap) {
      for( var key in updateMap ) if ( updateMap.hasOwnProperty(key))
        model = updater(model, key, getValue(widgetValue, key, updateMap))
    }
    else
      model = updater(model, path, widgetValue)

    this.props.onChange && 
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

    var fields = this._container.fields()

    this.validator
      .validate(fields, this.props)
      .then(() => {
        let errors = this.validator.errors()

        if ( Object.keys(errors).length )
          return this.setState({ errors })

        this.props.onSubmit 
          && this.props.onSubmit()
      }) 
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
      .catch( e => setTimeout(()=> { throw e }))
  }
}

module.exports = Form;



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