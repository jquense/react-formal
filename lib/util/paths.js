'use strict';

var prop = require('property-expr');

function inPath(pathA, pathB) {

  if (pathA === pathB) return true;
  if (pathB.indexOf(pathA) === 0) return true;

  var partsA = prop.split(pathA),
      partsB = prop.split(pathB);

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

module.exports = {

  inPath: inPath,

  isQuoted: isQuoted,

  clean: clean,

  reduce: function reduce(paths) {
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
};