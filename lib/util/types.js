"use strict";
var babelHelpers = require("./babelHelpers.js");

var React = require("react");

var _require = require("react-widgets");

var Combobox = _require.Combobox;
var DropdownList = _require.DropdownList;
var NumberPicker = _require.NumberPicker;
var Calendar = _require.Calendar;
var DateTimePicker = _require.DateTimePicker;
var MultiSelect = _require.MultiSelect;
var SelectList = _require.SelectList;

var wrapWithDefaults = function (Component, defaults) {
  return (function (_React$Component) {
    function WrappedComponent() {
      babelHelpers.classCallCheck(this, WrappedComponent);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    babelHelpers.inherits(WrappedComponent, _React$Component);

    WrappedComponent.prototype.render = function render() {
      return React.createElement(Component, babelHelpers._extends({}, defaults, this.props));
    };

    return WrappedComponent;
  })(React.Component);
};

var types = Object.create(null);

types.combobox = Combobox;
types.dropdownlist = DropdownList;
types.calendar = Calendar;
types.selectlist = SelectList;

types.date = wrapWithDefaults(DateTimePicker, { time: false });
types.time = wrapWithDefaults(DateTimePicker, { date: false });
types.datetimepicker = DateTimePicker;

types.number = types.numberpicker = NumberPicker;

types.array = types.multiselect = MultiSelect;

module.exports = types;