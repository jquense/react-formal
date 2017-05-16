'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Input = function (_React$Component) {
  _inherits(Input, _React$Component);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Input.prototype.render = function render() {
    var _props = this.props;
    var _props$tagName = _props.tagName;
    var Tag = _props$tagName === undefined ? 'input' : _props$tagName;
    var value = _props.value;

    var props = _objectWithoutProperties(_props, ['tagName', 'value']);

    delete props.meta;

    if (value === null) value = '';

    return _react2.default.createElement(Tag, _extends({}, props, {
      value: value,
      onChange: function onChange(e) {
        return props.onChange(e.target.value);
      }
    }));
  };

  return Input;
}(_react2.default.Component);

Input.propTypes = {
  value: _propTypes2.default.any,
  onChange: _propTypes2.default.func,
  tagName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func])
};
exports.default = Input;
module.exports = exports['default'];