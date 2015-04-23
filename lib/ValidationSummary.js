var babelHelpers = require("./util/babelHelpers.js");
var React = require("react");
var connectToMessageContainer = require("react-input-message/lib/connectToMessageContainer");
var cn = require("classnames");

var values = function (obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};

module.exports = connectToMessageContainer((function () {
  function ValidationSummary(props, context) {
    babelHelpers.classCallCheck(this, ValidationSummary);

    this.props = props;
    this.context = context;
  }

  ValidationSummary.defaultProps = {
    component: "ul",
    formatMessage: function (msg, idx) {
      return React.createElement(
        "li",
        { key: idx },
        msg
      );
    }
  };

  ValidationSummary.prototype.render = function render() {
    var _props = this.props;
    var Component = _props.component;
    var messages = _props.messages;
    var active = _props.active;
    var fieldFor = _props.for;
    var props = babelHelpers.objectWithoutProperties(_props, ["component", "messages", "active", "for"]);

    if (!active) return null;

    return React.createElement(
      Component,
      babelHelpers._extends({}, props, {
        className: cn(props.className, props.errorClass || "validation-error") }),
      Object.keys(messages).reduce(function (list, k) {
        var values = messages[k] == null ? [] : [].concat(messages[k]);
        return list.concat(values.map(props.formatMessage));
      }, [])
    );
  };

  return ValidationSummary;
})());