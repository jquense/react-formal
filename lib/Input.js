"use strict";
var babelHelpers = require("./util/babelHelpers.js");
var React = require("react");

var Input = React.createClass({
  displayName: "Input",

  render: function () {
    var _this = this;

    return React.createElement("input", babelHelpers._extends({}, this.props, { onChange: function (e) {
        return _this.props.onChange && _this.props.onChange.call(_this, e.target.value);
      } }));
  }

});

module.exports = Input;