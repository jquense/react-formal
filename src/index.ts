import { AnyObjectSchema, InferType, ValidationError } from 'yup';
import Field, { useMergedEventHandlers } from './Field.js';
import FieldArray from './FieldArray.js';
import FormComponent, { getter, setter } from './Form.js';
import Submit from './Submit.js';
import Message from './Message.js';
import NestedForm from './NestedForm.js';
import Summary from './Summary.js';
import config from './config.js';
import useField, { ValidateStrategies, splitFieldProps } from './useField.js';
import useFormValues from './useFormValues.js';
import useForm from './useForm.js';
import useFieldArray from './useFieldArray.js';
import errToJSON from './utils/errToJSON.js';
import useFormSubmit from './useFormSubmit.js';
import useErrors from './useErrors.js';
import useTouched from './useTouched.js';
import Reset from './Reset.js';
import useFormReset from './useFormReset.js';

export type FieldArrayHelpers = import('./useFieldArray.js').FieldArrayHelpers;
export type FieldArrayMeta = import('./useFieldArray.js').FieldArrayMeta;
export type UseFieldArrayOptions =
  import('./useFieldArray.js').UseFieldArrayOptions;

export type FieldMeta = import('./useField.js').FieldMeta;
export type UseFieldProps = import('./useField.js').UseFieldProps;
export type UseFieldOptions = import('./useField.js').UseFieldOptions;

export type JsonError = import('./utils/errToJSON.js').JsonError;
export type FieldProps = import('./Field.js').FieldProps;
export type FieldRenderProps = import('./Field.js').FieldRenderProps;
export type FieldInjectedProps = import('./Field.js').FieldInjectedProps;
export type MessageProps = import('./Message.js').MessageProps;
export type FormProps<
  TSchema extends AnyObjectSchema,
  TValue = InferType<TSchema>,
> = import('./Form.js').FormProps<TSchema, TValue>;

export interface FormStatics {
  Field: typeof Field;
  FieldArray: typeof FieldArray;
  Message: typeof Message;
  Submit: typeof Submit;
  Reset: typeof Reset;
  Summary: typeof Summary;
}

const setDefaults = (defaults = {}) => {
  Object.assign(config, defaults);
};

const toFormErrors = (err: ValidationError) => {
  if (!err || err.name !== 'ValidationError')
    throw new Error('`toErrors()` only works with ValidationErrors.');

  return errToJSON(err);
};

const Form = Object.assign(FormComponent, {
  Field,
  FieldArray,
  Message,
  Submit,
  Reset,
  Summary,
});

export {
  Form,
  Field,
  FieldArray,
  Message,
  Submit,
  Reset,
  Summary,
  NestedForm,
  useField,
  useMergedEventHandlers,
  useFieldArray,
  useFormSubmit,
  useFormReset,
  useFormValues,
  useForm,
  useErrors,
  useTouched,
  splitFieldProps,
  ValidateStrategies,
  setDefaults,
  toFormErrors,
  getter,
  setter,
};
