import React from 'react';

class Input extends React.Component {
  static propTypes = {
    value: React.PropTypes.any,
    onChange: React.PropTypes.func,
    tagName: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]),
  };
  render() {
    let {
        tagName: Tag = 'input'
      , value
      , ...props } = this.props

    delete props.meta;

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
