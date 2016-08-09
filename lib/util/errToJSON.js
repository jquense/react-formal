'use strict';

exports.__esModule = true;
exports.default = errToJSON;
function errToJSON(error) {
  var target = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (error.inner.length) {
    error.inner.forEach(function (inner) {
      errToJSON(inner, target, inner.path);
    });

    return target;
  }

  var path = error.path || '';
  var existing = target[path];

  var json = {
    message: error.message,
    values: error.params,
    type: error.type
  };

  target[path] = existing ? [].concat(existing, [json]) : [json];

  return target;
}
module.exports = exports['default'];