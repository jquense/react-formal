var babelHelpers = require("./util/babelHelpers.js");
var React = require("react");
var Message = require("react-input-message/lib/Message");
var cn = require("classnames");

module.exports = (function () {
  function ValidationMessage(props, context) {
    babelHelpers.classCallCheck(this, ValidationMessage);

    this.props = props;
    this.context = context;
  }

  ValidationMessage.prototype.render = function render() {
    var props = this.props;

    return React.createElement(Message, babelHelpers._extends({}, props, {
      className: cn(props.className, props.errorClass || "validation-error")
    }));
  };

  return ValidationMessage;
})();