"use strict";

exports.__esModule = true;
exports["default"] = uniqMessage;

function uniqMessage(msg, i, list) {
  var idx = -1;
  var extract = function extract(item) {
    return item.type || item;
  };

  msg = extract(msg);

  list.some(function (item, ii) {
    if (extract(item) === msg) {
      idx = ii;
      return true;
    }
  });

  return idx === i;
}

module.exports = exports["default"];