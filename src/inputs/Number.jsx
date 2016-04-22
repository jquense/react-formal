import React from 'react';
import Input from './Input';

let isValid = num => typeof num === 'number' && !isNaN(num)

let isAtDelimiter = (num, str) =>{
  var next = str.length <= 1 ? false : parseFloat(str.substr(0, str.length - 1))
  return typeof next === 'number' && !isNaN(next) && next === num
}

class NumberInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.number
  }

  state = {}

  componentWillReceiveProps(nextProps) {
    let value = nextProps.value;

    value = (value == null || isNaN(value))
      ? '' : '' + value

    this.setState({ value })
  }

  render() {
    var { value, ...props } = this.props

    value = this.state.value || value

    return (
      <Input {...props}
        type='number'
        value={value}
        onChange={e => this._change(e)}
      />
    )
  }

  _change(value) {
    var current = this.props.value
      , number = parseFloat(value)

    if (value == null || value.trim() === '' || !isValid(number) )
      return this.props.onChange(null)

    if (isValid(number) && number !== current && !isAtDelimiter(number, value))
      return this.props.onChange(number)

    this.setState({ value })
  }
}


module.exports = NumberInput;
