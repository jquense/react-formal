"use strict";
var babelHelpers = require("./util/babelHelpers.js");
var React = require("react"),
    Widgets = require("react-widgets"),
    Input = require("./Input.jsx"),
    MessageTrigger = require("react-input-message/lib/MessageTrigger"),
    yup = require("yup");

var has = ({}).hasOwnProperty;
var types = {
  combobox: "Combobox",
  dropdownlist: "DropdownList",
  calendar: "Calendar",
  selectlist: "SelectList",
  numberpicker: "NumberPicker",
  datetimepicker: "DateTimePicker",
  multiselect: "MultiSelect"
};

var widgetMap = {
  number: "NumberPicker",
  date: "DateTimePicker",
  array: "MultiSelect"
};

var Field = (function (_React$Component) {
  function Field() {
    babelHelpers.classCallCheck(this, Field);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(Field, _React$Component);
  Field._isYupFormField = true;
  Field.propTypes = {
    input: React.PropTypes.func,
    type: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]),

    events: React.PropTypes.arrayOf(React.PropTypes.string),

    errorClass: React.PropTypes.string
  };
  Field.contextTypes = {
    schema: React.PropTypes.func,
    onChange: React.PropTypes.func,
    value: React.PropTypes.func
  };
  Field.defaultProps = {
    type: "",
    events: ["onChange", "onBlur"],
    errorClass: "invalid-field"
  };

  Field.prototype.render = function render() {
    var _props = this.props;
    var events = _props.events;
    var group = _props.group;
    var updates = _props.updates;
    var pathFor = _props.for;
    var props = babelHelpers.objectWithoutProperties(_props, ["events", "group", "updates", "for"]);
    var Widget = this._getInputForSchema();
    var value = this.getContext().value(pathFor);

    return React.createElement(
      MessageTrigger,
      { for: pathFor, group: group, events: events, activeClass: props.errorClass },
      React.createElement(Widget, babelHelpers._extends({}, props, { onChange: this._change.bind(this), value: value }))
    );
  };

  Field.prototype._getInputForSchema = function _getInputForSchema() {
    var schema = this.getContext().schema(this.props.for),
        type = this.props.type;

    if (typeof type === "function") return type;

    type = types[type.toLowerCase()] || widgetMap[schema._type];

    return Widgets[type] || Input;
  };

  Field.prototype._change = function _change() {
    var _props;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.getContext().onChange(this.props.for, this.props.updates, args[0]);
    this.props.onChange && (_props = this.props).onChange.apply(_props, args);
  };

  Field.prototype.getContext = function getContext() {
    return process.env.NODE_ENV !== "production" ? this.context : this._reactInternalInstance._context;
  };

  return Field;
})(React.Component);

module.exports = Field;