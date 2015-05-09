'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react');
var pureRender = require('react-purerender');
var Message = require('react-input-message/lib/Message');
var cn = require('classnames');

/**
 * Represents a Form validation error message. Only renders when the 
 * value that it is `for` is invalid.
 * @alias Message
 */

var ValidationMessage = (function (_React$Component) {
  function ValidationMessage() {
    babelHelpers.classCallCheck(this, _ValidationMessage);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(ValidationMessage, _React$Component);
  var _ValidationMessage = ValidationMessage;

  _ValidationMessage.prototype.render = function render() {
    var props = this.props;

    return React.createElement(Message, babelHelpers._extends({}, props, {
      className: cn(props.className, props.errorClass)
    }));
  };

  babelHelpers.createClass(_ValidationMessage, null, [{
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
  ValidationMessage = pureRender(ValidationMessage) || ValidationMessage;
  return ValidationMessage;
})(React.Component);

module.exports = ValidationMessage;