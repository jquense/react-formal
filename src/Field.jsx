'use strict';
var React = require('react')
  , invariant = require('react/lib/invariant')
  , types = require('./util/types')
  , Input   = require('./inputs/Input.jsx')
  , MessageTrigger = require('react-input-message/lib/MessageTrigger');

var has = {}.hasOwnProperty;

/**
 * Comment!
 */
class Field extends React.Component {

  static _isYupFormField = true
  
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

  componentWillMount() {
    if ( process.env.NODE_ENV !== 'production' )
      invariant(!!this.getContext().schema(this.props.for),
        `[Yup Formal] There is no corresponding schema defined for this field: "${this.props.for}" ` +
        `Each Field's \`for\` prop must be a valid path defined by the parent Form schema`)
  }

  render() {
    var { 
        events
      , group
      , mapValue
      , for: pathFor
      , ...props } = this.props
      , schema = this.getContext().schema(pathFor)
      , value  = this.getContext().value(pathFor)
      , type = this.props.type || schema._type
      , Widget = type;

    Widget = typeof this.props.type === 'function' 
      ? ((type = undefined), this.props.type)
      : types[type.toLowerCase()] || Input

    pathFor = props.validates == null ? pathFor : [pathFor].concat(props.validates)

    return (
      <MessageTrigger for={pathFor} group={group} events={events} activeClass={props.errorClass}>
        <Widget {...props} type={type} value={value} onChange={this._change.bind(this)}/>
      </MessageTrigger>
    )
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

Field.propTypes = {
    for: React.PropTypes.string.isRequired,

    type: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string,
          ]),

    events: React.PropTypes.arrayOf(
              React.PropTypes.string),
    
    errorClass: React.PropTypes.string
  }


module.exports = Field;

