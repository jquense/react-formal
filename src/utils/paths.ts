/* eslint-disable @typescript-eslint/no-shadow */

import prop from 'property-expr';

export const toArray = <T>(arr?: T | T[] | null): T[] => {
  const next: T[] = [];
  return arr == null ? next : next.concat(arr);
};

export function isQuoted(str: string) {
  return typeof str === 'string' && str && (str[0] === '"' || str[0] === "'");
}

export function clean(part: string) {
  return isQuoted(part) ? part.substr(1, part.length - 2) : part;
}

export function inPath(basePath: string, childPath: string) {
  if (basePath === childPath) return true;

  let partsA = prop.split(basePath) || [];
  let partsB = prop.split(childPath) || [];

  if (partsA.length > partsB.length) return false;

  return partsA.every((part, idx) => clean(part) === clean(partsB[idx]));
}

export function reduce(paths: string[]) {
  paths = Array.from(new Set(toArray(paths)));

  if (paths.length <= 1) return paths;

  return paths.reduce<string[]>((paths, current) => {
    paths = paths.filter((p) => !inPath(current, p));

    if (!paths.some((p) => inPath(p, current))) paths.push(current);

    return paths;
  }, []);
}

export function trim(
  rootPath: string,
  pathHash: Record<string, any>,
  exact = false,
) {
  let workDone = false;
  let result: Record<string, any> = {};

  let matches = exact
    ? (p: string) => p === rootPath
    : (p: string) => inPath(rootPath, p);

  Object.keys(pathHash).forEach((path) => {
    if (matches(path)) {
      return (workDone = true);
    }

    result[path] = pathHash[path];
  });

  return workDone ? result : pathHash;
}
