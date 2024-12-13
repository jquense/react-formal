import React, { createContext, useContext } from 'react';
import { Errors } from './types.js';
import { EMPTY_ERRORS } from './Errors.js';
import { ValidationPaths } from './errorManager.js';

export interface FormActions {
  yupContext: any;
  onSubmit: () => void;
  onReset: () => void;
  onValidate: (fields: ValidationPaths, event: string, args: any[]) => void;
  onFieldError: (name: string, errors: Errors) => void;
  formHasValidation: () => boolean;
}

export interface FormContextValue {
  touched: Record<string, boolean>;
  errors: Errors;
  actions: FormActions;

  submits: {
    submitCount: number;
    submitAttempts: number;
    submitting: boolean;
    resets: number;
  };
}

const FormActionContext = createContext<FormActions>(null as any);
const FormTouchedContext = createContext<FormContextValue['touched']>({});
const FormErrorContext = createContext<Errors>(EMPTY_ERRORS);
const FormSubmitContext = createContext<FormContextValue['submits']>({
  submitCount: 0,
  submitAttempts: 0,
  submitting: false,
  resets: 0,
});

export function FormProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: FormContextValue;
}) {
  return (
    <FormActionContext.Provider value={value.actions}>
      <FormErrorContext.Provider value={value.errors}>
        <FormTouchedContext.Provider value={value.touched}>
          <FormSubmitContext.Provider value={value.submits}>
            {children}
          </FormSubmitContext.Provider>
        </FormTouchedContext.Provider>
      </FormErrorContext.Provider>
    </FormActionContext.Provider>
  );
}

export const useFormActions = () => useContext(FormActionContext);
export const useFormTouched = () => useContext(FormTouchedContext);
export const useFormErrors = () => useContext(FormErrorContext);
export const useFormSubmits = () => useContext(FormSubmitContext);
