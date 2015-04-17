'use strict';
var React = require('react')
  , Widgets = require('react-widgets')
  , Input   = require('./Input.jsx')
  , MessageTrigger = require('react-input-message/lib/MessageTrigger')
  , yup = require('yup');

var has = {}.hasOwnProperty;
var types = {
  combobox: 'Combobox',
  dropdownlist: 'DropdownList',
  calendar: 'Calendar',
  selectlist: 'SelectList',
  numberpicker: 'NumberPicker',
  datetimepicker: 'DateTimePicker',
  multiselect: 'MultiSelect'
}

var widgetMap = {
  number: 'NumberPicker',
  date:   'DateTimePicker',
  array:  'MultiSelect'
};


class Field extends React.Component {

  static _isYupFormField = true
  
  static propTypes = {
    input:   React.PropTypes.func,
    type:    React.PropTypes.oneOfType([
               React.PropTypes.func,
               React.PropTypes.string,
             ]),

    events:  React.PropTypes.arrayOf(
               React.PropTypes.string),
    
    errorClass:  React.PropTypes.string
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
      , updates
      , for: pathFor
      , ...props } = this.props
      , Widget = this._getInputForSchema()
      , value  = this.getContext().value(pathFor)
      
    return (
      <MessageTrigger for={pathFor} group={group} events={events} activeClass={props.errorClass}>
        <Widget {...props} onChange={this._change.bind(this)} value={value}/>
      </MessageTrigger>
    )
  }

  _getInputForSchema(){
    var schema = this.getContext().schema(this.props.for)
      , type = this.props.type;

    if ( typeof type === 'function' )
      return type

    type = types[type.toLowerCase()] || widgetMap[schema._type]

    return Widgets[type] || Input
  }

  _change(...args){
    this.getContext().onChange(this.props.for, this.props.updates, args[0])
    this.props.onChange
      && this.props.onChange(...args)
  }

  getContext(){
    return process.env.NODE_ENV !== 'production' 
      ? this.context
      : this._reactInternalInstance._context
  }
}

module.exports = Field;

