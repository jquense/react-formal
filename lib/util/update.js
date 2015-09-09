'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var prop = require('property-expr'),
    paths = require('./paths');

var IS_ARRAY = /^\d+$/;

var has = Function.prototype.bind.call(Function.prototype.call, ({}).hasOwnProperty);

module.exports = function update(model, path, value) {
  var parts = prop.split(path),
      newModel = copy(model),
      part,
      islast;

  if (newModel === undefined) newModel = IS_ARRAY.test(parts[0]) ? [] : {};

  var current = newModel;

  for (var idx = 0; idx < parts.length; idx++) {
    islast = idx === parts.length - 1;
    part = paths.clean(parts[idx]);

    if (islast) current[part] = value;else {
      current = current[part] = !has(current, part) ? IS_ARRAY.test(parts[idx + 1]) ? [] : {} : copy(current[part]);
    }
  }

  return newModel;
};

function copy(value) {
  return Array.isArray(value) ? value.concat() : typeof value === 'object' ? _extends(new value.constructor(), value) : value;
}