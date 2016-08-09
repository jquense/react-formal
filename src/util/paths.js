import prop from 'property-expr';
import uniq from 'lodash/array/uniq';

function inPath(pathA, pathB) {
  if (pathA === pathB) return true

  var partsA = prop.split(pathA) || []
    , partsB = prop.split(pathB) || []

  if (partsA.length > partsB.length)
    return false

  return partsA.every(
    (part, idx) => clean(part) === clean(partsB[idx]))
}

function clean(part) {
  return isQuoted(part)
    ? part.substr(1, part.length - 2) : part
}

function isQuoted(str){
  return typeof str === 'string' && str
      && (str[0] === '"' || str[0] === "'")
}

module.exports = {

  inPath,

  isQuoted,

  clean,

  reduce(paths) {
    paths = uniq(paths == null ? [] : [].concat(paths));

    if (paths.length <= 1)
      return paths

    return paths.reduce((paths, current)=> {
      paths = paths.filter(p => !inPath(current, p))

      if (!paths.some(p => inPath(p, current)))
        paths.push(current)

      return paths
    }, [])
  },

  trim(rootPath, pathHash, exact = false) {
    let workDone = false;
    let result = {}

    let matches = exact
      ? (p => p === rootPath)
      : (p => inPath(rootPath, p))

    Object.keys(pathHash).forEach(path => {
      if (matches(path)) {
        return workDone = true
      }

      result[path] = pathHash[path]
    })

    return workDone ? result : pathHash;
  }
}
