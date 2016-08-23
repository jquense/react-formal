import React from 'react';
import Input from './Input';

let pad = n => n < 10 ? ('0' + n) : n

let isValid = date => date && !isNaN(date.getTime())

let toLocal = date => {
  if (!date) return null

  date = new Date(date)
  return new Date(
    date.getTime() + (date.getTimezoneOffset() * 60000)
  )
}

let parse = (date, org, part) => toLocal(
  part === 'time'
    ? (toDateString(org || new Date(), 'date') + 'T' + date)
    : date
)

let localISOString = date =>
      date.getFullYear()       + '-'
    + pad(date.getMonth() + 1) + '-'
    + pad(date.getDate())      + 'T'
    + pad(date.getHours())     + ':'
    + pad(date.getMinutes())   + ':'
    + pad(date.getSeconds())   + '.000';

let toDateString = (date, part) => {
  if (!isValid(date)) return ''
  date = localISOString(date)
  if (part === 'date') date = date.substr(0, 10)
  if (part === 'time') date = date.substr(11)
  return date
}

class DateInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.instanceOf(Date),
    onChange: React.PropTypes.func,
    type: React.PropTypes.string,
  }

  render() {
    var {
        value
      , type = 'date'
      , ...props } = this.props

    return (
      <Input
        {...props}
        type={type}
        value={toDateString(value, type)}
        onChange={stringValue => props.onChange(
          parse(stringValue, value, type)
        )}
      />
    );
  }
}


export default DateInput;
