import { useMemo } from 'react';
import { useBindingContext } from './BindingContext';
import { type AnySchema } from 'yup';

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
