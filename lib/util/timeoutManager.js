'use strict';

exports.__esModule = true;
exports.default = createTimeoutManager;

var _spyOnComponent = require('spy-on-component');

var _spyOnComponent2 = _interopRequireDefault(_spyOnComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTimeoutManager(componentInstance) {
  var unmounted = false;
  var timers = Object.create(null);

  (0, _spyOnComponent2.default)(componentInstance, {
    componentWillUnmount: function componentWillUnmount() {
      unmounted = true;

      for (var k in timers) {
        clearTimeout(timers[k]);
      }timers = null;
    }
  });

  return {
    clear: function clear(key) {
      clearTimeout(timers[key]);
    },
    set: function set(key, fn, ms) {
      if (unmounted) return;
      timers[key] = setTimeout(fn, ms);
    }
  };
}
module.exports = exports['default'];