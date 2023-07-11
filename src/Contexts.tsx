import React from 'react';
import { Errors } from './types';
import { EMPTY_ERRORS } from './Errors';
import { ValidationPathSpec } from './errorManager';

export interface FormActions {
  yupContext: any;
  onSubmit: () => void;
  onReset: () => void;
  onValidate: (
    fields: Array<ValidationPathSpec | string>,
    event: string,
    args: any[],
  ) => void;
  onFieldError: (name: string, errors: Errors) => void;
  formHasValidation: () => boolean;
}

export const BITS = {
  errors: 1 << 1, // =2
  touched: 1 << 2, // =4
  actions: 1 << 3, // =8
  submits: 1 << 4, // =16
  resets: 1 << 5, // =32
};

export interface FormContextValue {
  touched: Record<string, boolean>;
  errors: Errors;
  actions: FormActions;

  submits: {
    submitCount: number;
    submitAttempts: number;
    submitting: boolean;
  };

  resets: number;
}

export const FormContext = React.createContext<FormContextValue>(
  {
    errors: EMPTY_ERRORS,
    touched: {},
    actions: null as any,
    submits: {
      submitCount: 0,
      submitAttempts: 0,
      submitting: false,
    },
    resets: 0,
  },
  // @ts-ignore
  (a, b) => {
    let bits = 0;
    if (a.errors !== b.errors) bits |= BITS.errors;
    if (a.touched !== b.touched) bits |= BITS.touched;
    if (a.actions !== b.actions) bits |= BITS.actions;
    if (a.submits !== b.submits) bits |= BITS.submits;
    if (a.resets !== b.resets) bits |= BITS.resets;
    return bits;
  },
);

// ref: https://github.com/dai-shi/react-hooks-global-state/issues/5
export const useFormContext = (observedBits: number) => {
  const { ReactCurrentDispatcher } =
    // @ts-ignore
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  const dispatcher = ReactCurrentDispatcher.current;
  if (!dispatcher) {
    throw new Error(
      'Hooks can only be called inside the body of a function component. (https://fb.me/react-invalid-hook-call)',
    );
  }
  return dispatcher.useContext(FormContext, observedBits) as FormContextValue;
};
