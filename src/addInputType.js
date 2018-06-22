import { types } from './utils/resolveFieldComponent'

let addType = (type, Component) => {
  let compType = typeof Component

  if (typeof type !== 'string')
    throw new TypeError('the `type` parameter must be a string')

  if (compType !== 'string' && compType !== 'function')
    throw new TypeError(
      'The `Component` parameter must be a valid React Component class or tag name'
    )

  types[type.toLowerCase()] = Component
}

export default function(...args) {
  if (args.length === 2) return addType(...args)

  Object.keys(args[0]).forEach(key => addType(key, args[0][key]))
}
