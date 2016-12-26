'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 2) return addType.apply(undefined, args);

  for (var key in args[0]) {
    if (has(args[0], key)) addType(key, args[0][key]);
  }
};

var _types = require('./util/types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addType = function addType(type, Component) {
  var compType = typeof Component === 'undefined' ? 'undefined' : _typeof(Component);

  if (typeof type !== 'string') throw new TypeError('the `type` parameter must be a string');

  if (compType !== 'string' && compType !== 'function') throw new TypeError('The `Component` parameter must be a valid React Component class or tag name');

  _types2.default[type.toLowerCase()] = Component;
};

function has(o, k) {
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
}
module.exports = exports['default'];