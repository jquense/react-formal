'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    Input = require('../inputs/Input'),
    DateInput = require('../inputs/Date'),
    NumberInput = require('../inputs/Number'),
    BoolInput = require('../inputs/Bool'),
    SelectInput = require('../inputs/Select');

var localDt = 'datetime-local';

var wrapWithDefaults = function wrapWithDefaults(Component, defaults) {
  return (function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      _classCallCheck(this, _class);

      _React$Component.apply(this, arguments);
    }

    _class.prototype.render = function render() {
      return React.createElement(Component, _extends({}, defaults, this.props, {
        type: defaults.type || this.props.type
      }));
    };

    return _class;
  })(React.Component);
};

var types = Object.create(null);

types.string = wrapWithDefaults(Input, { type: 'text' });
types.number = NumberInput;
types.date = types.time = types.datetime = types[localDt] = DateInput;

types.array = types.listbox = wrapWithDefaults(SelectInput, { multiple: true });

types.bool = types.boolean = BoolInput;

types.textarea = wrapWithDefaults(Input, { tagName: 'textarea' });

types.select = SelectInput;

exports['default'] = types;
module.exports = exports['default'];