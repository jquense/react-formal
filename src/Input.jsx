'use strict';
var React = require('react');

var Input = React.createClass({

  render: function() {
    return (
      <input {...this.props} onChange={ e => this.props.onChange && this.props.onChange.call(this, e.target.value) }/>
    );
  }

});

module.exports = Input;