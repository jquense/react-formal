import React from 'react';
import Input from './Input';

class BoolInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.bool
  }

  render() {
    let { value, ...props } = this.props

    return (
      <Input
        {...props}
        type={'checkbox'}
        checked={!!value}
        onChange={() => props.onChange(!value)}
      />
    );
  }
}

module.exports = BoolInput;
