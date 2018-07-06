import omitBy from 'lodash/omitBy'
import pick from 'lodash/pick'

import { inPath } from './paths'

export const EMPTY_ERRORS = Object.freeze({})

export let isChildPath = (basePath, path) =>
  path !== basePath && inPath(basePath, path)

function mapKeys(messages, baseName, fn) {
  if (messages === EMPTY_ERRORS) return messages

  const newMessages = {}
  let workDone = false
  Object.keys(messages).forEach(path => {
    let newKey = path

    if (isChildPath(baseName, path)) {
      const matches = path.slice(baseName.length).match(/\[(\d+)\](.*)$/)
      newKey = fn(+matches[1], matches[2] || '', path)
      if (!workDone && newKey !== path) workDone = true
    }

    newMessages[newKey] = messages[path]
  })

  return workDone ? newMessages : messages
}

const prefixName = (name, baseName) =>
  baseName + (!name || name[0] === '[' ? '' : '.') + name

export function prefix(messages, baseName) {
  const paths = Object.keys(messages)
  const result = {}

  paths.forEach(path => {
    result[prefixName(path, baseName)] = messages[path]
  })

  return result
}

export function unprefix(messages, baseName) {
  const paths = Object.keys(messages)
  const result = {}

  paths.forEach(path => {
    const shortened = path.slice(baseName.length).replace(/^\./, '')
    result[shortened] = messages[path]
  })
  return result
}

export function pickMessages(messages, names) {
  if (!names.length) return messages
  return pick(messages, names)
}

export function filter(messages, baseName) {
  const paths = Object.keys(messages)
  const result = {}

  paths.forEach(path => {
    if (isChildPath(baseName, path)) {
      result[path] = messages[path]
    }
  })

  return result
}

export function filterAndMapMessages({
  messages,
  names,
  resolveNames,
  mapMessages = pickMessages,
}) {
  if (!messages || messages === EMPTY_ERRORS) return messages

  names = resolveNames ? resolveNames() : names
  return mapMessages(messages, names ? [].concat(names) : [])
}

export function remove(messages, ...basePaths) {
  return omitBy(messages, (_, path) => basePaths.some(b => inPath(b, path)))
}

export function shift(messages, baseName, atIndex) {
  const current = `${baseName}[${atIndex}]`

  return mapKeys(remove(messages, current), baseName, (index, tail) => {
    if (index > atIndex) {
      return `${baseName}[${index - 1}]${tail}`
    }

    return null
  })
}

export function unshift(messages, baseName, atIndex) {
  return mapKeys(messages, baseName, (index, tail) => {
    if (index > atIndex) {
      return `${baseName}[${index + 1}]${tail}`
    }

    return null
  })
}

export function move(messages, baseName, fromIndex, toIndex) {
  return mapKeys(messages, baseName, (index, tail) => {
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

export function swap(messages, baseName, indexA, indexB) {
  return mapKeys(messages, baseName, (index, tail) => {
    if (index === indexA) return `${baseName}[${indexB}]${tail}`
    if (index === indexB) return `${baseName}[${indexA}]${tail}`
    return null
  })
}

export function inclusiveMapMessages(messages, names) {
  if (!names.length || messages === EMPTY_ERRORS) return EMPTY_ERRORS

  let activeMessages = {}
  let paths = Object.keys(messages)

  names.forEach(name => {
    paths.forEach(path => {
      if (messages[path] && inPath(name, path)) {
        activeMessages[path] = messages[path]
      }
    })
  })

  return activeMessages
}
