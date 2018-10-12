import omitBy from 'lodash/omitBy'
import pick from 'lodash/pick'

import { inPath } from './paths'

export const EMPTY_ERRORS = Object.freeze({})

export let isChildPath = (basePath, path) =>
  path !== basePath && inPath(basePath, path)

function mapKeys(errors, baseName, fn) {
  if (errors === EMPTY_ERRORS) return errors

  const newErrors = {}
  let workDone = false
  Object.keys(errors).forEach(path => {
    let newKey = path

    if (isChildPath(baseName, path)) {
      const matches = path.slice(baseName.length).match(/\[(\d+)\](.*)$/)
      newKey = fn(+matches[1], matches[2] || '', path)
      if (!workDone && newKey !== path) workDone = true
    }

    newErrors[newKey] = errors[path]
  })

  return workDone ? newErrors : errors
}

const prefixName = (name, baseName) =>
  baseName + (!name || name[0] === '[' ? '' : '.') + name

export function prefix(errors, baseName) {
  const paths = Object.keys(errors)
  const result = {}

  paths.forEach(path => {
    result[prefixName(path, baseName)] = errors[path]
  })

  return result
}

export function unprefix(errors, baseName) {
  const paths = Object.keys(errors)
  const result = {}

  paths.forEach(path => {
    const shortened = path.slice(baseName.length).replace(/^\./, '')
    result[shortened] = errors[path]
  })
  return result
}

export function pickErrors(errors, names) {
  if (!names.length) return errors
  return pick(errors, names)
}

export function filter(errors, baseName) {
  const paths = Object.keys(errors)
  const result = {}

  paths.forEach(path => {
    if (isChildPath(baseName, path)) {
      result[path] = errors[path]
    }
  })

  return result
}

export function filterAndMapErrors({
  errors,
  names,
  resolveNames,
  mapErrors = pickErrors,
}) {
  if (!errors || errors === EMPTY_ERRORS) return errors

  names = resolveNames ? resolveNames() : names

  return mapErrors(errors, names ? [].concat(names) : [])
}

export function remove(errors, ...basePaths) {
  return omitBy(errors, (_, path) => basePaths.some(b => inPath(b, path)))
}

export function shift(errors, baseName, atIndex) {
  const current = `${baseName}[${atIndex}]`

  return mapKeys(remove(errors, current), baseName, (index, tail) => {
    if (index > atIndex) {
      return `${baseName}[${index - 1}]${tail}`
    }

    return null
  })
}

export function unshift(errors, baseName, atIndex) {
  return mapKeys(errors, baseName, (index, tail) => {
    if (index > atIndex) {
      return `${baseName}[${index + 1}]${tail}`
    }

    return null
  })
}

export function move(errors, baseName, fromIndex, toIndex) {
  return mapKeys(errors, baseName, (index, tail) => {
    if (fromIndex > toIndex) {
      if (index === fromIndex) return `${baseName}[${toIndex}]${tail}`
      // increment everything above the pivot
      if (index >= toIndex && index < fromIndex)
        return `${baseName}[${index + 1}]${tail}`
    } else if (fromIndex < toIndex) {
      if (index === fromIndex) return `${baseName}[${toIndex}]${tail}`
      // decrement everything above the from item we moved
      if (index >= fromIndex && index < toIndex)
        return `${baseName}[${index - 1}]${tail}`
    }

    return null
  })
}

export function swap(errors, baseName, indexA, indexB) {
  return mapKeys(errors, baseName, (index, tail) => {
    if (index === indexA) return `${baseName}[${indexB}]${tail}`
    if (index === indexB) return `${baseName}[${indexA}]${tail}`
    return null
  })
}

export function inclusiveMapErrors(errors, names) {
  if (!names.length || errors === EMPTY_ERRORS) return EMPTY_ERRORS
  let activeErrors = {}
  let paths = Object.keys(errors)

  names.forEach(name => {
    paths.forEach(path => {
      if (errors[path] && inPath(name, path)) {
        activeErrors[path] = errors[path]
      }
    })
  })

  return activeErrors
}
