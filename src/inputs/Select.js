import React from 'react';
import { findDOMNode } from 'react-dom';
import Input from './Input';

let toArray = React.Children.toArray || function (children) {
  let result = [];
  React.Children.map(children, c => result.push(c))
  return result;
}


class Select extends React.Component {
  static propTypes = {
    value: React.PropTypes.any,
    multiple: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    tagName: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]),
  }

  handleChange = () => {
    let { onChange, children } = this.props;
    let node = findDOMNode(this)

    children = toArray(children);

    if (!this.props.multiple) {
      let selected = children[node.selectedIndex];
      return this.props.onChange(selected.props.value)
    }

    let values = [];

    [].forEach.call(node.options, (option, i) => {
      if (option.selected) {
        let selected = children[i];
        values.push(selected.props.value)
      }
    })

    onChange(values)
  }

  render() {
    let { value, children, tagName = 'select', ...props } = this.props;

    if (value === null)
      value = props.multiple ? [] : '';

    return (
      <Input
        {...props}
        tagName={tagName}
        value={value}
        onChange={this.handleChange}
      >
        { children }
      </Input>
    );
  }

}

export default Select;
