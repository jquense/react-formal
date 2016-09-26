'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = addTypes;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addType(type, Component) {
  var compType = typeof Component === 'undefined' ? 'undefined' : _typeof(Component);

  if (typeof type !== 'string') throw new TypeError('the `type` parameter must be a string');

  if (compType !== 'string' && compType !== 'function') throw new TypeError('The `Component` parameter must be a valid React Component class or tag name');

  _config2.default.types[type] = Component;
}

function addTypes() {
  var types = arguments.length <= 0 ? undefined : arguments[0];

  if (arguments.length === 2) return addType.apply(undefined, arguments);

  Object.keys(types).forEach(function (key) {
    addType(key, types[key]);
  });
}
module.exports = exports['default'];