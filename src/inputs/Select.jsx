'use strict';
var React = require('react');

let childAt = (children, idx) => {
  var child;
  if (children.lengh !== undefined ) child = children[idx]
  else React.Children.forEach(children, (c, i) => !child && i === idx && (child = c))
  return child
}

class Select extends React.Component {

  render() {
    var { children, ...props } = this.props;

    return (
      <select {...props} onChange={e => this.change(e)}>
        { children }
      </select>
    );
  }

  change(e){
    var children = this.props.children
      , values = [];

    if (!this.props.multiple)
      return this.props.onChange(childAt(children, e.target.selectedIndex).props.value)

    ; [].forEach.call(e.target.options, 
        (option, i) => option.selected && values.push(childAt(children, i).props.value))

    this.props.onChange(values)
  }
}

module.exports = Select;