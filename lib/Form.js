'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var React = require('react');
var scu = require('react-pure-render/function');
var warning = require('warning'),
    invariant = require('invariant'),
    reach = require('yup/lib/util/reach'),
    expr = require('property-expr'),
    updateIn = require('./util/update'),
    Validator = require('react-input-message/lib/Validator'),
    Container = require('react-input-message/lib/MessageContainer'),
    uncontrollable = require('uncontrollable/batching'),
    paths = require('./util/paths'),
    getChildren = require('./util/parentContext');

var done = function done(e) {
  return setTimeout(function () {
    throw e;
  });
};

var useRealContext = /^0\.14/.test(React.version);

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
    _classCallCheck(this, Form);

    _React$Component.call(this, props, context);

    this._handlers = [];
    this.submit = this.submit.bind(this);

    // silence the real submit
    this.onSubmit = function (e) {
      e && e.preventDefault && e.preventDefault();
    };

    this.validator = new Validator(function (path, _ref) {
      var props = _ref.props;
      var options = _ref.options;

      var model = props.value,
          schema = reach(props.schema, path),
          value = props.getter(path, model),
          parent = props.getter(getParent(path), model) || {};

      return schema._validate(value, _extends({}, props, options), { parent: parent, path: path }).then(function () {
        return void 0;
      })['catch'](function (err) {
        return err.errors;
      });
    });

    syncErrors(this.validator, props.errors || {});

    this.state = useRealContext ? {} : {
      children: getChildren(this.props.children, this.getChildContext())
    };
  }

  _inherits(Form, _React$Component);

  Form.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return scu.call(this, nextProps, nextState);
  };

  Form.prototype.componentWillUnmount = function componentWillUnmount() {
    var timers = this._timers || {};

    this._unmounted = true;
    for (var k in timers) if (has(timers, k)) clearTimeout(timers[k]);
  };

  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.schema !== this.props.schema) {
      this._queueValidation({
        fields: this._getFieldsToQueue(nextProps)
      });
    }

    if (nextProps.value !== this.props.value || nextProps.noValidate !== this.props.noValidate) this._emit(nextProps);

    syncErrors(this.validator, nextProps.errors || {});

    this._flushValidations(nextProps);

    if (!useRealContext) {
      this.setState({
        children: getChildren(nextProps.children, this.getChildContext())
      });
    }
  };

  Form.prototype.getChildContext = function getChildContext() {
    var _this = this;

    return this._context || (this._context = {

      onFormSubmit: this.submit,

      registerWithForm: function registerWithForm(listener) {
        var remove = function remove() {
          return _this._handlers.splice(_this._handlers.indexOf(listener), 1);
        };

        _this._handlers.push(listener);
        listener(_this._listenerContext(_this.props));

        return {
          remove: remove,
          onChange: function onChange(path, updates, args) {
            return _this._update(path, args, updates);
          } };
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

    this.notify('onChange', model, path);

    function getValue(args, key, map) {
      var field = map[key];
      return typeof field === 'function' ? field.apply(undefined, args) : args[0][field];
    }
  };

  Form.prototype.render = function render() {
    var _this2 = this;

    var _props2 = this.props;
    var children = _props2.children;
    var onChange = _props2.onChange;
    var value = _props2.value;
    var Element = _props2.component;

    var props = _objectWithoutProperties(_props2, ['children', 'onChange', 'value', 'component']);

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
        }
      },
      React.createElement(
        Element,
        _extends({}, props, { onSubmit: this.onSubmit }),
        this.state.children || this.props.children
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

        if (props.debug && process.env.NODE_ENV !== 'production') {
          warning(!Object.keys(errors).length, '[react-formal] invalid fields: ' + Object.keys(errors).join(', '));
        }

        _this3.notify('onError', errors);
      })['catch'](done);
    }, this.props.delay);
  };

  Form.prototype.submit = function submit() {
    var _this4 = this;

    var _props3 = this.props;
    var schema = _props3.schema;
    var value = _props3.value;
    var debug = _props3.debug;

    var options = _objectWithoutProperties(_props3, ['schema', 'value', 'debug']);

    options.abortEarly = false;
    options.strict = false;

    schema.validate(value, options).then(function () {
      return _this4.notify('onSubmit', value);
    })['catch'](function (err) {
      var errors = err.inner.reduce(function (list, e) {
        list[e.path] = (list[e.path] || (list[e.path] = [])).concat(e.errors);
        return list;
      }, {});

      if (debug && process.env.NODE_ENV !== 'production') {
        warning(!Object.keys(errors).length, '[react-formal] (onSubmit) invalid fields: ' + Object.keys(errors).join(', '));
      }

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

  Form.prototype._getFieldsToQueue = function _getFieldsToQueue(nextProps) {
    var fields = [];

    for (var i = 0; i < this._queue.length; i++) {
      fields.concat(this._queue[i].fields);
    }

    fields.concat(Object.keys(nextProps.errors || {}));

    return uniq(fields);
  };

  Form.prototype._emit = function _emit(props) {
    var context = this._listenerContext(props);
    this._handlers.forEach(function (fn) {
      return fn(context);
    });
  };

  Form.prototype._listenerContext = function _listenerContext(props) {
    return {
      noValidate: props.noValidate,
      schema: function schema(path) {
        return path && props.schema && reach(props.schema, path);
      },
      value: function value(pathOrAccessor) {
        return typeof pathOrAccessor === 'function' ? pathOrAccessor(props.value) : props.getter(pathOrAccessor, props.value);
      } };
  };

  Form.prototype.notify = function notify(event) {
    var _props;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.props[event] && (_props = this.props)[event].apply(_props, args);
  };

  _createClass(Form, null, [{
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
       * function onSubmit(value){
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
      onFormSubmit: React.PropTypes.func,
      registerWithForm: React.PropTypes.func
    },
    enumerable: true
  }]);

  return Form;
})(React.Component);

module.exports = uncontrollable(Form, { value: 'onChange', errors: 'onError' }, ['submit']);

function wrapSetter(setter) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
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

function syncErrors(validator) {
  var errors = arguments[1] === undefined ? {} : arguments[1];

  validator._errors = {};
  Object.keys(errors).forEach(function (key) {
    if (errors[key] != null) validator._errors[key] = [].concat(errors[key]);
  });
}

function has(o, k) {
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
}