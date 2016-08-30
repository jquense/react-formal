'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _Message = require('react-input-message/Message');

var _Message2 = _interopRequireDefault(_Message);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _uniqMessage = require('./util/uniqMessage');

var _uniqMessage2 = _interopRequireDefault(_uniqMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias Message
 */
var ValidationMessage = function (_React$Component) {
  _inherits(ValidationMessage, _React$Component);

  function ValidationMessage() {
    _classCallCheck(this, ValidationMessage);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  ValidationMessage.prototype.shouldComponentUpdate = function shouldComponentUpdate(p, s, c) {
    return _function2.default.call(this, p, s, c);
  };

  ValidationMessage.prototype.render = function render() {
    var _props = this.props;
    var className = _props.className;
    var errorClass = _props.errorClass;
    var children = _props.children;
    var extract = _props.extract;
    var filter = _props.filter;

    var props = _objectWithoutProperties(_props, ['className', 'errorClass', 'children', 'extract', 'filter']);

    return _react2.default.createElement(
      _Message2.default,
      _extends({}, props, {
        className: (0, _classnames2.default)(className, errorClass)
      }),
      function (messages) {
        return children(messages.filter(function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return filter.apply(undefined, args.concat([extract]));
        }).map(extract));
      }
    );
  };

  return ValidationMessage;
}(_react2.default.Component);

ValidationMessage.propTypes = _extends({}, _Message2.default.propTypes, {
  /**
   * A function that maps an array of message strings
   * and returns a renderable string or ReactElement.
   *
   * ```js
   * <Message>
   *  {messages => messages.join(', ')}
   * </Message>
   * ```
   */
  children: _react2.default.PropTypes.func,

  component: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string]).isRequired,

  /**
   * A css class that should be always be applied to the Message container.
   */
  errorClass: _react2.default.PropTypes.string,

  /**
   * Map the passed in message object for the field to a string to display
   */
  extract: _react2.default.PropTypes.func
});
ValidationMessage.defaultProps = {
  component: 'span',
  errorClass: 'validation-error',
  filter: _uniqMessage2.default,
  extract: function extract(error) {
    return error.message || error;
  },
  children: function children(messages) {
    return messages.join(', ');
  }
};
exports.default = ValidationMessage;
module.exports = exports['default'];