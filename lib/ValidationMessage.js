'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var React = require('react');
var _shouldComponentUpdate = require('react-pure-render/function');
var Message = require('react-input-message/lib/Message');
var cn = require('classnames');

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 * @alias Message
 */

var ValidationMessage = (function (_React$Component) {
  function ValidationMessage() {
    _classCallCheck(this, ValidationMessage);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(ValidationMessage, _React$Component);

  ValidationMessage.prototype.shouldComponentUpdate = function shouldComponentUpdate(p, s, c) {
    return _shouldComponentUpdate.call(this, p, s, c);
  };

  ValidationMessage.prototype.render = function render() {
    var props = this.props;

    return React.createElement(Message, _extends({}, props, {
      className: cn(props.className, props.errorClass)
    }));
  };

  _createClass(ValidationMessage, null, [{
    key: 'propTypes',
    value: {
      /**
       * Specify what Field or Fields the Message is in charge of displaying.
       * `for` should correspond to a field `name`.
       */
      component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,

      /**
       * A css class that should be always be applied to the Message container.
       */
      errorClass: React.PropTypes.string },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      component: 'span',
      errorClass: 'validation-error'
    },
    enumerable: true
  }]);

  return ValidationMessage;
})(React.Component);

module.exports = ValidationMessage;