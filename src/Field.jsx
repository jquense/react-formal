'use strict';
var React = require('react')
  , Widgets = require('react-widgets')
  , Input   = require('./Input.jsx')
  , MessageSource = require('react-input-message/lib/MessageSource')
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


var Field = React.createClass({

  statics: {
    _isYupFormField: true
  },
  
  propTypes: {
    input:   React.PropTypes.func,
    type:    React.PropTypes.oneOfType([
               React.PropTypes.func,
               React.PropTypes.string,
             ]),

    events:  React.PropTypes.arrayOf(
              React.PropTypes.string)
  },

  contextTypes: {
    schema:   React.PropTypes.func,
    onChange: React.PropTypes.func,
    value:    React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      type: '',
      events: ['onChange', 'onBlur']
    };
  },

  render() {
    var { 
        events
      , group
      , updates
      , for: pathFor
      , ...props } = this.props
      , Widget = this._getInputForSchema()
      , value  = this.context.value(pathFor)
      
    return (
      <MessageSource for={pathFor} group={group} events={events}>
        <Widget {...props} onChange={this.context.onChange.bind(null, pathFor, updates)} value={value}/>
      </MessageSource>
    );
  },

  _getInputForSchema(){
    var schema = this.context.schema(this.props.for)
      , type   = types[this.props.type.toLowerCase()] || widgetMap[schema._type]

    return this.props.control || Widgets[type] || Input
  },

  _change(){

  }

});

module.exports = Field;

