import errToJSON from './utils/errToJSON'
import { reduce, trim } from './utils/paths'

let isValidationError = err => err && err.name === 'ValidationError'

export default function errorManager(handleValidation) {
  return {
    collect(paths, pristineErrors = {}, options) {
      paths = reduce([].concat(paths))

      let errors = { ...pristineErrors }
      let nextErrors = errors
      let workDone = false

      paths.forEach(path => {
        nextErrors = trim(path, nextErrors)
        if (errors !== nextErrors) workDone = true
      })

      let validations = paths.map(path =>
        Promise.resolve(handleValidation(path, options)).then(
          validationError => {
            if (!validationError) return true

            if (!isValidationError(validationError)) throw validationError

            errToJSON(validationError, nextErrors)
          }
        )
      )

      return Promise.all(validations).then(results => {
        if (!workDone && results.every(Boolean)) return pristineErrors

        return nextErrors
      })
    },
  }
}
