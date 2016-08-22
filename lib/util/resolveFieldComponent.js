'use strict';

exports.__esModule = true;
exports.default = resolveFieldComponent;

var _Input = require('../inputs/Input');

var _Input2 = _interopRequireDefault(_Input);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveFieldComponent(type, schema) {
  if (!type && schema) {
    var meta = schema.meta && schema.meta() || {};
    type = meta[_config2.default.metadataField] || schema._type;
  }

  var Component = type;

  if (typeof type === 'string') {
    Component = _types2.default[type.toLowerCase()] || _Input2.default;
  }

  return [Component, type];
}
module.exports = exports['default'];