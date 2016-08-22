import React from 'react';


class Input extends React.Component {
  render() {
    let {
        tagName: Tag = 'input'
      , value
      , ...props } = this.props

    delete props.errors;
    delete props.invalid;

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
