import { useContext, useMemo } from 'react';
import { FormErrorContext } from './Contexts';
import memoize from 'memoize-one';
import shallowequal from 'shallowequal';
import { filterAndMapErrors, inclusiveMapErrors } from './Errors';
import { Errors } from './types';

type UseErrorOptions = { inclusive?: boolean };

function isFilterErrorsEqual([a], [b]) {
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
  const errors = useContext(FormErrorContext);
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
