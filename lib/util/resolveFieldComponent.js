'use strict';

exports.__esModule = true;
exports.default = resolveFieldComponent;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveFieldComponent(type, schema) {
  if (!type && schema) {
    var meta = schema.meta && schema.meta() || {};
    type = meta[_config2.default.metadataField] || schema._type;
  }

  var Component = type;

  if (typeof type === 'string') {
    Component = _config2.default.types[type.toLowerCase()] || _config2.default.types[''];
  }

  return [Component, type];
}
module.exports = exports['default'];