import invariant from 'invariant';
import { AnyObjectSchema, InferType, ValidationError } from 'yup';
import Field, { useMergedEventHandlers } from './Field';
import FieldArray from './FieldArray';
import FormComponent, { getter, setter } from './Form';
import Submit from './Submit';
import Message from './Message';
import NestedForm from './NestedForm';
import Summary from './Summary';
import config from './config';
import useField, { ValidateStrategies, splitFieldProps } from './useField';
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
  TSchema extends AnyObjectSchema,
  TValue = InferType<TSchema>
> = import('./Form').FormProps<TSchema, TValue>;

export interface FormStatics {
  Field: typeof Field;
  FieldArray: typeof FieldArray;
  Message: typeof Message;
  Submit: typeof Submit;
  Summary: typeof Summary;
}

const setDefaults = (defaults = {}) => {
  Object.assign(config, defaults);
};

const toFormErrors = (err: ValidationError) => {
  invariant(
    err && err.name === 'ValidationError',
    '`toErrors()` only works with ValidationErrors.',
  );
  return errToJSON(err);
};

const formStatics: FormStatics = {
  Field,
  FieldArray,
  Message,
  Submit,
  Summary,
};

export {
  formStatics,
  NestedForm,
  useField,
  useMergedEventHandlers,
  useFieldArray,
  useFormSubmit,
  useFormValues,
  useErrors,
  useTouched,
  splitFieldProps,
  ValidateStrategies,
  setDefaults,
  toFormErrors,
  getter,
  setter,
};

export type ReactFormal = typeof FormComponent & FormStatics;

export default Object.assign(FormComponent, formStatics) as ReactFormal;
