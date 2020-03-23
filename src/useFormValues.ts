import { useBindingContext } from 'topeka';

/**
 * Returns the current Field value at the provided path.
 *
 * @param {string|string[]} field a field path to observe.
 * @returns {any | Array<any>}
 */
function useFormValues(field: string): any;
/**
 * Returns an array of values for the provided field paths.
 *
 * @param {string|string[]} fields a set of field paths to observe.
 * @returns {any | Array<any>}
 */
function useFormValues(fields: string[]): any[];
function useFormValues(fields: string | string[]): undefined | any | any[] {
  const ctx = useBindingContext();
  if (!ctx) return;

  return Array.isArray(fields)
    ? fields.map(f => ctx.getValue(f))
    : ctx.getValue(fields);
}

export default useFormValues;
