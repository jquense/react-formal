import { useContext, useCallback, useMemo } from 'react';
import warning from 'warning';
import { FormActionsContext, FormSubmitsContext } from './Contexts';
import useErrors from './useErrors';

export interface UseFormSubmitOptions {
  triggers?: string[];
}

/**
 *
 * @param options
 * @param {string[]} options.trigger A set of paths to trigger validation for
 */
export function useFormSubmit({ triggers }: UseFormSubmitOptions = {}) {
  const actions = useContext(FormActionsContext);
  const submits = useContext(FormSubmitsContext);
  const errors = useErrors(triggers);

  const handleSubmit = useCallback(
    (...args: any[]) => {
      if (!actions) {
        return warning(
          false,
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
