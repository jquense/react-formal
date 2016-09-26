import React from 'react';

import isNativeType from '../util/isNativeType';

class Input extends React.Component {
  static propTypes = {
    value: React.PropTypes.any,
    onChange: React.PropTypes.func,
    type: React.PropTypes.any,
    tagName: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]),
  };
  render() {
    let {
        tagName: Tag = 'input'
      , value
      , type
      , ...props } = this.props

    delete props.errors;
    delete props.invalid;

    if (value === null)
      value = '';

    return (
      <Tag
        {...props}
        value={value}
        type={isNativeType(type) ? type : undefined}
        onChange={ e => props.onChange(e.target.value)}
      />
    );
  }
}

export default Input;
