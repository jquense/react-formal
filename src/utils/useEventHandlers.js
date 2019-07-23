import { useCallback, useMemo } from 'react'
import useCommittedRef from '@restart/hooks/useCommittedRef'

export function notify(handler, args) {
  // FIXME: seems to be a babel bug here...
  if (handler) handler.apply(null, args)
}

export default function useEventHandlers(events, handleEvent) {
  const eventMap = useMemo(() => ({}), [handleEvent])

  events = events && [].concat(events)

  return useMemo(() => {
    const result = {}
    if (events) {
      events.forEach(event => {
        eventMap[event] = result[event] =
          eventMap[event] ||
          ((...args) => {
            // console.log(event, args)
            handleEvent(event, args)
          })
      })
    }
    return result
  }, [events && events.join(','), eventMap])
}

export function useMergedHandlers(events, props, fieldProps) {
  const propsRef = useCommittedRef(props)
  const fieldRef = useCommittedRef(fieldProps)

  return useEventHandlers(
    events,
    useCallback(
      (event, args) => {
        notify(propsRef.current[event], args)
        notify(fieldRef.current[event], args)
      },
      [propsRef, fieldRef]
    )
  )
}
