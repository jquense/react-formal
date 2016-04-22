import React from 'react';
import Input from './Input';

let pad = n => n < 10 ? ('0' + n) : n

let isValid = date => date && !isNaN(date.getTime())

let toLocal = date => new Date((date = new Date(date)).getTime() + (date.getTimezoneOffset() * 60000))

let parse = (date, org, type) =>
  toLocal(type === 'time' ? (toDateString(org || new Date(), 'date') + 'T' + date) : date)

let localISOString = date =>
      date.getFullYear()       + '-'
    + pad(date.getMonth() + 1) + '-'
    + pad(date.getDate())      + 'T'
    + pad(date.getHours())     + ':'
    + pad(date.getMinutes())   + ':'
    + pad(date.getSeconds())   + '.000';

let toDateString = (date, type) => {
  if ( !isValid(date) ) return null
  date = localISOString(date)
  if( type === 'date') date = date.substr(0, 10)
  if( type === 'time') date = date.substr(11)
  return date
}

class DateInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.instanceOf(Date)
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
        onChange={e => props.onChange(parse(e.target.value, value, type))}
      />
    );
  }
}


module.exports = DateInput;
