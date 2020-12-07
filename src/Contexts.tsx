import React from 'react';
import type { AnySchema } from 'yup';
import { Errors } from './types';
import { EMPTY_ERRORS } from './Errors';
import { ValidationPathSpec } from './errorManager';

export const DEFAULT_CHANNEL = '@@parent';

export interface FormActions {
  getSchemaForPath: (name?: string) => AnySchema | undefined;
  yupContext: any;
  onSubmit: () => void;
  onValidate: (
    fields: Array<ValidationPathSpec | string>,
    event: string,
    args: any[],
  ) => void;
  onFieldError: (name: string, errors: Errors) => void;
  formHasValidation: () => boolean;
}

export const FormActionsContext = React.createContext<FormActions | null>(null);

export const FormErrorContext = React.createContext(EMPTY_ERRORS);

export const FormTouchedContext = React.createContext<Record<string, boolean>>(
  {},
);

export const FormSubmitsContext = React.createContext({
  submitCount: 0,
  submitAttempts: 0,
  submitting: false,
});
