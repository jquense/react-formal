'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var React = require('react');

var isValid = function isValid(num) {
  return typeof num === 'number' && !isNaN(num);
};

var isAtDelimiter = function isAtDelimiter(num, str) {
  var next = str.length <= 1 ? false : parseFloat(str.substr(0, str.length - 1));
  return typeof next === 'number' && !isNaN(next) && next === num;
};

var NumberInput = (function (_React$Component) {
  function NumberInput() {
    babelHelpers.classCallCheck(this, NumberInput);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }

    this.state = {};
  }

  babelHelpers.inherits(NumberInput, _React$Component);

  NumberInput.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({ value: '' + nextProps.value });
  };

  NumberInput.prototype.render = function render() {
    var _this = this;

    var props = this.props,
        value = this.state.value || props.value;

    return React.createElement('input', babelHelpers._extends({}, props, { type: 'number', value: value, onChange: function (e) {
        return _this._change(e);
      } }));
  };

  NumberInput.prototype._change = function _change(e) {
    var val = e.target.value,
        current = this.props.value,
        number = parseFloat(val);

    if (val == null || val.trim() === '' || !isValid(number)) return this.props.onChange(null);

    if (isValid(number) && number !== current && !isAtDelimiter(number, val)) return this.props.onChange(number);

    this.setState({ value: val });
  };

  return NumberInput;
})(React.Component);

module.exports = NumberInput;