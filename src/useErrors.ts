import { useMemo } from 'react';
import { useFormErrors } from './Contexts.js';
import memoize from './utils/memoize-one.js';
// @ts-expect-error
import shallowequal from 'shallowequal';
import { filterAndMapErrors, inclusiveMapErrors } from './Errors.js';
import { Errors } from './types.js';

type UseErrorOptions = { inclusive?: boolean };

function isFilterErrorsEqual([a]: any[], [b]: any[]) {
  let isEqual =
    (a.errors === b.errors || shallowequal(a.errors, b.errors)) &&
    a.names === b.names &&
    a.mapErrors === b.mapErrors;

  return isEqual;
}

/**
 * Returns the field errors for the form, or a subset of field errors if paths is provided.
 *
 * @param paths a path or set of paths to retrieve errors for.
 * @param options
 * @param {boolean=} options.inclusive By default, only errors with exact matches on each path are returned.
 *  Set to `false` to also return errors for a path and any nested paths
 *
 * @returns {Errors}
 */
function useErrors(
  paths?: string | string[],
  { inclusive }: UseErrorOptions = {},
): Errors {
  const errors = useFormErrors();
  const memoFilterAndMapErrors = useMemo(
    () => memoize(filterAndMapErrors, isFilterErrorsEqual),
    [],
  );

  return paths
    ? memoFilterAndMapErrors({
        errors,
        names: paths,
        mapErrors: !inclusive ? undefined : inclusiveMapErrors,
      })
    : errors;
}

export default useErrors;
