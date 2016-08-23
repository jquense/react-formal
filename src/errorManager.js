import Promise from 'universal-promise';

import errToJSON from './util/errToJSON';
import { reduce, trim } from './util/paths';

let isValidationError = err => err && err.name === 'ValidationError';


export default function errorManager(handleValidation) {
  function validatePath(name, context, errors) {
    return Promise.resolve(
        handleValidation(name, context)
      )
      .then(validationError => {
        if (!validationError)
          return true;

        if (!isValidationError(validationError))
          throw validationError

        errToJSON(validationError, errors)
      })
  }

  return {
    collect(paths, pristineErrors = {}, options) {
      paths = reduce([].concat(paths))

      let errors = { ...pristineErrors }
      let nextErrors = errors
      let workDone = false

      let validations = paths.map(path => {
        nextErrors = trim(path, nextErrors)

        if (errors !== nextErrors) {
          workDone = true;
        }

        return validatePath(path, options, nextErrors)
      })

      return Promise.all(validations)
        .then(results => {
          if (!workDone && results.every(Boolean))
            return pristineErrors

          return nextErrors
        })
    }
  }
}
