'use strict';
var React = require('react')
  , Widgets = require('react-widgets')
  , Input   = require('./Input.jsx')
  , FormInput = require('react-input-error/lib/components/ValidationInput')
  , yup = require('yup');

var ValidatableInput = React.createClass({

  propTypes: {
    schema: React.PropTypes.instanceOf(yup.mixed).isRequired,
    widget: React.PropTypes.func,
    events: React.PropTypes.arrayOf(React.PropTypes.string)
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
        <Widget {...props} onChange={this.context.onChange.bind(null, props.for)} value={value}/>
      </FormInput>
    );
  },

  _getInputForSchema(){
    var schema = this.context.schema(this.props.for)
      , Widget = this.props.widget || Widgets[widgetMap[schema._type]]

    if( !Widget )
      Widget = Input

    return Widget
  },

  _change(val){

  }

});

module.exports = ValidatableInput;

var widgetMap = {
  number: 'NumberPicker',
  date:   'DateTimePicker',
  array:  'MultiSelect'
};
