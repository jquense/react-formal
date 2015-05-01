'use strict';
var React = require('react');

class Input extends React.Component {
  render() {
    var { 
        tagName: Tag = 'input'
      , ...props } = this.props

    return (
      <Tag {...props} onChange={ e => props.onChange(e.target.value)}/>
    );
  }
}

module.exports = Input;