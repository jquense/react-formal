'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

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
    _classCallCheck(this, ValidationSummary);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(ValidationSummary, _React$Component);

  ValidationSummary.prototype.shouldComponentUpdate = function shouldComponentUpdate(p, s, c) {
    return _shouldComponentUpdate.call(this, p, s, c);
  };

  ValidationSummary.prototype.render = function render() {
    var _props = this.props;
    var Component = _props.component;
    var messages = _props.messages;
    var active = _props.active;
    var fieldFor = _props['for'];

    var props = _objectWithoutProperties(_props, ['component', 'messages', 'active', 'for']);

    if (!active) return null;

    return React.createElement(
      Component,
      _extends({}, props, {
        className: cn(props.className, props.errorClass || 'validation-error') }),
      Object.keys(messages).reduce(function (list, k) {
        return list.concat(splat(messages[k]));
      }, []).map(props.formatMessage)
    );
  };

  _createClass(ValidationSummary, null, [{
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