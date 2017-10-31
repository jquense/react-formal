
export default function errToJSON(error, target = {}) {
  if (error.inner.length) {
    error.inner.forEach(inner => {
      errToJSON(inner, target, inner.path)
    })

    return target;
  }

  let path = error.path || ''
  let existing = target[path]

  let json = {
    message: error.message,
    values: error.params,
    type: error.type
  }

  target[path] = existing
    ? [...existing, json]
    : [json];

  return target
}
