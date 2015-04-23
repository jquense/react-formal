"use strict";
var babelHelpers = require("./util/babelHelpers.js");
var Validator = require("react-input-message/lib/Validator");
var Container = require("react-input-message/lib/MessageContainer");

var React = require("react"),
    getChildren = require("./util/parentContext"),
    updateIn = require("react/lib/update"),
    yup = require("yup"),
    getter = require("property-expr").getter;

var Form = (function (_React$Component) {
  function Form(props, context) {
    babelHelpers.classCallCheck(this, Form);

    _React$Component.call(this, props, context);

    this.validator = new Validator(function (path, props) {
      var model = props.value,
          field = yup.reach(props.schema, path),
          value = getter(path)(model);

      return field.validate(value, { strict: true }).then(function () {
        return void 0;
      }).catch(function (err) {
        return err.errors;
      });
    });

    this.state = {
      children: getChildren(this.props.children, this.getChildContext())
    };
  }

  babelHelpers.inherits(Form, _React$Component);
  Form.propTypes = {

    onChange: React.PropTypes.func,

    novalidate: React.PropTypes.bool,

    component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]),

    schema: function (props, name, componentName) {
      var err = React.PropTypes.any.isRequired(props, name, componentName);

      if (!err && !props[name].__isYupSchema__) err = new Error("`schema` must be a proper yup schema: (" + componentName + ")");

      return err;
    },

    value: function (props, propName, componentName, location) {
      if (props[propName] !== undefined) {
        if (!props.onChange) return new Error("You have provided a `value` prop to `" + componentName + "` \n              without an `onChange()` handler. This will render a read-only form.");
      }

      return React.PropTypes.object.isRequired(props, propName, componentName, location);
    }
  };
  Form.defaultProps = {
    component: "form"
  };
  Form.childContextTypes = {

    schema: React.PropTypes.func,
    value: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func

  };

  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

    this._flushValidations(nextProps);

    this.setState({
      children: getChildren(nextProps.children, this.getChildContext())
    });
  };

  Form.prototype.getChildContext = function getChildContext() {
    var _this = this;

    return this._context || (this._context = {

      schema: function (path) {
        return yup.reach(_this.props.schema, path);
      },

      value: function (path) {
        return getter(path)(_this.props.value);
      },

      onChange: function (path, updates, val) {
        return _this._update(path, val, updates);
      }
    });
  };

  Form.prototype._update = function _update(path, widgetValue, updateMap) {
    var model = this.props.value,
        updater = function (model, path, val) {
      return updateIn(model, specFromPath(path, val));
    };

    if (updateMap) {
      for (var key in updateMap) if (updateMap.hasOwnProperty(key)) model = updater(model, key, getValue(widgetValue, key, updateMap));
    } else model = updater(model, path, widgetValue);

    this.props.onChange && this.props.onChange(model);

    function getValue(val, key, map) {
      var field = map[key];
      return typeof field === "function" ? field(val) : val[field];
    }
  };

  Form.prototype.render = function render() {
    var _this = this;

    var _props = this.props;
    var children = _props.children;
    var onChange = _props.onChange;
    var Element = _props.component;
    var props = babelHelpers.objectWithoutProperties(_props, ["children", "onChange", "component"]);

    var handleValidationRequest = function (e) {
      if (e.event === "onChange") return _this._queueValidation(e.field);

      _this.validator.validate(e.field, _this.props).then(function () {
        return _this.setState({ errors: _this.validator.errors() });
      }).catch(function (e) {
        return setTimeout(function () {
          throw e;
        });
      });
    };

    return React.createElement(
      Container,
      {
        ref: function (ref) {
          return _this._container = ref;
        },
        messages: this.state.errors,
        onValidationNeeded: props.novalidate ? null : handleValidationRequest },
      React.createElement(
        Element,
        babelHelpers._extends({}, props, { onSubmit: this._submit.bind(this), noValidate: true }),
        this.state.children
      )
    );
  };

  Form.prototype._submit = function _submit(e) {
    var _this = this;

    e.preventDefault();

    var fields = this._container.fields();

    this.validator.validate(fields, this.props).then(function () {
      var errors = _this.validator.errors();

      if (Object.keys(errors).length) return _this.setState({ errors: errors });

      _this.props.onSubmit && _this.props.onSubmit();
    });
  };

  Form.prototype._queueValidation = function _queueValidation(path) {
    var queue = this._queue || (this._queue = []);

    if (queue.indexOf(path) === -1) queue.push(path);
  };

  Form.prototype._flushValidations = function _flushValidations(props) {
    var _this = this;

    var validator = this.validator,
        fields = this._queue || [];

    this._queue = [];

    this.validator.validate(fields, props).then(function () {
      return _this.setState({ errors: validator.errors() });
    }).catch(function (e) {
      return setTimeout(function () {
        throw e;
      });
    });
  };

  return Form;
})(React.Component);

module.exports = Form;

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