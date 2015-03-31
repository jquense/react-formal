'use strict';
var React = require('react')
  , Widgets = require('react-widgets')
  , Input   = require('./Input.jsx')
  , FormInput = require('react-input-error/lib/ValidationInput')
  , yup = require('yup');

var Field = React.createClass({

  statics: {
    _isYupFormField: true
  },
  
  propTypes: {
    schema:  React.PropTypes.instanceOf(yup.mixed).isRequired,
    control: React.PropTypes.func,
    events:  React.PropTypes.arrayOf(React.PropTypes.string)
  },

  contextTypes: {
    schema:   React.PropTypes.func,
    onChange: React.PropTypes.func,
    value:    React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      events: ['onChange']
    };
  },

  render() {
    var { 
        events
      , group
      , ...props } = this.props
      , Widget = this._getInputForSchema()
      , value  = this.context.value(props.for)
      
    return (
      <FormInput for={this.props.for} group={group} events={events}>
        <Widget {...props} onChange={this.context.onChange.bind(null, props.for, props.updates)} value={value}/>
      </FormInput>
    );
  },

  _getInputForSchema(){
    var schema = this.context.schema(this.props.for)
      , Widget = this.props.control || Widgets[widgetMap[schema._type]]

    if( !Widget )
      Widget = Input

    return Widget
  },

  _change(){

  }

});

module.exports = Field;

var widgetMap = {
  number: 'NumberPicker',
  date:   'DateTimePicker',
  array:  'MultiSelect'
};
