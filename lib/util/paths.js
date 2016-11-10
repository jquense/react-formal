'use strict';

exports.__esModule = true;
exports.inPath = inPath;
exports.clean = clean;
exports.isQuoted = isQuoted;
exports.reduce = reduce;
exports.trim = trim;

var _propertyExpr = require('property-expr');

var _propertyExpr2 = _interopRequireDefault(_propertyExpr);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inPath(basePath, childPath) {
  if (basePath === childPath) return true;

  var partsA = _propertyExpr2.default.split(basePath) || [],
      partsB = _propertyExpr2.default.split(childPath) || [];

  if (partsA.length > partsB.length) return false;

  return partsA.every(function (part, idx) {
    return clean(part) === clean(partsB[idx]);
  });
}

function clean(part) {
  return isQuoted(part) ? part.substr(1, part.length - 2) : part;
}

function isQuoted(str) {
  return typeof str === 'string' && str && (str[0] === '"' || str[0] === "'");
}

function reduce(paths) {
  paths = (0, _uniq2.default)(paths == null ? [] : [].concat(paths));

  if (paths.length <= 1) return paths;

  return paths.reduce(function (paths, current) {
    paths = paths.filter(function (p) {
      return !inPath(current, p);
    });

    if (!paths.some(function (p) {
      return inPath(p, current);
    })) paths.push(current);

    return paths;
  }, []);
}

function trim(rootPath, pathHash) {
  var exact = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var workDone = false;
  var result = {};

  var matches = exact ? function (p) {
    return p === rootPath;
  } : function (p) {
    return inPath(rootPath, p);
  };

  Object.keys(pathHash).forEach(function (path) {
    if (matches(path)) {
      return workDone = true;
    }

    result[path] = pathHash[path];
  });

  return workDone ? result : pathHash;
}