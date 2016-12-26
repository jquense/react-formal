'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_CHANNEL = '@@parent';

/**
 * `<Form.Context />` provides declarative API similar in purpose to the
 * HTML5 `.form` attribute. Sometimes it is necessary to trigger a form
 * validation or submission from _outside_ a `<Form />`.
 *
 * One approach is to use the imperative API of capturing the `<Form />` instance in a ref
 * and calling the `.submit()` method on it, but this can be troublesome with
 * Higher order Components, used by your app or other libraries.
 *
 * An more "React" approach is to use `<Form.Context />` to wrap both your form and trigger.
 *
 * ```js
 * <Form.Context>
 *   <MyForm />
 *   <Form.Button type='submit' />
 * </Form.Context>
 * ```
 *
 * @alias Context
 */

var FormContext = function (_React$Component) {
  _inherits(FormContext, _React$Component);

  function FormContext() {
    var _temp, _this, _ret;

    _classCallCheck(this, FormContext);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.channels = Object.create(null), _this.registerForm = function () {
      var channelName = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_CHANNEL : arguments[0];
      var submit = arguments[1];

      _this.channels[channelName] = { submit: submit };
    }, _this.submitForm = function () {
      var channelName = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_CHANNEL : arguments[0];
      var reactFormalContext = _this.context.reactFormalContext;

      var channel = _this.channels[channelName];

      // console.log('submitform!', this.channels)

      if (channel) channel.submit();else if (reactFormalContext) reactFormalContext.submitForm(channelName);
      // else throw new Error(`There is no form to submit`)
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * the component the Context will render as it's root if necessary.
   * If there is only one child defined the Context will just return that.
   *
   * @default 'div'
  **/


  FormContext.prototype.getChildContext = function getChildContext() {
    return this._context || (this._context = {
      reactFormalContext: {
        registerForm: this.registerForm,
        submitForm: this.submitForm
      }
    });
  };

  FormContext.prototype.render = function render() {
    var Tag = this.props.component || 'div';
    return _react2.default.Children.count(this.props.children) === 1 ? this.props.children : _react2.default.createElement(Tag, this.props);
  };

  return FormContext;
}(_react2.default.Component);

FormContext.propTypes = {
  component: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string])
};
FormContext.contextTypes = {
  reactFormalContext: _react2.default.PropTypes.object
};
FormContext.childContextTypes = {
  reactFormalContext: _react2.default.PropTypes.object
};
exports.default = FormContext;
module.exports = exports['default'];