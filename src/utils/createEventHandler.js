import memoize from 'memoize-one'

// create a set of handlers with a stable identity so as not to
// thwart SCU checks
export default function createEventHandler(getHandler) {
  let getter = memoize(getHandler)
  let handlers = {}

  return events => {
    const newHandlers = {}
    if (events) {
      for (let event of [].concat(events))
        newHandlers[event] = handlers[event] || getter(event)
    }
    return (handlers = newHandlers)
  }
}
