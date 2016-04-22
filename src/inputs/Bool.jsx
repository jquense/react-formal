import React from 'react';
import Input from './Input';

class BoolInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.bool
  }
  
  render() {
    var props = this.props

    return (
      <Input
        {...props}
        type={'checkbox'}
        checked={!!props.value}
        onChange={() => props.onChange(!props.value)}
      />
    );
  }
}

module.exports = BoolInput;
