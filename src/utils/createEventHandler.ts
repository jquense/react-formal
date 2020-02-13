import memoize from 'memoize-one'

type EventHandlers = Record<string, (...args: any[]) => any>

// create a set of handlers with a stable identity so as not to
// thwart SCU checks
export default function createEventHandler(getHandler) {
  let getter = memoize(getHandler)
  let handlers: EventHandlers = {}

  return events => {
    const newHandlers: EventHandlers = {}
    if (events) {
      for (let event of [].concat(events))
        newHandlers[event] = handlers[event] || getter(event)
    }
    return (handlers = newHandlers)
  }
}
