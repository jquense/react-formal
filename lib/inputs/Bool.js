'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var React = require('react');

var BoolInput = (function (_React$Component) {
  function BoolInput() {
    babelHelpers.classCallCheck(this, BoolInput);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(BoolInput, _React$Component);

  BoolInput.prototype.render = function render() {
    var props = this.props;

    return React.createElement('input', babelHelpers._extends({}, props, { type: 'checkbox',
      checked: props.value,
      onChange: function (e) {
        return props.onChange(e.target.checked);
      }
    }));
  };

  return BoolInput;
})(React.Component);

module.exports = BoolInput;