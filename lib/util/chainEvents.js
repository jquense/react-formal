'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mergeWithEvents;

var _chainFunction = require('chain-function');

var _chainFunction2 = _interopRequireDefault(_chainFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function chainEvents(events, objects) {
  if (!events) return;

  var result = {};

  [].concat(events).forEach(function (event) {
    var handlers = objects.map(function (p) {
      return p[event];
    });
    result[event] = _chainFunction2.default.apply(undefined, handlers);
  });

  return result;
}

function mergeWithEvents(events, objects) {
  return _extends.apply(undefined, [{}].concat(objects, [chainEvents(events, objects)]));
}
module.exports = exports['default'];