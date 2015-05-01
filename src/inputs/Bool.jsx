'use strict';
var React = require('react');

class BoolInput extends React.Component {
  render() {
    var props = this.props

    return (
      <input {...props} type={'checkbox'} 
        checked={props.value}
        onChange={e => props.onChange(e.target.checked)}
      />
    );
  }
}

module.exports = BoolInput;