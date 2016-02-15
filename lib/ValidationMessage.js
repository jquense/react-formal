'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

var _reactInputMessageMessage = require('react-input-message/Message');

var _reactInputMessageMessage2 = _interopRequireDefault(_reactInputMessageMessage);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilUniqMessage = require('./util/uniqMessage');

var _utilUniqMessage2 = _interopRequireDefault(_utilUniqMessage);

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias Message
 */

var ValidationMessage = (function (_React$Component) {
  _inherits(ValidationMessage, _React$Component);

  function ValidationMessage() {
    _classCallCheck(this, ValidationMessage);

    _React$Component.apply(this, arguments);
  }

  ValidationMessage.prototype.shouldComponentUpdate = function shouldComponentUpdate(p, s, c) {
    return _reactPureRenderFunction2['default'].call(this, p, s, c);
  };

  ValidationMessage.prototype.render = function render() {
    var _props = this.props;
    var className = _props.className;
    var errorClass = _props.errorClass;

    return _react2['default'].createElement(_reactInputMessageMessage2['default'], _extends({}, this.props, {
      className: _classnames2['default'](className, errorClass)
    }));
  };

  _createClass(ValidationMessage, null, [{
    key: 'propTypes',
    value: _extends({}, _reactInputMessageMessage2['default'].propTypes, {

      component: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.string]).isRequired,

      /**
       * A css class that should be always be applied to the Message container.
       */
      errorClass: _react2['default'].PropTypes.string,

      /**
       * Map the passed in message object for the field to a string to display
       */
      extract: _react2['default'].PropTypes.func
    }),
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      component: 'span',
      errorClass: 'validation-error',
      filter: _utilUniqMessage2['default'],
      extract: function extract(error) {
        return error.message || error;
      }
    },
    enumerable: true
  }]);

  return ValidationMessage;
})(_react2['default'].Component);

module.exports = ValidationMessage;