import React from 'react';
import Input from './Input';

class BooleanInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.bool,
    onChange: React.PropTypes.func,
  }

  render() {
    let { value, ...props } = this.props

    return (
      <Input
        {...props}
        type="checkbox"
        checked={!!value}
        onChange={() => props.onChange(!value)}
      />
    );
  }
}

export default BooleanInput;
