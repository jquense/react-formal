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

var toArray = _react2.default.Children.toArray || function (children) {
  var result = [];
  _react2.default.Children.map(children, function (c) {
    return result.push(c);
  });
  return result;
};

var Select = function (_React$Component) {
  _inherits(Select, _React$Component);

  function Select() {
    var _temp, _this, _ret;

    _classCallCheck(this, Select);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleChange = function () {
      var _this$props = _this.props;
      var onChange = _this$props.onChange;
      var children = _this$props.children;

      var node = (0, _reactDom.findDOMNode)(_this);

      children = toArray(children);

      if (!_this.props.multiple) {
        var selected = children[node.selectedIndex];
        return _this.props.onChange(selected.props.value);
      }

      var values = [];

      [].forEach.call(node.options, function (option, i) {
        if (option.selected) {
          var _selected = children[i];
          values.push(_selected.props.value);
        }
      });

      onChange(values);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Select.prototype.render = function render() {
    var _props = this.props;
    var value = _props.value;
    var children = _props.children;
    var _props$tagName = _props.tagName;
    var tagName = _props$tagName === undefined ? 'select' : _props$tagName;

    var props = _objectWithoutProperties(_props, ['value', 'children', 'tagName']);

    if (value === null) value = props.multiple ? [] : '';

    return _react2.default.createElement(
      _Input2.default,
      _extends({}, props, {
        tagName: tagName,
        value: value,
        onChange: this.handleChange
      }),
      children
    );
  };

  return Select;
}(_react2.default.Component);

Select.propTypes = {
  value: _react2.default.PropTypes.any,
  multiple: _react2.default.PropTypes.bool,
  onChange: _react2.default.PropTypes.func,
  tagName: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func])
};
exports.default = Select;
module.exports = exports['default'];