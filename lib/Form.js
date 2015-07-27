'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    invariant = require('scoped-invariant')('react-formal'),
    reach = require('yup/lib/util/reach'),
    expr = require('property-expr'),
    updateIn = require('./util/update'),
    Validator = require('react-input-message/lib/Validator'),
    Container = require('react-input-message/lib/MessageContainer'),
    uncontrollable = require('uncontrollable'),
    paths = require('./util/paths'),
    getChildren = require('./util/parentContext');

var done = function done(e) {
  return setTimeout(function () {
    throw e;
  });
};

var getParent = function getParent(path) {
  return expr.join(expr.split(path).slice(0, -1));
};

/**
 * Form component renders a `value` to be updated and validated by child Fields.
 * Forms can be thought of as `<input/>`s for complex values, or models. A Form aggregates
 * a bunch of smaller inputs, each in charge of updating a small part of the overall model.
 * The Form will integrate and validate each change and fire a single unified `onChange` with the new `value`.
 *
 * Validation messages can be displayed anywhere inside a Form with Message Components.
 *
 * ```editable
 * var defaultStr = yup.string().default('')
 *   , modelSchema = yup.object({
 *       name: yup.object({
 *         first: defaultStr.required('please enter a first name'),
 *         last:  defaultStr.required('please enter a surname'),
 *       }),
 *
 *       dateOfBirth: yup.date()
 *         .max(new Date(), "You can't be born in the future!"),
 *
 *       colorId: yup.number().nullable()
 *         .required('Please select a color')
 *     });
 *
 * var form = (
 *   <Form
 *     schema={modelSchema}
 *     defaultValue={modelSchema.default()}
 *   >
 *     <div> {\/\*'grandchildren' are no problem \*\/}
 *       <label>Name</label>
 *
 *       <Form.Field name='name.first' placeholder='First name'/>
 *       <Form.Field name='name.last' placeholder='Surname'/>
 *
 *       <Form.Message for={['name.first', 'name.last']}/>
 *     </div>
 *
 *     <label>Date of Birth</label>
 *     <Form.Field name='dateOfBirth'/>
 *     <Form.Message for='dateOfBirth'/>
 *
 *     <label>Favorite Color</label>
 *     <Form.Field name='colorId' type='select'>
 *       <option value={null}>Select a color...</option>
 *       <option value={0}>Red</option>
 *       <option value={1}>Yellow</option>
 *       <option value={2}>Blue</option>
 *       <option value={3}>other</option>
 *     </Form.Field>
 *     <Form.Message for='colorId'/>
 *
 *   <Form.Button type='submit'>Submit</Form.Button>
 * </Form>)
 * React.render(form, mountNode);
 * ```
 */

