'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var isValid = function isValid(num) {
  return typeof num === 'number' && !isNaN(num);
};

var isAtDelimiter = function isAtDelimiter(num, str) {
  var next = str.length <= 1 ? false : parseFloat(str.substr(0, str.length - 1));
  return typeof next === 'number' && !isNaN(next) && next === num;
};

var NumberInput = (function (_React$Component) {
  _inherits(NumberInput, _React$Component);

  function NumberInput() {
    _classCallCheck(this, NumberInput);

    _React$Component.apply(this, arguments);

    this.state = {};
  }

  NumberInput.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({ value: '' + nextProps.value });
  };

  NumberInput.prototype.render = function render() {
    var _this = this;

    var props = this.props,
        value = this.state.value || props.value;

    return React.createElement('input', _extends({}, props, { type: 'number', value: value, onChange: function (e) {
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