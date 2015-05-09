'use strict';

var prop = require('property-expr');

var cache = Object.create(null);

module.exports = function specFromPath(path, value) {
  var obj = {},
      current = obj;

  if (cache[path]) {
    obj = cache[path].spec;
    cache[path].tip.$set = value;
    return obj;
  }

  prop.split(path).forEach(function (part) {
    return current = current[part] = {};
  });

  current.$set = value;
  cache[path] = { spec: obj, tip: current };

  return obj;
};