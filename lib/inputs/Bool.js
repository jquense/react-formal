'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var BoolInput = (function (_React$Component) {
  _inherits(BoolInput, _React$Component);

  function BoolInput() {
    _classCallCheck(this, BoolInput);

    _React$Component.apply(this, arguments);
  }

  BoolInput.prototype.render = function render() {
    var props = this.props;

    return React.createElement('input', _extends({}, props, { type: 'checkbox',
      checked: props.value,
      onChange: function (e) {
        return props.onChange(e.target.checked);
      }
    }));
  };

  return BoolInput;
})(React.Component);

module.exports = BoolInput;