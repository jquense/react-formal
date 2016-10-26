import prop from 'property-expr';
import uniq from 'lodash/uniq';

export function inPath(basePath, childPath) {
  if (basePath === childPath) return true

  var partsA = prop.split(basePath) || []
    , partsB = prop.split(childPath) || []

  if (partsA.length > partsB.length)
    return false

  return partsA.every(
    (part, idx) => clean(part) === clean(partsB[idx]))
}

export function clean(part) {
  return isQuoted(part)
    ? part.substr(1, part.length - 2) : part
}

export function isQuoted(str){
  return typeof str === 'string' && str
      && (str[0] === '"' || str[0] === "'")
}

export function reduce(paths) {
  paths = uniq(paths == null ? [] : [].concat(paths));

  if (paths.length <= 1)
    return paths

  return paths.reduce((paths, current)=> {
    paths = paths.filter(p => !inPath(current, p))

    if (!paths.some(p => inPath(p, current)))
      paths.push(current)

    return paths
  }, [])
}

export function trim(rootPath, pathHash, exact = false) {
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
