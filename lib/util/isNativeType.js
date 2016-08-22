'use strict';

exports.__esModule = true;
exports.default = isNativeType;
function isNativeType(type) {
  return type === 'button' || type === 'checkbox' || type === 'color' || type === 'date' || type === 'datetime' || type === 'datetime-local' || type === 'email' || type === 'file' || type === 'month' || type === 'number' || type === 'password' || type === 'radio' || type === 'range' || type === 'reset' || type === 'search' || type === 'submit' || type === 'tel' || type === 'text' || type === 'time' || type === 'url' || type === 'week';
}
module.exports = exports['default'];