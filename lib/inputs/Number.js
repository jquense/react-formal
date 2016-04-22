'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var isValid = function isValid(num) {
  return typeof num === 'number' && !isNaN(num);
};

var isAtDelimiter = function isAtDelimiter(num, str) {
  var next = str.length <= 1 ? false : parseFloat(str.substr(0, str.length - 1));
  return typeof next === 'number' && !isNaN(next) && next === num;
};

var NumberInput = (function (_React$Component) {
  _inherits(NumberInput, _React$Component);

  function NumberInput() {
    _classCallCheck(this, NumberInput);

    _React$Component.apply(this, arguments);

    this.state = {};
  }

  NumberInput.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var value = nextProps.value;

    value = value == null || isNaN(value) ? '' : '' + value;

    this.setState({ value: value });
  };

  NumberInput.prototype.render = function render() {
    var _this = this;

    var _props = this.props;
    var value = _props.value;

    var props = _objectWithoutProperties(_props, ['value']);

    value = this.state.value || value;

    return _react2['default'].createElement(_Input2['default'], _extends({}, props, {
      type: 'number',
      value: value,
      onChange: function (e) {
        return _this._change(e);
      }
    }));
  };

  NumberInput.prototype._change = function _change(value) {
    var current = this.props.value,
        number = parseFloat(value);

    if (value == null || value.trim() === '' || !isValid(number)) return this.props.onChange(null);

    if (isValid(number) && number !== current && !isAtDelimiter(number, value)) return this.props.onChange(number);

    this.setState({ value: value });
  };

  _createClass(NumberInput, null, [{
    key: 'propTypes',
    value: {
      value: _react2['default'].PropTypes.number
    },
    enumerable: true
  }]);

  return NumberInput;
})(_react2['default'].Component);

module.exports = NumberInput;