import { useContext, useCallback, useMemo } from 'react';
import warning from 'warning';
import {
  FormActionsContext,
  FormSubmitsContext,
  FormErrorContext,
} from './Contexts';
import memoize from 'memoize-one';
import { filterAndMapErrors } from './utils/ErrorUtils';

export interface UseFormSubmitOptions {
  triggers?: string[];
}

export function useFormSubmit({ triggers }: UseFormSubmitOptions) {
  const actions = useContext(FormActionsContext);
  const submits = useContext(FormSubmitsContext);
  let errors = useContext(FormErrorContext);
  debugger;
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
    [actions, triggers && triggers.join(',')],
  );

  const memoFilterAndMapErrors = useMemo(
    () =>
      memoize(
        filterAndMapErrors,
        ([a], [b]) =>
          a.errors === b.errors &&
          a.names === b.names &&
          a.maperrors === b.maperrors,
      ),
    [],
  );

  const partial = triggers && triggers.length;
  if (partial) errors = memoFilterAndMapErrors({ errors, names: triggers! });

  return [
    handleSubmit,
    useMemo(() => ({ errors, ...submits }), [errors, submits]),
  ] as const;
}
