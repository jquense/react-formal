import types from'./util/types';

let addType = (type, Component) => {
  let compType = typeof Component;

  if ( typeof type !== 'string')
    throw new TypeError('the `type` parameter must be a string')

  if ( compType !== 'string' && compType !== 'function' )
    throw new TypeError('The `Component` parameter must be a valid React Component class or tag name')

  types[type] = Component
}

export default function(...args){
  if( args.length === 2)
    return addType(...args)

  for( var key in args[0] ) if ( has(args[0], key))
    addType(key, args[0][key])
}

function has(o, k){
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false
}
