'use strict';

exports.__esModule = true;
exports.isChildPath = undefined;
exports.prefix = prefix;
exports.unprefix = unprefix;
exports.filter = filter;
exports.remove = remove;
exports.shift = shift;
exports.unshift = unshift;
exports.inclusiveMapMessages = inclusiveMapMessages;

var _omitBy = require('lodash/omitBy');

var _omitBy2 = _interopRequireDefault(_omitBy);

var _paths = require('./paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isChildPath = exports.isChildPath = function isChildPath(basePath, path) {
  return path !== basePath && (0, _paths.inPath)(basePath, path);
};

function mapKeys(messages, baseName, fn) {
  var newMessages = {};

  Object.keys(messages).forEach(function (path) {
    var newKey = path;

    if (isChildPath(baseName, path)) {
      var matches = path.slice(baseName.length).match(/\[(\d+)\](.+)$/);

      newKey = fn(+matches[1], matches[2], path) || path;
    }

    newMessages[newKey] = messages[path];
  });

  return newMessages;
}

var prefixName = function prefixName(name, baseName) {
  return baseName + (!name || name[0] === '[' ? '' : '.') + name;
};

function prefix(messages, baseName) {
  var paths = Object.keys(messages);
  var result = {};

  paths.forEach(function (path) {
    result[prefixName(path, baseName)] = messages[path];
  });

  return result;
}

function unprefix(messages, baseName) {
  var paths = Object.keys(messages);
  var result = {};

  paths.forEach(function (path) {
    var shortened = path.slice(baseName.length).replace(/^\./, '');
    result[shortened] = messages[path];
  });
  return result;
}

function filter(messages, baseName) {
  var paths = Object.keys(messages);
  var result = {};

  paths.forEach(function (path) {
    if (isChildPath(baseName, path)) {
      result[path] = messages[path];
    }
  });

  return result;
}

function remove(messages) {
  for (var _len = arguments.length, basePaths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    basePaths[_key - 1] = arguments[_key];
  }

  return (0, _omitBy2.default)(messages, function (_, path) {
    return basePaths.some(function (b) {
      return (0, _paths.inPath)(b, path);
    });
  });
}

function shift(messages, baseName, atIndex) {
  var current = baseName + '[' + atIndex + ']';

  return mapKeys(remove(messages, current), baseName, function (index, tail) {
    if (index > atIndex) {
      return baseName + '[' + (index - 1) + ']' + tail;
    }

    return null;
  });
}

function unshift(messages, baseName, atIndex) {
  return mapKeys(messages, baseName, function (index, tail) {
    if (index > atIndex) {
      return baseName + '[' + (index + 1) + ']' + tail;
    }

    return null;
  });
}

function inclusiveMapMessages(messages, names) {
  var activeMessages = {};

  if (!names.length) return activeMessages;

  var paths = Object.keys(messages);

  names.forEach(function (name) {
    paths.forEach(function (path) {
      if (messages[path] && (0, _paths.inPath)(name, path)) {
        activeMessages[path] = messages[path];
      }
    });
  });

  return activeMessages;
}