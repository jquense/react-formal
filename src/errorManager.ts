import { EMPTY_ERRORS } from './Errors.js';
import errToJSON from './utils/errToJSON.js';
import { trim, inPath } from './utils/paths.js';
import { ValidationError } from 'yup';
import { Errors } from './types.js';
import { uniqBy } from './utils/uniqBy.js';

export interface ValidationPathSpec {
  path: string;
  shallow: boolean;
}

export type ValidationPaths = Array<ValidationPathSpec | string>;

function trimChildren(rootPath: string, errors: Record<string, any>) {
  let result: Record<string, any> = {};
  Object.keys(errors).forEach((path) => {
    if (rootPath !== path && inPath(rootPath, path)) return;
    result[path] = errors[path];
  });

  return result;
}

function reduce(paths: ValidationPathSpec[]) {
  paths = uniqBy(paths, (p) => p.path);

  if (paths.length <= 1) return paths;

  return paths.reduce<ValidationPathSpec[]>((innerPaths, current) => {
    innerPaths = innerPaths.filter((p) => !inPath(current.path, p.path));

    if (!innerPaths.some((p) => inPath(p.path, current.path)))
      innerPaths.push(current);

    return innerPaths;
  }, []);
}

export let isValidationError = (err: any): err is ValidationError =>
  err && err.name === 'ValidationError';

export default function errorManager<TOptions>(
  handleValidation: (
    path: ValidationPathSpec,
    opts?: TOptions,
  ) => Error | void | Promise<Error | void>,
) {
  return {
    async collect(
      paths: ValidationPaths,
      pristineErrors = EMPTY_ERRORS,
      options?: TOptions,
    ): Promise<Errors> {
      const specs = reduce(
        paths.map((p) =>
          typeof p === 'string' ? { path: p, shallow: false } : p,
        ),
      );

      let errors = { ...pristineErrors };
      let nextErrors = errors;
      let workDone = false;

      specs.forEach(({ path, shallow }) => {
        nextErrors = trim(path, nextErrors, shallow);
        if (errors !== nextErrors) workDone = true;
      });

      let validations = specs.map((spec) =>
        Promise.resolve(handleValidation(spec, options)).then(
          (validationError) => {
            if (!validationError) return true;

            if (!isValidationError(validationError)) throw validationError;

            if (!spec.shallow) {
              errToJSON(validationError, nextErrors);
              return;
            }

            const fieldErrors = errToJSON(validationError);
            Object.assign(nextErrors, trimChildren(spec.path, fieldErrors));
          },
        ),
      );

      const results = await Promise.all(validations);
      if (!workDone && results.every(Boolean)) return pristineErrors;
      return nextErrors;
    },
  };
}
