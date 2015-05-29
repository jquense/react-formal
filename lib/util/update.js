'use strict';

var babelHelpers = require('./babelHelpers.js');

var prop = require('property-expr');

var IS_ARRAY = /^\d+$/;

var has = Function.prototype.bind.call(Function.prototype.call, ({}).hasOwnProperty);

module.exports = function update(model, path, value) {
  var parts = prop.split(path),
      newModel = copy(model),
      part,
      islast;

  var current = newModel;

  for (var idx = 0; idx < parts.length; idx++) {
    islast = idx === parts.length - 1;
    part = clean(parts[idx]);

    if (islast) current[part] = value;else {
      current = current[part] = !has(current, part) ? IS_ARRAY.test(parts[idx + 1]) ? [] : {} : copy(current[part]);
    }
  }

  return newModel;
};

function copy(value) {
  return Array.isArray(value) ? value.concat() : typeof value === 'object' ? babelHelpers._extends(new value.constructor(), value) : value;
}

function clean(part) {
  return isQuoted(part) ? part.substr(1, part.length - 2) : part;
}

function isQuoted(str) {
  return typeof str === 'string' && str && (str[0] === '"' || str[0] === '\'');
}