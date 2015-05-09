'use strict';

var babelHelpers = require('./babelHelpers.js');

var React = require('react'),
    Input = require('../inputs/Input.jsx'),
    DateInput = require('../inputs/Date'),
    NumberInput = require('../inputs/Number'),
    BoolInput = require('../inputs/Bool'),
    SelectInput = require('../inputs/Select');

var localDt = 'datetime-local';

var wrapWithDefaults = function wrapWithDefaults(Component, defaults) {
  return (function (_React$Component) {
    var _class = function () {
      babelHelpers.classCallCheck(this, _class);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    };

    babelHelpers.inherits(_class, _React$Component);

    _class.prototype.render = function render() {
      return React.createElement(Component, babelHelpers._extends({}, defaults, this.props, {
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

module.exports = types;