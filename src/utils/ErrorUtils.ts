import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import { Errors } from '../types';
import { inPath, toArray } from './paths';

export const EMPTY_ERRORS: Errors = Object.freeze({});

export let isChildPath = (basePath: string, path: string) =>
  path !== basePath && inPath(basePath, path);

function mapKeys(
  errors: Errors,
  baseName: string,
  fn: (idx: number, tail: string, path: string) => string | null,
) {
  if (errors === EMPTY_ERRORS) return errors;

  const newErrors = {};
  let workDone = false;
  Object.keys(errors).forEach(path => {
    let newKey: string | null = path;

    if (isChildPath(baseName, path)) {
      const matches = path.slice(baseName.length).match(/\[(\d+)\](.*)$/);
      newKey = fn(+matches![1], matches![2] || '', path) ?? path;

      if (!workDone && newKey !== path) workDone = true;
    }

    newErrors[newKey!] = errors[path];
  });

  return workDone ? newErrors : errors;
}

const prefixName = (name: string, baseName: string) =>
  baseName + (!name || name[0] === '[' ? '' : '.') + name;

export function prefix(errors: Errors, baseName: string): Errors {
  const paths = Object.keys(errors);
  const result = {};

  paths.forEach(path => {
    result[prefixName(path, baseName)] = errors[path];
  });

  return result;
}

export function unprefix(errors: Errors, baseName: string): Errors {
  const paths = Object.keys(errors);
  const result = {};

  paths.forEach(path => {
    const shortened = path.slice(baseName.length).replace(/^\./, '');
    result[shortened] = errors[path];
  });
  return result;
}

export function pickErrors(errors: Errors, names: string[]) {
  if (!names.length) return errors;
  return pick(errors, names);
}

export function filter(errors: Errors, baseName: string): Errors {
  const paths = Object.keys(errors);
  const result = {};

  paths.forEach(path => {
    if (isChildPath(baseName, path)) {
      result[path] = errors[path];
    }
  });

  return result;
}

export interface FilterAndMapErrorsOptions {
  errors?: Errors;
  names: string | string[];
  mapErrors?: (errors: Errors, names: string[]) => Errors;
}

export function filterAndMapErrors({
  errors,
  names,
  mapErrors = pickErrors,
}: FilterAndMapErrorsOptions): Errors {
  if (!errors || errors === EMPTY_ERRORS) return EMPTY_ERRORS;

  return mapErrors(errors, toArray(names));
}

export function remove(errors: Errors, ...basePaths: string[]) {
  return omitBy(errors, (_, path) => basePaths.some(b => inPath(b, path)));
}

export function shift(errors: Errors, baseName: string, atIndex = 0) {
  const current = `${baseName}[${atIndex}]`;

  return mapKeys(remove(errors, current), baseName, (index, tail) => {
    if (index >= atIndex) {
      return `${baseName}[${index - 1}]${tail}`;
    }

    return null;
  });
}

export function unshift(errors: Errors, baseName: string, atIndex = 0) {
  return mapKeys(errors, baseName, (index, tail) => {
    if (index >= atIndex) {
      return `${baseName}[${index + 1}]${tail}`;
    }

    return null;
  });
}

export function move(
  errors: Errors,
  baseName: string,
  fromIndex: number,
  toIndex: number,
) {
  return mapKeys(errors, baseName, (index, tail) => {
    if (fromIndex > toIndex) {
      if (index === fromIndex) return `${baseName}[${toIndex}]${tail}`;
      // increment everything above the pivot
      if (index >= toIndex && index < fromIndex)
        return `${baseName}[${index + 1}]${tail}`;
    } else if (fromIndex < toIndex) {
      if (index === fromIndex) return `${baseName}[${toIndex}]${tail}`;
      // decrement everything above the from item we moved
      if (index >= fromIndex && index < toIndex)
        return `${baseName}[${index - 1}]${tail}`;
    }

    return null;
  });
}

export function swap(
  errors: Errors,
  baseName: string,
  indexA: number,
  indexB: number,
) {
  return mapKeys(errors, baseName, (index, tail) => {
    if (index === indexA) return `${baseName}[${indexB}]${tail}`;
    if (index === indexB) return `${baseName}[${indexA}]${tail}`;
    return null;
  });
}

export function inclusiveMapErrors(errors: Errors, names: string[]) {
  if (!names.length || errors === EMPTY_ERRORS) return EMPTY_ERRORS;
  let activeErrors = {};
  let paths = Object.keys(errors);

  names.forEach(name => {
    paths.forEach(path => {
      if (errors[path] && inPath(name, path)) {
        activeErrors[path] = errors[path];
      }
    });
  });

  return activeErrors;
}
