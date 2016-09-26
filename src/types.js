import config from './config';

function addType(type, Component) {
  let compType = typeof Component;

  if (typeof type !== 'string')
    throw new TypeError('the `type` parameter must be a string')

  if (compType !== 'string' && compType !== 'function')
    throw new TypeError('The `Component` parameter must be a valid React Component class or tag name')

  config.types[type] = Component
}

export default function addTypes(...args) {
  let types = args[0];

  if (args.length === 2)
    return addType(...args)

  Object.keys(types).forEach(key => {
    addType(key, types[key])
  })
}
