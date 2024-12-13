import { useCallback, useMemo } from 'react';
import { useFormActions, useFormSubmits } from './Contexts.js';

export default function useFormReset() {
  const actions = useFormActions();
  const { resets } = useFormSubmits();
  const handleReset = useCallback(() => {
    if (!actions) {
      if (process.env.NODE_ENV !== 'production')
        return console.error(
          'A Form submit event ' +
            'was triggered from a component outside the context of a Form. ' +
            'The Button should be wrapped in a Form component',
        );
    }
    actions.onReset();
  }, [actions]);

  return [handleReset, useMemo(() => ({ resets }), [resets])] as const;
}
