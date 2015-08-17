'use strict';

var babelHelpers = require('./util/babelHelpers.js');

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
    babelHelpers.classCallCheck(this, ValidationMessage);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(ValidationMessage, _React$Component);

  ValidationMessage.prototype.shouldComponentUpdate = function shouldComponentUpdate(p, s, c) {
    return _shouldComponentUpdate(p, s, c);
  };

  ValidationMessage.prototype.render = function render() {
    var props = this.props;

    return React.createElement(Message, babelHelpers._extends({}, props, {
      className: cn(props.className, props.errorClass)
    }));
  };

  babelHelpers.createClass(ValidationMessage, null, [{
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