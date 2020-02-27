import { EMPTY_ERRORS } from './utils/ErrorUtils';
import errToJSON from './utils/errToJSON';
import { reduce, trim, toArray } from './utils/paths';
import { ValidationError } from 'yup';
import { Errors } from './types';

export let isValidationError = (err: any): err is ValidationError =>
  err && err.name === 'ValidationError';

export default function errorManager<TOptions>(
  handleValidation: (
    path: string,
    opts?: TOptions,
  ) => Error | void | Promise<Error | void>,
) {
  return {
    collect(
      paths: string | string[],
      pristineErrors = EMPTY_ERRORS,
      options: TOptions,
    ): Promise<Errors> {
      paths = reduce(toArray(paths));

      let errors = { ...pristineErrors };
      let nextErrors = errors;
      let workDone = false;

      paths.forEach(path => {
        nextErrors = trim(path, nextErrors);
        if (errors !== nextErrors) workDone = true;
      });

      let validations = paths.map(path =>
        Promise.resolve(handleValidation(path, options)).then(
          validationError => {
            if (!validationError) return true;

            if (!isValidationError(validationError)) throw validationError;

            errToJSON(validationError, nextErrors);
          },
        ),
      );

      return Promise.all(validations).then(results => {
        if (!workDone && results.every(Boolean)) return pristineErrors;

        return nextErrors;
      });
    },
  };
}
