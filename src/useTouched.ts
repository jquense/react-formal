import { useContext, useMemo } from 'react';
import { FormTouchedContext } from './Contexts';
import memoize from 'memoize-one';
import { filterAndMapErrors } from './Errors';
import { Errors, Touched } from './types';

/**
 * Returns all errors for the form.
 *
 * @returns {Touched}
 */
function useTouched(): Errors;
/**
 * Returns the current Field value at the provided path.
 *
 * @param {string|string[]} path a path to retrieve errors for.
 * @returns {Touched}
 */
function useTouched(path: string): Touched;
/**
 * Returns an array of values for the provided field paths.
 *
 * @param {string|string[]} paths a set of paths to retrieve errors for.
 * @returns {Touched}
 */
function useTouched(paths: string[] | undefined): Touched;
function useTouched(paths?: string | string[]): Touched {
  const touched = useContext(FormTouchedContext);
  const memoFilterAndMapErrors = useMemo(
    () =>
      memoize(
        filterAndMapErrors,
        ([a], [b]) =>
          a.errors === b.errors &&
          a.names === b.names &&
          a.mapErrors === b.mapErrors,
      ),
    [],
  );
  return paths
    ? memoFilterAndMapErrors({ errors: touched, names: paths })
    : touched;
}

export default useTouched;
