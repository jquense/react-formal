'use strict';
var React = require('react')
  , types = require('./util/types')
  , Input   = require('./Input.jsx')
  , MessageTrigger = require('react-input-message/lib/MessageTrigger');

var has = {}.hasOwnProperty;

class Field extends React.Component {

  static _isYupFormField = true
  
  static propTypes = {
    for: React.PropTypes.string.isRequired,

    type: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string,
          ]),

    events: React.PropTypes.arrayOf(
              React.PropTypes.string),
    
    errorClass: React.PropTypes.string
  }

  static contextTypes = {
    schema:   React.PropTypes.func,
    onChange: React.PropTypes.func,
    value:    React.PropTypes.func
  }

  static defaultProps = {
    type: '',
    events: ['onChange', 'onBlur'],
    errorClass: 'invalid-field'
  }

  render() {
    var { 
        events
      , group
      , mapValue
      , for: pathFor
      , ...props } = this.props
      , Widget = this._getInputForSchema()
      , value  = this.getContext().value(pathFor)
    
    pathFor = props.validates == null ? pathFor : [pathFor].concat(props.validates)

    return (
      <MessageTrigger for={pathFor} group={group} events={events} activeClass={props.errorClass}>
        <Widget {...props} onChange={this._change.bind(this)} value={value}/>
      </MessageTrigger>
    )
  }

  _getInputForSchema(){
    var propFor = this.props.for
      , schema = this.getContext().schema(propFor)
      , type = this.props.type;

    if ( typeof type === 'function' )
      return type

    return types[type.toLowerCase()] || types[schema._type] || Input
  }

  _change(...args){
    this.getContext().onChange(this.props.for, this.props.mapValue, args[0])
    this.props.onChange
      && this.props.onChange(...args)
  }

  getContext(){
    return this._reactInternalInstance._context
  }
}

module.exports = Field;

