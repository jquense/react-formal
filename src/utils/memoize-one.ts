// VENDORED memoize-one from npm

const safeIsNaN =
  Number.isNaN ||
  function ponyfill(value: unknown): boolean {
    // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#polyfill
    // NaN is the only value in JavaScript which is not equal to itself.
    return typeof value === 'number' && value !== value;
  };

function isEqual(first: unknown, second: unknown): boolean {
  if (first === second) {
    return true;
  }

  // Special case for NaN (NaN !== NaN)
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }

  return false;
}

function areInputsEqual(
  newInputs: readonly unknown[],
  lastInputs: readonly unknown[],
): boolean {
  // no checks needed if the inputs length has changed
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  // Using for loop for speed. It generally performs better than array.every
  // https://github.com/alexreardon/memoize-one/pull/59
  for (let i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}

export type EqualityFn<TFunc extends (...args: any[]) => any> = (
  newArgs: Parameters<TFunc>,
  lastArgs: Parameters<TFunc>,
) => boolean;

export type MemoizedFn<TFunc extends (this: any, ...args: any[]) => any> = {
  clear: () => void;
  (
    this: ThisParameterType<TFunc>,
    ...args: Parameters<TFunc>
  ): ReturnType<TFunc>;
};

// internal type
type Cache<TFunc extends (this: any, ...args: any[]) => any> = {
  lastThis: ThisParameterType<TFunc>;
  lastArgs: Parameters<TFunc>;
  lastResult: ReturnType<TFunc>;
};

function memoizeOne<TFunc extends (this: any, ...newArgs: any[]) => any>(
  resultFn: TFunc,
  isEqual: EqualityFn<TFunc> = areInputsEqual,
): MemoizedFn<TFunc> {
  let cache: Cache<TFunc> | null = null;

  // breaking cache when context (this) or arguments change
  function memoized(
    this: ThisParameterType<TFunc>,
    ...newArgs: Parameters<TFunc>
  ): ReturnType<TFunc> {
    if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {
      return cache.lastResult;
    }

    // Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
    // Doing the lastResult assignment first so that if it throws
    // the cache will not be overwritten
    const lastResult = resultFn.apply(this, newArgs);
    cache = {
      lastResult,
      lastArgs: newArgs,
      lastThis: this,
    };

    return lastResult;
  }

  // Adding the ability to clear the cache of a memoized function
  memoized.clear = function clear() {
    cache = null;
  };

  return memoized;
}

export default memoizeOne;
