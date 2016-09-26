'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _classCallCheck(this, FormContext);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FormContext.prototype.getChildContext = function getChildContext() {
    var _this2 = this;

    return this._context || (this._context = {
      reactFormalContext: {
        registerSubmit: function registerSubmit(fn) {
          return _this2.submit = fn;
        },
        onSubmit: function onSubmit() {
          if (_this2.submit) _this2.submit();
        }
      }
    });
  };
  /**
   * the component the Context will render as it's root if necessary.
   * If there is only one child defined the Context will just return that.
   *
   * @default 'div'
  **/


  FormContext.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var Tag = _props.component;

    var props = _objectWithoutProperties(_props, ['children', 'component']);

    return _react.Children.count(children) === 1 ? children : _react2.default.createElement(
      Tag,
      props,
      children
    );
  };

  return FormContext;
}(_react2.default.Component);

FormContext.propTypes = {
  component: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string])
};
FormContext.defaultProps = {
  component: 'div'
};
FormContext.childContextTypes = {
  reactFormalContext: _react2.default.PropTypes.object
};
exports.default = FormContext;
module.exports = exports['default'];