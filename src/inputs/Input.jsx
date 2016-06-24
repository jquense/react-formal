'use strict';
var React = require('react');

class Input extends React.Component {
  render() {
    let {
        tagName: Tag = 'input'
      , value
      , ...props } = this.props

    if (value === null)
      value = '';

    return (
      <Tag
        {...props}
        value={value}
        onChange={ e => props.onChange(e.target.value)}
      />
    );
  }
}

export default Input;
