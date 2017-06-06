import omitBy from 'lodash/omitBy';

import { inPath } from './paths';

export let isChildPath = (basePath, path) =>
  path !== basePath && inPath(basePath, path);


function mapKeys(messages, baseName, fn) {
  const newMessages = {};

  Object.keys(messages).forEach((path) => {
    let newKey = path;

    if (isChildPath(baseName, path)) {
      const matches = path.slice(baseName.length).match(/\[(\d+)\](.*)$/);

      newKey = fn(+matches[1], matches[2] || '', path) || path;
    }

    newMessages[newKey] = messages[path];
  });

  return newMessages;
}

const prefixName = (name, baseName) =>
  baseName + (!name || name[0] === '[' ? '' : '.') + name;

export function prefix(messages, baseName) {
  const paths = Object.keys(messages);
  const result = {};

  paths.forEach((path) => {
    result[prefixName(path, baseName)] = messages[path];
  });

  return result;
}

export function unprefix(messages, baseName) {
  const paths = Object.keys(messages);
  const result = {};

  paths.forEach((path) => {
    const shortened = path.slice(baseName.length).replace(/^\./, '');
    result[shortened] = messages[path];
  });
  return result;
}


export function filter(messages, baseName) {
  const paths = Object.keys(messages);
  const result = {};

  paths.forEach((path) => {
    if (isChildPath(baseName, path)) {
      result[path] = messages[path];
    }
  });

  return result;
}

export function remove(messages, ...basePaths) {
  return omitBy(messages, (_, path) => basePaths.some(b => inPath(b, path)));
}

export function shift(messages, baseName, atIndex) {
  const current = `${baseName}[${atIndex}]`;

  return mapKeys(
    remove(messages, current), baseName, (index, tail) => {
      if (index > atIndex) {
        return `${baseName}[${index - 1}]${tail}`;
      }

      return null;
    }
  );
}

export function unshift(messages, baseName, atIndex) {
  return mapKeys(messages, baseName, (index, tail) => {
    if (index > atIndex) {
      return `${baseName}[${index + 1}]${tail}`;
    }

    return null;
  });
}


export function inclusiveMapMessages(messages, names) {
  let activeMessages = {};

  if (!names.length) return activeMessages;

  let paths = Object.keys(messages);

  names.forEach(name => {
    paths.forEach(path => {
      if (messages[path] && inPath(name, path)) {
        activeMessages[path] = messages[path]
      }
    })
  })

  return activeMessages;
}
