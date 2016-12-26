'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _MessageTrigger = require('react-input-message/MessageTrigger');

var _MessageTrigger2 = _interopRequireDefault(_MessageTrigger);

var _contextType = require('./util/contextType');

var _contextType2 = _interopRequireDefault(_contextType);

var _chainEvents = require('./util/chainEvents');

var _chainEvents2 = _interopRequireDefault(_chainEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A Form Button, for triggering validations for specific Field groups
 */
var Button = function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    var _temp, _this, _ret;

    _classCallCheck(this, Button);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  Button.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props;
    var type = _props.type;
    var group = _props.group;
    var events = _props.events;
    var Component = _props.component;

    var props = _objectWithoutProperties(_props, ['type', 'group', 'events', 'component']);

    (0, _warning2.default)(!group || type.toLowerCase() !== 'submit', 'You have specified a `group` prop with type="submit" on this Form.Button component. ' + 'submit type buttons will automatically trigger a form wide validation. ' + 'to trigger validation for just the group: `' + group + '` use type="button" instead.');

    delete props.formKey;

    if (type.toLowerCase() === 'submit') return _react2.default.createElement(
      Component,
      _extends({}, props, { onClick: this.handleSubmit }),
      this.props.children
    );

    return _react2.default.createElement(
      _MessageTrigger2.default,
      { group: group || '@all', events: events },
      function (_ref) {
        var _ = _ref.messages;

        var triggerProps = _objectWithoutProperties(_ref, ['messages']);

        return _react2.default.createElement(
          Component,
          _extends({}, (0, _chainEvents2.default)(events, [props, triggerProps]), {
            type: type
          }),
          _this2.props.children
        );
      }
    );
  };

  return Button;
}(_react2.default.Component);

Button.propTypes = {
  /**
   * The `<button/>` type
   */
  type: _react2.default.PropTypes.oneOf(['button', 'submit']),

  /**
   * Specify a group to validate, if empty the entire form will be validated.
   * If the button type is 'submit' the group will be ignored and the
   * entire form will be validated prior to submission.
   */
  group: _react2.default.PropTypes.string,

  /**
   * The key of `Form` that "owns" this button. Validation will be triggered
   * only for that `Form`.
   */
  formKey: _react2.default.PropTypes.string,

  component: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func]),

  /**
   * An array of event names that trigger validation.
   */
  events: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string),

  onClick: _react2.default.PropTypes.func
};
Button.contextTypes = _contextType2.default;
Button.defaultProps = {
  type: 'button',
  component: 'button',
  events: ['onClick']
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.handleSubmit = function () {
    var _props2 = _this3.props;
    var formKey = _props2.formKey;
    var onClick = _props2.onClick;

    var context = _this3.context.reactFormalContext;

    if (onClick) onClick.apply(undefined, arguments);
    if (context) context.submitForm(formKey || '@@parent');
  };
};

exports.default = Button;
module.exports = exports['default'];