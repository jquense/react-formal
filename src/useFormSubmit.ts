import { useCallback, useMemo } from 'react';
import { useFormActions, useFormSubmits } from './Contexts.js';
import useErrors from './useErrors.js';

export interface UseFormSubmitOptions {
  triggers?: string[];
}

/**
 *
 * @param options
 * @param {string[]} options.trigger A set of paths to trigger validation for
 */
export default function useFormSubmit({ triggers }: UseFormSubmitOptions = {}) {
  const actions = useFormActions();
  const submits = useFormSubmits();

  const errors = useErrors(triggers);

  const handleSubmit = useCallback(
    (...args: any[]) => {
      if (!actions) {
        if (process.env.NODE_ENV !== 'production')
          return console.error(
            'A Form submit event ' +
              'was triggered from a component outside the context of a Form. ' +
              'The Button should be wrapped in a Form component',
          );
      }

      if (triggers && triggers.length) {
        actions.onValidate(triggers, 'submit', args);
      } else actions.onSubmit();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actions, triggers && triggers.join(',')],
  );

  return [
    handleSubmit,
    useMemo(() => ({ errors, ...submits }), [errors, submits]),
  ] as const;
}
