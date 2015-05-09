'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var React = require('react');

var Input = (function (_React$Component) {
  function Input() {
    babelHelpers.classCallCheck(this, Input);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(Input, _React$Component);

  Input.prototype.render = function render() {
    var _props = this.props;
    var _props$tagName = _props.tagName;
    var Tag = _props$tagName === undefined ? 'input' : _props$tagName;
    var props = babelHelpers.objectWithoutProperties(_props, ['tagName']);

    return React.createElement(Tag, babelHelpers._extends({}, props, { onChange: function (e) {
        return props.onChange(e.target.value);
      } }));
  };

  return Input;
})(React.Component);

module.exports = Input;