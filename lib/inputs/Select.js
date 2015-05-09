'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var React = require('react');

var childAt = function childAt(children, idx) {
  var child;
  if (children.lengh !== undefined) child = children[idx];else React.Children.forEach(children, function (c, i) {
    return !child && i === idx && (child = c);
  });
  return child;
};

var Select = (function (_React$Component) {
  function Select() {
    babelHelpers.classCallCheck(this, Select);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(Select, _React$Component);

  Select.prototype.render = function render() {
    var _this = this;

    var _props = this.props;
    var children = _props.children;
    var props = babelHelpers.objectWithoutProperties(_props, ['children']);

    return React.createElement(
      'select',
      babelHelpers._extends({}, props, { onChange: function (e) {
          return _this.change(e);
        } }),
      children
    );
  };

  Select.prototype.change = function change(e) {
    var children = this.props.children,
        values = [];

    if (!this.props.multiple) return this.props.onChange(childAt(children, e.target.selectedIndex).props.value);[].forEach.call(e.target.options, function (option, i) {
      return option.selected && values.push(childAt(children, i).props.value);
    });

    this.props.onChange(values);
  };

  return Select;
})(React.Component);

module.exports = Select;