'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var childAt = function childAt(children, idx) {
  var child;
  if (children && children.length !== undefined) child = children[idx];else _react2.default.Children.forEach(children, function (c, i) {
    return !child && i === idx && (child = c);
  });
  return child;
};

var Select = function (_React$Component) {
  _inherits(Select, _React$Component);

  function Select() {
    _classCallCheck(this, Select);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Select.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props;
    var children = _props.children;
    var _props$tagName = _props.tagName;
    var tagName = _props$tagName === undefined ? 'select' : _props$tagName;

    var props = _objectWithoutProperties(_props, ['children', 'tagName']);

    var defaultValue = props.multiple ? [] : '';

    return _react2.default.createElement(
      _Input2.default,
      _extends({}, props, {
        tagName: tagName,
        onChange: function onChange() {
          return _this2.change();
        },
        value: props.value === null ? defaultValue : props.value
      }),
      children
    );
  };

  Select.prototype.change = function change() {
    var node = (0, _reactDom.findDOMNode)(this);
    var _props2 = this.props;
    var onChange = _props2.onChange;
    var children = _props2.children;
    var values = [];

    if (!this.props.multiple) return this.props.onChange(childAt(children, node.selectedIndex).props.value);[].forEach.call(node.options, function (option, i) {
      return option.selected && values.push(childAt(children, i).props.value);
    });

    onChange(values);
  };

  return Select;
}(_react2.default.Component);

exports.default = Select;
module.exports = exports['default'];