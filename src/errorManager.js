import Promise from 'universal-promise';

import errToJSON from './util/errToJSON';
import pathUtils from './util/paths';

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
    collect(paths, errors = {}, options) {
      paths = pathUtils.reduce([].concat(paths))

      let validations = Array(paths.length)
      let workDone = false
      let newErrors = errors

      paths.forEach((path, index) => {
        newErrors = pathUtils.trim(path, newErrors)
        if (!workDone && errors !== newErrors) {
          workDone = true;

          newErrors = { ...newErrors }
        }

        validations[index] = validatePath(path, options, newErrors)
      })

      return Promise.all(validations)
        .then(results => {
          if (!workDone && results.every(Boolean))
            return errors

          return newErrors
        })
    }
  }
}
