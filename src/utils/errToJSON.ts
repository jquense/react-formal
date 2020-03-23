import { ValidationError } from 'yup'

export type JsonError = { values: unknown[]; error: string; message: any }

export default function errToJSON(
  error: ValidationError,
  target = {},
): Record<string, JsonError[]> {
  if (error.inner.length) {
    error.inner.forEach(inner => {
      errToJSON(inner, target)
    })

    return target
  }

  let path = error.path || ''
  let existing = target[path]

  let json = {
    message: error.message,
    values: error.params,
    type: error.type,
  }

  target[path] = existing ? [...existing, json] : [json]

  return target
}
