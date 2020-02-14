import uniq from 'lodash/uniq'
import prop from 'property-expr'

export const toArray = <T>(arr?: T | T[] | null): T[] =>
  arr == null ? [] : ([] as T[]).concat(arr)

export function isQuoted(str: string) {
  return typeof str === 'string' && str && (str[0] === '"' || str[0] === "'")
}

export function clean(part: string) {
  return isQuoted(part) ? part.substr(1, part.length - 2) : part
}

export function inPath(basePath: string, childPath: string) {
  if (basePath === childPath) return true

  let partsA = prop.split(basePath) || []
  let partsB = prop.split(childPath) || []

  if (partsA.length > partsB.length) return false

  return partsA.every((part, idx) => clean(part) === clean(partsB[idx]))
}

export function reduce(paths: string[]) {
  paths = uniq(toArray(paths))

  if (paths.length <= 1) return paths

  return paths.reduce<string[]>((paths, current) => {
    paths = paths.filter(p => !inPath(current, p))

    if (!paths.some(p => inPath(p, current))) paths.push(current)

    return paths
  }, [])
}

export function trim(
  rootPath: string,
  pathHash: Record<string, string>,
  exact = false,
) {
  let workDone = false
  let result = {}

  let matches = exact ? p => p === rootPath : p => inPath(rootPath, p)

  Object.keys(pathHash).forEach(path => {
    if (matches(path)) {
      return (workDone = true)
    }

    result[path] = pathHash[path]
  })

  return workDone ? result : pathHash
}
