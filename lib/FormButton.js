var babelHelpers = require("./util/babelHelpers.js");
var React = require("react");
var warning = require("react/lib/warning");
var Trigger = require("react-input-message/lib/MessageTrigger");

var FormButton = (function (_React$Component) {
  function FormButton() {
    babelHelpers.classCallCheck(this, FormButton);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(FormButton, _React$Component);

  FormButton.prototype.render = function render() {
    var _props = this.props;
    var _props$type = _props.type;
    var type = _props$type === undefined ? "button" : _props$type;
    var group = _props.group;
    var props = babelHelpers.objectWithoutProperties(_props, ["type", "group"]);

    warning(!group || type.toLowerCase() !== "submit", "[yup-forms] You have specified a `group` prop with type=\"submit\" on this Form.Button component. " + "submit type buttons will automatically trigger a form wide validation. " + "to trigger validation for jsut the group: `" + group + "` use type=\"button\" instead.");

    if (type.toLowerCase() === "submit") return React.createElement(
      "button",
      babelHelpers._extends({}, props, { type: "submit" }),
      this.props.children
    );

    return React.createElement(
      Trigger,
      { group: group, events: ["onClick"] },
      React.createElement(
        "button",
        props,
        this.props.children
      )
    );
  };

  return FormButton;
})(React.Component);

module.exports = FormButton;