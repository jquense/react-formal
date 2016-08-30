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

var BoolInput = function (_React$Component) {
  _inherits(BoolInput, _React$Component);

  function BoolInput() {
    _classCallCheck(this, BoolInput);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  BoolInput.prototype.render = function render() {
    var _props = this.props;
    var value = _props.value;

    var props = _objectWithoutProperties(_props, ['value']);

    return _react2.default.createElement(_Input2.default, _extends({}, props, {
      type: 'checkbox',
      checked: !!value,
      onChange: function onChange() {
        return props.onChange(!value);
      }
    }));
  };

  return BoolInput;
}(_react2.default.Component);

BoolInput.propTypes = {
  value: _react2.default.PropTypes.bool,
  onChange: _react2.default.PropTypes.func
};
exports.default = BoolInput;
module.exports = exports['default'];