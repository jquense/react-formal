import { useCallback, useMemo } from 'react'
import useCommittedRef from '@restart/hooks/useCommittedRef'
import { toArray } from './paths'

export function notify<T extends (...args: any) => any>(
  handler: T | undefined,
  args: Parameters<T>,
) {
  // FIXME: seems to be a babel bug here...
  // eslint-disable-next-line prefer-spread
  if (handler) handler.apply(null, args)
}

export default function useEventHandlers(
  maybeEvents: string[] | string | null,
  handleEvent: (event: string, args: any[]) => any,
) {
  const events = toArray(maybeEvents)
  const eventMap = useMemo(() => ({}), [handleEvent])

  return useMemo(() => {
    const result: Record<string, (...args: any[]) => any> = {}
    if (events) {
      // eslint-disable-next-line no-extra-semi
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

export function useMergedHandlers(
  events: string | string[] | null,
  props: {},
  fieldProps: {},
) {
  const propsRef = useCommittedRef(props)
  const fieldRef = useCommittedRef(fieldProps)

  return useEventHandlers(
    events && toArray(events),
    useCallback(
      (event, args) => {
        notify(propsRef.current[event], args)
        notify(fieldRef.current[event], args)
      },
      [propsRef, fieldRef],
    ),
  )
}
