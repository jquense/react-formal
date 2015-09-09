'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var childAt = function childAt(children, idx) {
  var child;
  if (children.lengh !== undefined) child = children[idx];else React.Children.forEach(children, function (c, i) {
    return !child && i === idx && (child = c);
  });
  return child;
};

var Select = (function (_React$Component) {
  _inherits(Select, _React$Component);

  function Select() {
    _classCallCheck(this, Select);

    _React$Component.apply(this, arguments);
  }

  Select.prototype.render = function render() {
    var _this = this;

    var _props = this.props;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['children']);

    return React.createElement(
      'select',
      _extends({}, props, { onChange: function (e) {
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