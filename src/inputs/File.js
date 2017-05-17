import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

class FileInput extends React.Component {
  static propTypes = {
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
  }

  handleChange = (_, { target: { files } }) => {
    const { multiple, onChange } = this.props;

    if (onChange)
      onChange(multiple ? files : files[0])
  }

  render() {
    const props = { ...this.props };
    delete props.value;

    return (
      <Input
        {...props}
        type="file"
        onChange={this.handleChange}
      />
    )
  }
}

export default FileInput;
