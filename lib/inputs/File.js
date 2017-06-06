'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileInput = function (_React$Component) {
  _inherits(FileInput, _React$Component);

  function FileInput() {
    var _temp, _this, _ret;

    _classCallCheck(this, FileInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleChange = function (_, _ref) {
      var files = _ref.target.files;
      var _this$props = _this.props;
      var multiple = _this$props.multiple;
      var onChange = _this$props.onChange;


      if (onChange) onChange(multiple ? files : files[0]);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  FileInput.prototype.render = function render() {
    var props = _extends({}, this.props);
    delete props.value;

    return _react2.default.createElement(_Input2.default, _extends({}, props, {
      type: 'file',
      onChange: this.handleChange
    }));
  };

  return FileInput;
}(_react2.default.Component);

FileInput.propTypes = {
  multiple: _propTypes2.default.bool,
  onChange: _propTypes2.default.func
};
exports.default = FileInput;
module.exports = exports['default'];