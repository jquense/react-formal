import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    tagName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
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
        onChange={ e => props.onChange(e.target.value, e)}
      />
    );
  }
}

export default Input;
