import React from 'react'
import PropTypes from 'prop-types'
import Input from './Input'

let isValid = num => typeof num === 'number' && !isNaN(num)

class NumberInput extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
  }

  handleChange = (value, e) => {
    let current = this.props.value
    let number = e.target.valueAsNumber

    if (!isValid(number)) return this.props.onChange(null)
    if (number !== current) return this.props.onChange(number)
  }
  render() {
    let { value, ...props } = this.props

    return (
      <Input
        {...props}
        type="number"
        value={value}
        onChange={this.handleChange}
      />
    )
  }
}

export default NumberInput
