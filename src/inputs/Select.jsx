import React from 'react';
import { findDOMNode } from 'react-dom';
import Input from './Input';

let childAt = (children, idx) => {
  var child;
  if (children.length !== undefined )
    child = children[idx]
  else
    React.Children.forEach(children, (c, i) => !child && i === idx && (child = c))
  return child
}

class Select extends React.Component {

  render() {
    var { children, tagName = 'select', ...props } = this.props;

    return (
      <Input
        {...props}
        tagName={tagName}
        onChange={() => this.change()}
      >
        { children }
      </Input>
    );
  }

  change() {
    var node = findDOMNode(this)
      , { onChange, children } = this.props
      , values = [];

    if (!this.props.multiple)
      return this.props.onChange(childAt(children, node.selectedIndex).props.value)

    ; [].forEach.call(node.options,
        (option, i) => option.selected && values.push(childAt(children, i).props.value))

    onChange(values)
  }
}

module.exports = Select;
