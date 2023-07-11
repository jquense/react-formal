/* eslint-disable @typescript-eslint/no-empty-function */

import expr from 'property-expr';
import useUpdatedRef from '@restart/hooks/useUpdatedRef';
import React, {
  useCallback,
  useMemo,
  useContext,
  useRef,
  useState,
  useLayoutEffect,
  SyntheticEvent,
} from 'react';
import updateIn from './utils/updateIn';
import { MapToValue } from './useBinding';

export type Mapper<TOut, TIn = any> = (input: TIn) => TOut;

type BindingValue = Record<PropertyKey, any> | unknown[];

export const formGetter = (path: string, model: any) =>
  path ? expr.getter(path, true)(model || {}) : model;

export function formSetter<TValue extends BindingValue>(
  path: string,
  value: TValue | undefined,
  fieldValue: unknown,
) {
  return updateIn(value, path, fieldValue);
}

type BindingContextValue = {
  getValue<T>(path: Mapper<T> | keyof T): T;
  getSchemaForPath: (path: string) => any;
  updateBindingValue<T>(path: MapToValue<T>, args: any[]): void;
  updateFormValue: (nextFormValue: any) => void;
  formValue: any;
};

export const BindingContext = React.createContext<BindingContextValue>({
  getValue() {},
  updateBindingValue() {},
} as any);

BindingContext.displayName = 'ReactFormalValueContext';

export const useBindingContext = () => {
  return useContext(BindingContext);
};

type Setter<TValue extends BindingValue> = (
  path: string,
  value: TValue | undefined,
  fieldValue: unknown,
) => TValue;

type Props<TValue extends BindingValue> = {
  formValue?: TValue;
  onChange(value: TValue, paths: string[]): void;
  getSchemaForPath: (path: string, value: TValue) => any;
  getter?: (path: string, value?: TValue) => any;
  setter?: (
    path: string,
    value: TValue | undefined,
    fieldValue: unknown,
    defaultSetter: Setter<TValue>,
  ) => TValue;
};

const isEvent = (e): e is SyntheticEvent =>
  typeof e == 'object' && e != null && 'target' in e;

function parseValueFromEvent(
  target: HTMLInputElement & HTMLSelectElement,
  fieldValue: any,
  fieldSchema?: any,
) {
  const { type, value, checked, options, multiple, files } = target;

  if (type === 'file') return multiple ? files : files && files[0];
  if (multiple) {
    // @ts-ignore
    const innerType = fieldSchema?._subType?._type;

    return Array.from(options)
      .filter((opt) => opt.selected)
      .map(({ value: option }) =>
        innerType == 'number' ? parseFloat(option) : option,
      );
  }

  if (/number|range/.test(type)) {
    let parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  if (type === 'checkbox') {
    const isArray = Array.isArray(fieldValue);

    const isBool = !isArray && (fieldSchema as any)?._type === 'boolean';

    if (isBool) return checked;

    const nextValue = isArray ? [...fieldValue] : [];
    const idx = nextValue.indexOf(value);

    if (checked) {
      if (idx === -1) nextValue.push(value);
    } else nextValue.splice(idx, 1);

    return nextValue;
  }

  return value;
}

function useFormBindingContext<TValue extends BindingValue>({
  formValue,
  onChange,
  setter = formSetter,
  getter = formGetter,
  getSchemaForPath,
}: Props<TValue>) {
  // Why is this so complicated?
  // Well, calling onChange, from a binding multiple times would trigger
  // a change multiple times. Duh. This change, when controlled, might not flush
  // back through by the time the next change is called, leaving the updateBindingValue()
  // with a stale copy of `model`. React's setState avoids this with it's function
  // signature of useState, so we "queue" model changes locally in state, and
  // then "flush" them in an effect when the update is finished.
  let formValueRef = useUpdatedRef(formValue);
  let pendingChangeRef = useRef(false);
  let [pendingChange, setPendingChange] = useState<[TValue, string[]]>([
    formValue!,
    [],
  ]);

  // This assumes that we won't get an update until all the queued setState's fire,
  // then if there is a pending change we fire onChange with it and the consolidated
  // paths
  useLayoutEffect(() => {
    const [nextFormValue, paths] = pendingChange;
    if (pendingChangeRef.current) {
      pendingChangeRef.current = false;
      onChange(nextFormValue, paths);
    }
  });

  const updateBindingValue = useCallback(
    (mapValue, args) => {
      setPendingChange((pendingState) => {
        let [nextModel, paths] = pendingState;

        // If there are no unflushed changes then use the current props model, assuming it
        // would be up to date.
        if (!pendingChangeRef.current) {
          pendingChangeRef.current = true;
          nextModel = formValueRef.current!;
          paths = [];
        }

        Object.keys(mapValue).forEach((key) => {
          let field = mapValue[key];
          let value: any;

          if (typeof field === 'function') value = field(...args);
          else if (field === '.' || field == null || args[0] == null)
            value = args[0];
          else {
            value = expr.getter(field, true)(args[0]);
          }

          if (paths.indexOf(key) === -1) paths.push(key);

          if (isEvent(value))
            value = parseValueFromEvent(
              value.target as any,
              formGetter(key, nextModel),
              getSchemaForPath(key, nextModel),
            );

          nextModel = setter!(key, nextModel, value, formSetter);
        });

        return [nextModel, paths];
      });
    },
    [formValueRef, getSchemaForPath, setter],
  );

  const getValue = useCallback(
    (pathOrAccessor) =>
      typeof pathOrAccessor === 'function'
        ? pathOrAccessor(formValue, getter)
        : getter(pathOrAccessor, formValue),
    [getter, formValue],
  );

  return useMemo(
    () => ({
      getValue,
      updateBindingValue,
      getSchemaForPath: getSchemaForPath as (path: string) => any,
      updateFormValue: (nextFormValue: TValue) => {
        setPendingChange(() => {
          pendingChangeRef.current = true;
          return [nextFormValue, []];
        });
      },
      formValue,
    }),
    [
      getValue,
      updateBindingValue,
      setPendingChange,
      getSchemaForPath,
      formValue,
    ],
  );
}

export default useFormBindingContext;
