'use strict';
var React = require('react');

let isValid = num => typeof num === 'number' && !isNaN(num)

let isAtDelimiter = (num, str) =>{
  var next = str.length <= 1 ? false : parseFloat(str.substr(0, str.length - 1))
  return typeof next === 'number' && !isNaN(next) && next === num
}

class NumberInput extends React.Component {

  state = {}

  componentWillReceiveProps(nextProps) {
    this.setState({ value: ''+ nextProps.value})
  }

  render() {
    var props = this.props
      , value = this.state.value || props.value

    return (
      <input {...props} type='number' value={value} onChange={e => this._change(e)}/>
    )
  }

  _change(e){
    var val = e.target.value
      , current = this.props.value
      , number = parseFloat(val)

    if( val == null || val.trim() === '' || !isValid(number) )
      return this.props.onChange(null)

    if(isValid(number) && number !== current && !isAtDelimiter(number, val))
      return this.props.onChange(number)

    this.setState({ value: val })
  }
}


module.exports = NumberInput;