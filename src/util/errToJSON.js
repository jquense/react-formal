
export default function errToJSON(error){
  if (error.inner.length)
    return error.inner.reduce((list, inner) => {
      list[inner.path] = (list[inner.path] || []).concat(errToJSON(inner))

      return list
    }, {})

  return {
    message: error.message,
    values: error.params,
    type: error.type
  }
}
