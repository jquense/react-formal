'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pad = function pad(n) {
  return n < 10 ? '0' + n : n;
};

var isValid = function isValid(date) {
  return date && !isNaN(date.getTime());
};

var toLocal = function toLocal(date) {
  if (!date) return null;

  date = new Date(date);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

var parse = function parse(date, org, part) {
  return toLocal(part === 'time' ? toDateString(org || new Date(), 'date') + 'T' + date : date);
};

var localISOString = function localISOString(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.000';
};

var toDateString = function toDateString(date, part) {
  if (!isValid(date)) return '';
  date = localISOString(date);
  if (part === 'date') date = date.substr(0, 10);
  if (part === 'time') date = date.substr(11);
  return date;
};

var DateInput = function (_React$Component) {
  _inherits(DateInput, _React$Component);

  function DateInput() {
    _classCallCheck(this, DateInput);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  DateInput.prototype.render = function render() {
    var _props = this.props;
    var value = _props.value;
    var _props$type = _props.type;
    var type = _props$type === undefined ? 'date' : _props$type;

    var props = _objectWithoutProperties(_props, ['value', 'type']);

    return _react2.default.createElement(_Input2.default, _extends({}, props, {
      type: type,
      value: toDateString(value, type),
      onChange: function onChange(stringValue) {
        return props.onChange(parse(stringValue, value, type));
      }
    }));
  };

  return DateInput;
}(_react2.default.Component);

DateInput.propTypes = {
  value: _react2.default.PropTypes.instanceOf(Date),
  onChange: _react2.default.PropTypes.func,
  type: _react2.default.PropTypes.string
};
exports.default = DateInput;
module.exports = exports['default'];