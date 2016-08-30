'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _ValidationMessage = require('./ValidationMessage');

var _ValidationMessage2 = _interopRequireDefault(_ValidationMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var ValidationSummary = function (_React$Component) {
  _inherits(ValidationSummary, _React$Component);

  function ValidationSummary() {
    _classCallCheck(this, ValidationSummary);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  ValidationSummary.prototype.shouldComponentUpdate = function shouldComponentUpdate(p, s, c) {
    return _function2.default.call(this, p, s, c);
  };

  ValidationSummary.prototype.render = function render() {
    var _props = this.props;
    var formatMessage = _props.formatMessage;

    var props = _objectWithoutProperties(_props, ['formatMessage']);

    return _react2.default.createElement(
      _ValidationMessage2.default,
      props,
      function (messages) {
        return messages.map(formatMessage);
      }
    );
  };

  return ValidationSummary;
}(_react2.default.Component);

ValidationSummary.propTypes = {

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
  formatMessage: _react2.default.PropTypes.func.isRequired,

  /**
   * A DOM node tag name or Component class the Message should render as.
   */
  component: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string]).isRequired,

  /**
   * A css class that should be always be applied to the Summary container.
   */
  errorClass: _react2.default.PropTypes.string,

  /**
   * Specify a group to show erros for, if empty all form errors will be shown in the Summary.
   */
  group: _react2.default.PropTypes.string
};
ValidationSummary.defaultProps = {
  component: 'ul',
  formatMessage: function formatMessage(message, idx) {
    return _react2.default.createElement(
      'li',
      { key: idx },
      message
    );
  }
};
exports.default = ValidationSummary;
module.exports = exports['default'];