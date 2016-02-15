'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var FormContext = (function (_React$Component) {
  _inherits(FormContext, _React$Component);

  function FormContext() {
    _classCallCheck(this, FormContext);

    _React$Component.apply(this, arguments);
  }

  FormContext.prototype.getChildContext = function getChildContext() {
    var _this = this;

    return this._context || (this._context = {
      reactFormalContext: {
        registerSubmit: function registerSubmit(fn) {
          return _this.submit = fn;
        },
        onSubmit: function onSubmit() {
          if (_this.submit) _this.submit();
        }
      }
    });
  };

  FormContext.prototype.render = function render() {
    var Tag = this.props.component || 'div';
    return _react2['default'].Children.count(this.props.children) === 1 ? this.props.children : _react2['default'].createElement(Tag, this.props);
  };

  _createClass(FormContext, null, [{
    key: 'propTypes',

    /**
     * the component the Context will render as it's root if necessary.
     * If there is only one child defined the Context will just return that.
     *
     * @default 'div'
    **/
    value: {
      component: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.string])
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      reactFormalContext: _react2['default'].PropTypes.object
    },
    enumerable: true
  }]);

  return FormContext;
})(_react2['default'].Component);

exports['default'] = FormContext;
module.exports = exports['default'];