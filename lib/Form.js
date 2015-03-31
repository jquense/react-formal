"use strict";
var Validator = require("react-input-error/lib/components/Validator");
var React = require("react"),
    ReactElement = require("react/lib/ReactElement"),
    update = require("react/lib/update"),
    yup = require("yup"),
    getter = require("property-expr").getter,
    assign = require("xtend/mutable");

var Form = (function (_React$Component) {
  function Form() {
    this.state = {
      children: attachChildren(this.props.children, this._getContext())
    };
    babelHelpers.classCallCheck(this, Form);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(Form, _React$Component);
  Form.propTypes = {
    schema: React.PropTypes.instanceOf(yup.mixed).isRequired,
    onChange: React.PropTypes.func,

    value: function (props, propName, componentName, location) {
      if (props[propName] !== undefined) {
        if (!props.onChange) return new Error("ReactWidgets: you have provided a `value` prop to `" + componentName + "` \n              without an `onChange()` handler. This will render a read-only form.");
      }

      return React.PropTypes.func.isRequired(props, propName, componentName, location);
    }
  };

  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({
      children: attachChildren(nextProps.children, this._getContext())
    });
  };

  Form.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) this._flushValidations();
  };

  Form.prototype._getContext = function _getContext() {
    var _this = this;

    return this._context || (this._context = {
      schema: function (path) {
        return yup.reach(_this.props.schema, path);
      },
      value: function (path) {
        return getter(path)(_this.props.props.value);
      },
      onChange: function (path, val) {
        return onChange && onChange(update(_this.props.props.value, specFromPath(path, val)));
      }
    });
  };

  Form.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var onChange = _props.onChange;
    var props = babelHelpers.objectWithoutProperties(_props, ["children", "onChange"]);

    return React.createElement(
      Validator,
      { ref: "validator", validate: this._validate, onValidate: this._validateEvent },
      React.createElement(
        "form",
        props,
        this.state.children
      )
    );
  };

  Form.prototype._validateEvent = function _validateEvent(e) {
    if (e.event === "onChange") {
      e.preventDefault();
      this._queueValidation(e.field);
    }
  };

  Form.prototype._validate = function _validate(path) {
    var model = this.props.value,
        field = yup.reach(this.props.schema, path),
        value = getter(path)(model);

    return field.validate(value, { strict: true }).then(function () {
      return void 0;
    }).catch(function (err) {
      return err.errors;
    });
  };

  Form.prototype._queueValidation = function _queueValidation(path) {
    var queue = this._queue || (this._queue = []);

    if (queue.indexOf(path) === -1) queue.push(path);
  };

  Form.prototype._flushValidations = function _flushValidations() {
    var validator = this.refs.validator,
        queue = this._queue || [],
        path;

    while (path = queue.shift()) validator.validateField(path);
  };

  return Form;
})(React.Component);

module.exports = Form;

function attachChildren(children, context) {

  if (typeof children === "string" || React.isValidElement(children)) return clone(children);

  return React.Children.map(children, clone);

  function clone(child) {
    var props = child.props;

    if (!React.isValidElement(child) || !child.type._isYupFormField) return child;

    if (props.children) props = babelHelpers._extends({}, child.props, { children: attachChildren(props.children, context) });

    return new ReactElement(child.type, child.key, child.ref, child._owner, babelHelpers._extends({}, child._context, context), props);
  }
}

function specFromPath(path, value) {
  var parts = path.split("."),
      obj = {},
      current = obj;

  parts.forEach(function (part, idx) {
    current = current[part] = {};

    if (idx === parts.length - 1) current.$set = value;
  });

  return obj;
}