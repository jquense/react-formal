'use strict';

exports.__esModule = true;
exports.default = registerWithContext;

var _spyOnComponent = require('spy-on-component');

var _spyOnComponent2 = _interopRequireDefault(_spyOnComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerWithContext(component, submit) {

  function register(formKey, context) {
    if (context.reactFormalContext) {
      var registerForm = context.reactFormalContext.registerForm;


      if (registerForm) registerForm(formKey || '@@parent', submit);
    }
  }

  (0, _spyOnComponent2.default)(component, {
    componentDidMount: function componentDidMount() {
      register(this.props.formKey, this.context);
    },
    componentWillReceiveProps: function componentWillReceiveProps(_ref, nextContext) {
      var formKey = _ref.formKey;

      register(formKey, nextContext);
    }
  });
}
module.exports = exports['default'];