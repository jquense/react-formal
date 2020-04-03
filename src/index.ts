import invariant from 'invariant';
import { InferType, ObjectSchema, ValidationError } from 'yup';
import Field, { useMergedEventHandlers } from './Field';
import FieldArray from './FieldArray';
import FormComponent, { getter, setter } from './Form';
import Submit from './Submit';
import Message from './Message';
import NestedForm from './NestedForm';
import Summary from './Summary';
import config from './config';
import useField, { ValidateStrategies } from './useField';
import useFormValues from './useFormValues';
import useFieldArray from './useFieldArray';
import errToJSON from './utils/errToJSON';
import useFormSubmit from './useFormSubmit';
import useErrors from './useErrors';
import useTouched from './useTouched';

export type Form = typeof FormComponent;

export type FieldArrayHelpers = import('./useFieldArray').FieldArrayHelpers;
export type FieldArrayMeta = import('./useFieldArray').FieldArrayMeta;
export type UseFieldArrayOptions = import('./useFieldArray').UseFieldArrayOptions;

export type FieldMeta = import('./useField').FieldMeta;
export type UseFieldProps = import('./useField').UseFieldProps;
export type UseFieldOptions = import('./useField').UseFieldOptions;

export type JsonError = import('./utils/errToJSON').JsonError;
export type FieldProps = import('./Field').FieldProps;
export type FieldRenderProps = import('./Field').FieldRenderProps;
export type FieldInjectedProps = import('./Field').FieldInjectedProps;
export type MessageProps = import('./Message').MessageProps;
export type FormProps<
  TSchema extends ObjectSchema,
  TValue = InferType<TSchema>
> = import('./Form').FormProps<TSchema, TValue>;

export interface Statics {
  Field: typeof Field;
  FieldArray: typeof FieldArray;
  Message: typeof Message;
  Summary: typeof Summary;
  Submit: typeof Submit;
  setDefaults: (defaults: any) => void;
  toErrors: (err: ValidationError) => ReturnType<typeof errToJSON>;
  ValidateStrategies: typeof ValidateStrategies;
  getter: typeof getter;
  setter: typeof setter;
}

const statics: Statics = {
  Field,
  FieldArray,
  Message,
  Summary,
  Submit,
  getter,
  setter,
  ValidateStrategies,
  setDefaults(defaults = {}) {
    Object.assign(config, defaults);
  },
  toErrors(err: ValidationError) {
    invariant(
      err && err.name === 'ValidationError',
      '`toErrors()` only works with ValidationErrors.',
    );
    return errToJSON(err);
  },
};

export {
  statics,
  NestedForm,
  useField,
  useMergedEventHandlers,
  useFieldArray,
  useFormSubmit,
  useFormValues,
  useErrors,
  useTouched,
  ValidateStrategies,
};

export type ReactFormal = typeof FormComponent &
  Statics & {
    statics: Statics;
  };

export default Object.assign(FormComponent, statics, {
  statics,
}) as ReactFormal;
