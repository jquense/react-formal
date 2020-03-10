import invariant from 'invariant';
import { useRef, useMemo, useContext } from 'react';
import { Errors } from './types';
import { FieldMeta, UseFieldMetaOptions, useFieldMeta } from './useField';
import { move, remove, shift, unshift } from './utils/ErrorUtils';
import { ValidationPathSpec } from './errorManager';
import { FormActionsContext } from './Contexts';

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

export type UseFieldArrayOptions = UseFieldMetaOptions;

/**
 * Retrieve the values at a given path as well as a setr of array helpers
 * for manipulating list values.
 *
 * @param name A field path
 */
function useFieldArray<T = any>(
  name: string,
): [T[], FieldArrayHelpers<T>, FieldMeta];
function useFieldArray<T = any>(
  options: UseFieldArrayOptions,
): [T[], FieldArrayHelpers<T>, FieldMeta];
function useFieldArray<T = any>(
  optionsOrName: string | UseFieldArrayOptions,
): [T[], FieldArrayHelpers<T>, FieldMeta] {
  let options =
    typeof optionsOrName === 'string' ? { name: optionsOrName } : optionsOrName;

  let { name } = options;

  const actions = useContext(FormActionsContext);

  // TODO: doesn't shallow validate validates
  const fieldsToValidate = useMemo<ValidationPathSpec[]>(
    () => [{ path: name, shallow: true }],
    [name],
  );

  const meta = useFieldMeta({ ...options, validates: fieldsToValidate });

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

      invariant(
        fromIndex !== -1,
        '`onMove` must be called with an item in the array',
      );

      newValue.splice(toIndex, 0, ...newValue.splice(fromIndex, 1));

      // FIXME: doesn't handle syncing error state. , { action: 'move', toIndex, fromIndex }
      onChange(newValue);

      sendErrors((errors, name) => move(errors, name, fromIndex, toIndex));
    },

    remove: (item: T) => {
      if (value == null) return;

      const index = value.indexOf(item);
      onChange(value.filter(v => v !== item));

      sendErrors((errors, name) => shift(errors, name, index));
    },

    onItemError: (name: string, errors: Errors) => {
      sendErrors(fieldErrors => ({
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
