import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

class BooleanInput extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
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
