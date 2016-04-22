'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var BoolInput = (function (_React$Component) {
  _inherits(BoolInput, _React$Component);

  function BoolInput() {
    _classCallCheck(this, BoolInput);

    _React$Component.apply(this, arguments);
  }

  BoolInput.prototype.render = function render() {
    var props = this.props;

    return _react2['default'].createElement(_Input2['default'], _extends({}, props, {
      type: 'checkbox',
      checked: !!props.value,
      onChange: function () {
        return props.onChange(!props.value);
      }
    }));
  };

  _createClass(BoolInput, null, [{
    key: 'propTypes',
    value: {
      value: _react2['default'].PropTypes.bool
    },
    enumerable: true
  }]);

  return BoolInput;
})(_react2['default'].Component);

module.exports = BoolInput;