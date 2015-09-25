'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactElement = require('react');

if (process.env.NODE_ENV !== 'production') ReactElement = require('react/lib/ReactElement');

module.exports = function getChildren(children, context) {
  var test = arguments[2] === undefined ? function () {
    return true;
  } : arguments[2];

  if (!/^0\.14/.test(React.version) && process.env.NODE_ENV !== 'production') {
    // this is to avoid the warning but its hacky so lets do it a less hacky way in production
    return attachChildren(children, context, test);
  } else return children;
};

/*
 * “Do not be afraid; our fate Cannot be taken from us; it is a gift.”
 * ― Dante Alighieri, Inferno
 */
function attachChildren(children, context, test) {

  if (typeof children === 'string' || React.isValidElement(children)) return clone(children);

  return React.Children.map(children, clone);

  function clone(child) {
    if (!React.isValidElement(child)) return child;

    var props = child.props;

    if (props.children) props = _extends({}, child.props, { children: attachChildren(props.children, context, test) });

    return new ReactElement(child.type, child.key, child.ref, child._owner, test(child.type) ? _extends({}, child._context, context) : child._context, props);
  }
}