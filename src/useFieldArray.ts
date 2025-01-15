/* eslint-disable @typescript-eslint/no-shadow */

import { useRef, useMemo } from 'react';
import { Errors } from './types.js';
import { FieldMeta, UseFieldMetaOptions, useFieldMeta } from './useField.js';
import { move, remove, shift, unshift } from './Errors.js';
import { ValidationPathSpec } from './errorManager.js';
import { useFormActions } from './Contexts.js';

export type FieldArrayMeta = FieldMeta;

export interface FieldArrayHelpers<T = any> {
  /** Add an item to the beginning of the array */
  unshift(item: T): void;

  /**
   * Add an item to the end of the array
   * @deprecated use `push`
   */
  add(item: T): void;

  /** Add an item to the end of the array */
  push(item: T): void;

  /** Insert an item at the provided index */
  insert(item: T, index: number): void;

  /** Move an item to a new index */
  move(item: T, toIndex: number): void;

  /** Remove an item from the list */
  remove(item: T): void;

  /**
   * update or replace an item with a new one.
   */
  update(item: T, oldItem: T): void;

  onItemError(name: string, errors: Errors): void;
}

export type UseFieldArrayOptions = Omit<UseFieldMetaOptions, 'validates'> & {
  validates?: string | string[] | null;
};

/**
 * Retrieve the values at a given path as well as a set of array helpers
 * for manipulating list values.
 *
 * ```jsx
 * function ContactList() {
 *   const [values, arrayHelpers, meta] = useFieldArray("contacts")
 *
 *   return (
 *     <ul>
 *       {values.map((value, idx) => (
 *          <li key={value.id}>
 *            <Form.Field name={`contacts[${idx}].name`} />
 *
 *            <button onClick={() => arrayHelpers.remove(value)}>
 *              Remove
 *            </button>
 *          </li>
 *        )}
 *     </ul>
 *   )
 * }
 * ```
 *
 * @param name A field path, should point to an array value in the form data
 */

function useFieldArray<T = any>(
  name: string,
): [T[], FieldArrayHelpers<T>, FieldMeta];
/**
 * Retrieve the values at a given path as well as a set of array helpers
 * for manipulating list values.
 *
 * ```jsx
 * function ContactList() {
 *   const [values, arrayHelpers, meta] = useFieldArray({
 *     name: 'contacts',
 *     validates: 'otherField'
 *   })
 *
 *   return (
 *     <ul>
 *       {values.map((value, idx) => (
 *          <li key={value.id}>
 *            <Form.Field name={`contacts[${idx}].name`} />
 *
 *            <button onClick={() => arrayHelpers.remove(value)}>
 *              Remove
 *            </button>
 *          </li>
 *        )}
 *     </ul>
 *   )
 * }
 * ```
 *
 * @param name A field path, should point to an array value in the form data
 */
function useFieldArray<T = any>(
  options: UseFieldArrayOptions,
): [T[], FieldArrayHelpers<T>, FieldMeta];
function useFieldArray<T = any>(
  optionsOrName: string | UseFieldArrayOptions,
): [T[], FieldArrayHelpers<T>, FieldMeta] {
  let options =
    typeof optionsOrName === 'string'
      ? { name: optionsOrName, exclusive: true }
      : optionsOrName;

  let { name } = options;

  const actions = useFormActions();

  // TODO: doesn't shallow validate validates
  const fieldsToValidate = useMemo<ValidationPathSpec[]>(
    () => [{ path: name, shallow: true }],
    [name],
  );

  const meta = useFieldMeta({
    ...options,
    exclusive: options.exclusive ?? true,
    validates: fieldsToValidate,
  });

  const { errors, onError, value, onChange, update } = meta;

  const sendErrors = (fn: (e: Errors, n: string) => Errors) => {
    onError(fn(errors || {}, options.name));
  };

  const helpers: FieldArrayHelpers<T> = {
    unshift: (item: T) => helpers.insert(item, 0),

    add: (item: T) => helpers.push(item),

    push: (item: T) => helpers.insert(item, value ? value.length : 0),

    insert: (item: T, index: number) => {
      const newValue = value == null ? [] : [...value];

      newValue.splice(index, 0, item);

      onChange(newValue);
      sendErrors((errors, name) => unshift(errors, name, index));
    },

    move: (item: T, toIndex: number) => {
      const fromIndex = value.indexOf(item);
      const newValue = value == null ? [] : [...value];

      if (fromIndex === -1)
        throw new Error('`onMove` must be called with an item in the array');

      newValue.splice(toIndex, 0, ...newValue.splice(fromIndex, 1));

      // FIXME: doesn't handle syncing error state. , { action: 'move', toIndex, fromIndex }
      onChange(newValue);

      sendErrors((errors, name) => move(errors, name, fromIndex, toIndex));
    },

    remove: (item: T) => {
      if (value == null) return;

      const index = value.indexOf(item);
      onChange(value.filter((v: any) => v !== item));

      sendErrors((errors, name) => shift(errors, name, index));
    },

    onItemError: (name: string, errors: Errors) => {
      sendErrors((fieldErrors) => ({
        ...remove(fieldErrors, name),
        ...errors,
      }));
    },

    update: (updatedItem: T, oldItem: T) => {
      const index = value.indexOf(oldItem);
      const newValue = value == null ? [] : [...value];

      newValue.splice(index, 1, updatedItem);

      update(newValue);
      // @ts-ignore
      if (options.noValidate) return;

      actions?.onValidate([`${name}[${index}]`], 'onChange', []);
    },
  };

  return [
    value as T[],
    Object.assign(useRef({} as any).current, helpers),
    meta,
  ];
}

export default useFieldArray;
