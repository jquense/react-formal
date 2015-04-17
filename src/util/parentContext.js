var React = require('react')
var ReactElement = require('react')

if ( process.env.NODE_ENV !== 'production' )
  ReactElement = require('react/lib/ReactElement')

module.exports = function getChildren(children, context, test = ()=> true) {
  
  if ( process.env.NODE_ENV !== 'production' ){
    // this is to avoid the warning but its hacky so lets do it a less hacky way in production
    return attachChildren(children, context, test)
  }
  else
    return children
}
 
/*
 * “Do not be afraid; our fate Cannot be taken from us; it is a gift.” 
 * ― Dante Alighieri, Inferno
 */
function attachChildren(children, context, test) {

  if ( typeof children === 'string' || React.isValidElement(children))
    return clone(children)

  return React.Children.map(children, clone)

  function clone (child) {
    var props = child.props

    if ( !React.isValidElement(child) )
      return child;

    if ( props.children )
      props = { ...child.props, children: attachChildren(props.children, context, test) }

    return new ReactElement(
      child.type,
      child.key,
      child.ref,
      child._owner,
      test(child.type) 
        ? { ...child._context, ...context }
        : child._context,
      props
    )
  }
}