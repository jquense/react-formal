'use strict';
var React = require('react');

var Input = props => ({
  props,
  render() {
    return (
      <input {...this.props} 
        onChange={ e => this.props.onChange(e.target.value)}
      />
    );
  }
});

module.exports = Input;