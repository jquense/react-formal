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

var isValid = function isValid(num) {
  return typeof num === 'number' && !isNaN(num);
};

var isAtDelimiter = function isAtDelimiter(num, str) {
  var next = str.length <= 1 ? false : parseFloat(str.substr(0, str.length - 1));
  return typeof next === 'number' && !isNaN(next) && next === num;
};

var NumberInput = function (_React$Component) {
  _inherits(NumberInput, _React$Component);

  function NumberInput() {
    var _temp, _this, _ret;

    _classCallCheck(this, NumberInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {}, _this.handleChange = function (value) {
      var current = _this.props.value,
          number = parseFloat(value);

      if (value == null || value.trim() === '' || !isValid(number)) return _this.props.onChange(null);

      if (isValid(number) && number !== current && !isAtDelimiter(number, value)) return _this.props.onChange(number);

      _this.setState({ value: value });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  NumberInput.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var value = nextProps.value;

    value = value == null || isNaN(value) ? '' : '' + value;

    this.setState({ value: value });
  };

  NumberInput.prototype.render = function render() {
    var _props = this.props;
    var value = _props.value;

    var props = _objectWithoutProperties(_props, ['value']);

    value = this.state.value || value;

    return _react2.default.createElement(_Input2.default, _extends({}, props, {
      type: 'number',
      value: value,
      onChange: this.handleChange
    }));
  };

  return NumberInput;
}(_react2.default.Component);

NumberInput.propTypes = {
  value: _react2.default.PropTypes.number,
  onChange: _react2.default.PropTypes.func
};
exports.default = NumberInput;
module.exports = exports['default'];