var Form = (function (_React$Component) {
  function Form(props, context) {
    babelHelpers.classCallCheck(this, Form);

    _React$Component.call(this, props, context);

    this.validator = new Validator(function (path, _ref) {
      var props = _ref.props;
      var options = _ref.options;

      var model = props.value,
          schema = reach(props.schema, path),
          value = props.getter(path, model),
          parent = props.getter(getParent(path), model) || {};

      return schema._validate(value, babelHelpers._extends({}, props, options), { parent: parent, path: path }).then(function () {
        return void 0;
      })['catch'](function (err) {
        return err.errors;
      });
    });

    syncErrors(this.validator, props.errors || {});

    this.state = {
      children: getChildren(this.props.children, this.getChildContext())
    };
  }

  babelHelpers.inherits(Form, _React$Component);

  Form.prototype.componentWillUnmount = function componentWillUnmount() {
    var timers = this._timers || {};

    this._unmounted = true;
    for (var k in timers) if (has(timers, k)) clearTimeout(timers[k]);
  };

  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.schema !== this.props.schema) {
      this._queueValidation({
        fields: uniq((this._queue || []).concat(Object.keys(nextProps.errors || {})))
      });
    }

    syncErrors(this.validator, nextProps.errors || {});

    this._flushValidations(nextProps);

    this.setState({
      children: getChildren(nextProps.children, this.getChildContext())
    });
  };

  Form.prototype.getChildContext = function getChildContext() {
    var _this = this;

    return this._context || (this._context = {

      noValidate: function noValidate() {
        return _this.props.noValidate;
      },

      schema: function schema(path) {
        return path && _this.props.schema && reach(_this.props.schema, path);
      },

      value: function value(path) {
        return _this.props.getter(path, _this.props.value);
      },

      onChange: function onChange(path, updates, args) {
        return _this._update(path, args, updates);
      }
    });
  };

  Form.prototype._update = function _update(path, args, mapValue) {
    var model = this.props.value,
        widgetValue = args[0],
        updater = this.props.setter;

    if (process.env.NODE_ENV !== 'production') updater = wrapSetter(updater);

    if (typeof mapValue === 'function') model = updater(path, model, mapValue.apply(undefined, args));else if (typeof mapValue === 'string') model = updater(path, model, widgetValue[mapValue]);else if (mapValue) {
      for (var key in mapValue) if (mapValue.hasOwnProperty(key)) model = updater(key, model, getValue(args, key, mapValue));
    } else model = updater(path, model, widgetValue);

    this.notify('onChange', model);

    function getValue(args, key, map) {
      var field = map[key];
      return typeof field === 'function' ? field.apply(undefined, args) : args[0][field];
    }
  };

  Form.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props;
    var children = _props.children;
    var onChange = _props.onChange;
    var value = _props.value;
    var Element = _props.component;
    var props = babelHelpers.objectWithoutProperties(_props, ['children', 'onChange', 'value', 'component']);

    if (Element === 'form') props.noValidate = true; // disable html5 validation

    return React.createElement(
      Container,
      {
        ref: function (ref) {
          return _this2._container = ref;
        },
        messages: this.props.errors,
        onValidationNeeded: this.props.noValidate ? function () {} : function (e) {
          return _this2._handleValidationRequest(e);
        } },
      React.createElement(
        Element,
        babelHelpers._extends({}, props, { onSubmit: this._submit.bind(this) }),
        this.state.children
      )
    );
  };

  Form.prototype._handleValidationRequest = function _handleValidationRequest(e) {
    this.notify('onValidate', e);
    return e.event === 'onChange' ? this._queueValidation(e) : this._processValidationRequest(e, this.props);
  };

  Form.prototype._processValidationRequest = function _processValidationRequest(e, props) {
    var _this3 = this;

    var fields = paths.reduce(e.fields),
        options = e.target ? e.target.props.options : {};

    this.timeout(fields.join('-'), function () {
      _this3.validator.validate(fields, { props: props, options: options }).then(function () {
        var errors = _this3.validator.errors();
        _this3.notify('onError', errors);
      })['catch'](done);
    }, this.props.delay);
  };

  Form.prototype._submit = function _submit(e) {
    var _this4 = this;

    var _props2 = this.props;
    var schema = _props2.schema;
    var value = _props2.value;
    var options = babelHelpers.objectWithoutProperties(_props2, ['schema', 'value']);

    options.abortEarly = false;

    e.preventDefault();

    schema.validate(value, options).then(function () {
      return _this4.notify('onSubmit', e);
    })['catch'](function (err) {
      var errors = err.inner.reduce(function (list, e) {
        list[e.path] = (list[e.path] || (list[e.path] = [])).concat(e.errors);
        return list;
      }, {});

      _this4.notify('onError', errors);
    });
  };

  Form.prototype.timeout = function timeout(key, fn, ms) {
    this._timers || (this._timers = Object.create(null));

    if (this._unmounted) return;

    clearTimeout(this._timers[key]);
    this._timers[key] = setTimeout(fn, ms);
  };

  Form.prototype._queueValidation = function _queueValidation(e) {
    var queue = this._queue || (this._queue = []);

    //if ( !queue.some( q => q.path === e.path) )
    queue.push(e);
  };

  Form.prototype._flushValidations = function _flushValidations(props) {
    var _this5 = this;

    var requests = this._queue || [];

    this._queue = [];

    requests.forEach(function (r) {
      return _this5._processValidationRequest(r, props);
    });
  };

  Form.prototype.notify = function notify(event, arg) {
    this.props[event] && this.props[event](arg);
  };

  babelHelpers.createClass(Form, null, [{
    key: 'propTypes',
    value: {

      /**
       * Form value object, can be left [uncontrolled](/controllables);
       * use the `defaultValue` prop to initialize an uncontrolled form.
       */
      value: React.PropTypes.object,

      /**
       * Callback that is called when the `value` prop changes.
       */
      onChange: React.PropTypes.func,

      /**
       * An object hash of field errors for the form. The object should be keyed with paths
       * with the values being string messages or an array of messages. Errors can be
       * left [uncontrolled](/controllables) (use `defaultErrors` to set an initial value)
       * or managed along with the `onError` callback.
       *
       * ```js
       * <Form errors={{
       *  "name.first": [
       *    'First names are required',
       *    "Names must be at least 2 characters long"
       *  ],
       * }}/>
       * ```
       */
      errors: React.PropTypes.object,

      /**
       * Callback that is called when a validation error occurs. It is called with an `errors` object
       *
       * ```editable
       * <Form schema={modelSchema}
       *   defaultValue={modelSchema.default()}
       *   errors={this.state ? this.state.errors : {}}
       *   onError={errors => {
       *     if( errors.dateOfBirth )
       *       errors.dateOfBirth = 'hijacked!'
       *     this.setState({ errors })
       *   }}>
       *
       *   <Form.Field name='dateOfBirth'/>
       *   <Form.Message for='dateOfBirth'/>
       *
       *   <Form.Button type='submit'>Submit</Form.Button>
       * </Form>
       * ```
       */
      onError: React.PropTypes.func,

      /**
       * Callback that is called whenever a validation is triggered.
       * It is called _before_ the validation is actually run.
       * ```js
       * function onError(e){
       *   { event, field, args, target } = e
       * }
       * ```
       */
      onValidate: React.PropTypes.func,

      /**
       * Callback that is fired when the native onSubmit event is triggered. Only relevant when
       * the `component` prop renders a `<form/>` tag. onSubmit will trigger only if the form is valid.
       *
       * ```js
       * function onSubmit(e){
       *   // do something with valid value
       * }
       * ```
       */
      onSubmit: React.PropTypes.func,

      /**
       * A value getter function. `getter` is called with `path` and `value` and
       * should return the plain **javascript** value at the path.
        * ```js
       * function(
       *  path: string,
       *  value: any,
       * ) -> object
       * ```
       */
      getter: React.PropTypes.func,

      /**
       * A value setter function. `setter` is called with `path`, the form `value` and the path `value`.
       * The `setter` must return updated form `value`, which allows you to leave the original value unmutated.
       *
       * The default implementation uses the [react immutability helpers](http://facebook.github.io/react/docs/update.html),
       * letting you treat the form `value` as immutable.
       * ```js
       * function(
       *  path: string,
       *  formValue: object,
       *  pathValue: any
       * ) -> object
       * ```
       */
      setter: React.PropTypes.func.isRequired,

      /**
       * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
       * made at the expense of a slight delay. Helpful for performance.
       */
      delay: React.PropTypes.number,

      /**
       * Validations will be strict, making no attempt to coarce input values to the appropriate type.
       */
      strict: React.PropTypes.bool,

      /**
       * Turns off input validation for the Form, value updates will continue to work.
       */
      noValidate: React.PropTypes.bool,

      /**
       * A tag name or Component class the Form should render as
       */
      component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,

      /**
       * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
       * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
       * @type {YupSchema}
       */
      schema: function schema(props, name, componentName) {
        var err = !props.noValidate && React.PropTypes.any.isRequired(props, name, componentName);

        if (props[name] && !props[name].__isYupSchema__) err = new Error('`schema` must be a proper yup schema: (' + componentName + ')');

        return err;
      }
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      component: 'form',
      strict: true,
      delay: 300,
      getter: function getter(path, model) {
        return path ? expr.getter(path, true)(model || {}) : model;
      },
      setter: function setter(path, model, val) {
        return updateIn(model, path, val);
      }
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      schema: React.PropTypes.func,
      value: React.PropTypes.func,
      onChange: React.PropTypes.func,
      onSubmit: React.PropTypes.func,
      noValidate: React.PropTypes.func
    },
    enumerable: true
  }]);
  return Form;
})(React.Component);

module.exports = uncontrollable(Form, { value: 'onChange', errors: 'onError' });

function wrapSetter(setter) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var result = setter.apply(undefined, args);
    invariant(result && typeof result === 'object', '`setter(..)` props must return the form value object after updating a value.');
    return result;
  };
}

function uniq(arr) {
  return arr.filter(function (item, i) {
    return arr.indexOf(item) === i;
  });
}

function syncErrors(validator, errors) {
  validator._errors = {};
  Object.keys(errors).forEach(function (key) {
    if (errors[key] != null) validator._errors[key] = [].concat(errors[key]);
  });
}

function has(o, k) {
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
}