'use strict';

exports.__esModule = true;
exports.default = registerWithContext;

var _spyOnComponent = require('spy-on-component');

var _spyOnComponent2 = _interopRequireDefault(_spyOnComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerWithContext(component, submit) {

  function register(context) {
    if (context.reactFormalContext) {
      var registerSubmit = context.reactFormalContext.registerSubmit;


      if (registerSubmit) registerSubmit(submit);
    }
  }

  (0, _spyOnComponent2.default)(component, {
    componentDidMount: function componentDidMount() {
      register(this.context);
    },
    componentWillReceiveProps: function componentWillReceiveProps(_, nextContext) {
      register(nextContext);
    }
  });
}
module.exports = exports['default'];