'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react');
var _shouldComponentUpdate = require('react-pure-render/function');
var connectToMessageContainer = require('react-input-message/lib/connectToMessageContainer');
var cn = require('classnames');

var splat = function splat(obj) {
  return obj == null ? [] : [].concat(obj);
};

module.exports = connectToMessageContainer(
/**
 * Display all Form validation `errors` in a single summary list.
 *
 * ```editable
 * <Form
 *   schema={modelSchema}
 *   defaultValue={modelSchema.default()}
 * >
 *   <Form.Summary/>
 *
 *   <Form.Field name='name.first' placeholder='first'/>
 *   <Form.Field name='name.last' placeholder='surname'/>
 *   <Form.Field name='dateOfBirth' placeholder='dob'/>
 *
 *   <Form.Button>Validate</Form.Button>
 * </Form>
 * ```
 * @alias Summary
 */
(function (_React$Component) {
  function ValidationSummary() {
    babelHelpers.classCallCheck(this, ValidationSummary);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(ValidationSummary, _React$Component);

  ValidationSummary.prototype.shouldComponentUpdate = function shouldComponentUpdate(p, s, c) {
    return _shouldComponentUpdate.call(this, p, s, c);
  };

  ValidationSummary.prototype.render = function render() {
    var _props = this.props;
    var Component = _props.component;
    var messages = _props.messages;
    var active = _props.active;
    var fieldFor = _props['for'];
    var props = babelHelpers.objectWithoutProperties(_props, ['component', 'messages', 'active', 'for']);

    if (!active) return null;

    return React.createElement(
      Component,
      babelHelpers._extends({}, props, {
        className: cn(props.className, props.errorClass || 'validation-error') }),
      Object.keys(messages).reduce(function (list, k) {
        return list.concat(splat(messages[k]));
      }, []).map(props.formatMessage)
    );
  };

  babelHelpers.createClass(ValidationSummary, null, [{
    key: 'propTypes',
    value: {

      /**
       * An error message renderer, Should return a `ReactElement`
       * ```
       * function(
       *   message: string,
       *   idx: number,
       *   messages: array
       * ) -> ReactElement
       * ```
       */
      formatMessage: React.PropTypes.func.isRequired,

      /**
       * A DOM node tag name or Component class the Message should render as.
       */
      component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,

      /**
       * A css class that should be always be applied to the Summary container.
       */
      errorClass: React.PropTypes.string,

      /**
       * Specify a group to show erros for, if empty all form errors will be shown in the Summary.
       */
      group: React.PropTypes.string },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      component: 'ul',
      errorClass: 'validation-error',
      formatMessage: function formatMessage(message, idx) {
        return React.createElement(
          'li',
          { key: idx },
          message
        );
      }
    },
    enumerable: true
  }]);
  return ValidationSummary;
})(React.Component));