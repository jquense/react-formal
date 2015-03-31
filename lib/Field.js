"use strict";
var React = require("react"),
    Widgets = require("react-widgets"),
    Input = require("./Input.jsx"),
    FormInput = require("react-input-error/lib/components/ValidationInput"),
    yup = require("yup");

var Field = React.createClass({
  displayName: "Field",

  _isYupFormField: true,

  propTypes: {
    schema: React.PropTypes.instanceOf(yup.mixed).isRequired,
    widget: React.PropTypes.func,
    events: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  contextTypes: {
    schema: React.PropTypes.func,
    onChange: React.PropTypes.func,
    value: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      events: ["onChange"]
    };
  },

  render: function () {
    var _props = this.props;
    var events = _props.events;
    var group = _props.group;
    var props = babelHelpers.objectWithoutProperties(_props, ["events", "group"]);
    var Widget = this._getInputForSchema();
    var value = this.context.value(props.for);

    return React.createElement(
      FormInput,
      { for: this.props.for, group: group, events: events },
      React.createElement(Widget, babelHelpers._extends({}, props, { onChange: this.context.onChange.bind(null, props.for), value: value }))
    );
  },

  _getInputForSchema: function () {
    var schema = this.context.schema(this.props.for),
        Widget = this.props.widget || Widgets[widgetMap[schema._type]];

    if (!Widget) Widget = Input;

    return Widget;
  },

  _change: function () {}

});

module.exports = Field;

var widgetMap = {
  number: "NumberPicker",
  date: "DateTimePicker",
  array: "MultiSelect"
};