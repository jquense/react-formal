import { useMemo } from 'react';
import { type AnySchema } from 'yup';
import { useBindingContext } from './BindingContext.js';

function useFieldSchema(path: string | undefined) {
  const { getSchemaForPath } = useBindingContext();

  return useMemo<AnySchema | undefined>(() => {
    if (!path) return;

    try {
      return getSchemaForPath(path);
    } catch (err) {
      /* ignore */
    }
  }, [getSchemaForPath, path]);
}

export default useFieldSchema;
