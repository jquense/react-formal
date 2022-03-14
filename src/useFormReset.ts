import { useCallback, useMemo } from 'react';
import { BITS, useFormContext } from './Contexts';

export default function useFormReset() {
  const { actions, resets } = useFormContext(BITS.actions | BITS.resets);
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
