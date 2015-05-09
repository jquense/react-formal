'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var React = require('react');

var pad = function pad(n) {
  return n < 10 ? '0' + n : n;
};

var isValid = function isValid(date) {
  return date && !isNaN(date.getTime());
};

var toLocal = function toLocal(date) {
  return new Date((date = new Date(date)).getTime() + date.getTimezoneOffset() * 60000);
};

var parse = function parse(date, org, type) {
  return toLocal(type === 'time' ? toDateString(org || new Date(), 'date') + 'T' + date : date);
};

var localISOString = function localISOString(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.000';
};

var toDateString = function toDateString(date, type) {
  if (!isValid(date)) return null;
  date = localISOString(date);
  if (type === 'date') date = date.substr(0, 10);
  if (type === 'time') date = date.substr(11);
  return date;
};

var DateInput = (function (_React$Component) {
  function DateInput() {
    babelHelpers.classCallCheck(this, DateInput);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(DateInput, _React$Component);

  DateInput.prototype.render = function render() {
    var _props = this.props;
    var value = _props.value;
    var _props$type = _props.type;
    var type = _props$type === undefined ? 'date' : _props$type;
    var props = babelHelpers.objectWithoutProperties(_props, ['value', 'type']);

    return React.createElement('input', babelHelpers._extends({}, props, { type: type,
      value: toDateString(value, type),
      onChange: function (e) {
        return props.onChange(parse(e.target.value, value, type));
      }
    }));
  };

  return DateInput;
})(React.Component);

module.exports = DateInput;