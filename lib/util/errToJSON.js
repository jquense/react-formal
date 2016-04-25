"use strict";

exports.__esModule = true;
exports["default"] = errToJSON;

function errToJSON(error) {
  if (error.inner.length) return error.inner.reduce(function (list, inner) {
    list[inner.path] = (list[inner.path] || []).concat(errToJSON(inner));

    return list;
  }, {});

  return {
    message: error.message,
    values: error.params,
    type: error.type
  };
}

module.exports = exports["default"];