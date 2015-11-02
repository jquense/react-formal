'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderFunction = require('react-pure-render/function');

var _reactPureRenderFunction2 = _interopRequireDefault(_reactPureRenderFunction);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _yupLibUtilReach = require('yup/lib/util/reach');

var _yupLibUtilReach2 = _interopRequireDefault(_yupLibUtilReach);

var _propertyExpr = require('property-expr');

var _propertyExpr2 = _interopRequireDefault(_propertyExpr);

var _reactInputMessageValidator = require('react-input-message/Validator');

var _reactInputMessageValidator2 = _interopRequireDefault(_reactInputMessageValidator);

var _reactInputMessageMessageContainer = require('react-input-message/MessageContainer');

var _reactInputMessageMessageContainer2 = _interopRequireDefault(_reactInputMessageMessageContainer);

var _uncontrollableBatching = require('uncontrollable/batching');

var _uncontrollableBatching2 = _interopRequireDefault(_uncontrollableBatching);

var _utilPaths = require('./util/paths');

var _utilPaths2 = _interopRequireDefault(_utilPaths);

var _utilContextType = require('./util/contextType');

var _utilContextType2 = _interopRequireDefault(_utilContextType);

var _topeka = require('topeka');

var BindingContext = _topeka.BindingContext.ControlledComponent;

var done = function done(e) {
  return setTimeout(function () {
    throw e;
  });
};
var getParent = function getParent(path) {
  return _propertyExpr2['default'].join(_propertyExpr2['default'].split(path).slice(0, -1));
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
 *
 * var customerSchema = yup
 *   .object({
 *     name: yup.object({
 *       first: defaultStr
 *         .required('please enter a first name'),
 *
 *       last: defaultStr
 *         .required('please enter a surname'),
 *     }),
 *
 *     dateOfBirth: yup.date()
 *       .max(new Date(), "Are you a time traveler?!"),
 *
 *     colorId: yup.number()
 *       .nullable()
 *       .required('Please select a dank color')
 *   });
 *
 * var form = (
 *   <Form
 *     schema={customerSchema}
 *     defaultValue={customerSchema.default()}
 *   >
 *     <div>
 *       {\/\*'grandchildren' are no problem \*\/}
 *       <label>Name</label>
 *
 *       <Form.Field
 *         name='name.first'
 *         placeholder='First name'
 *       />
 *       <Form.Field
 *         name='name.last'
 *         placeholder='Surname'
 *       />
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
 *   <Form.Button type='submit'>
 *     Submit
 *   </Form.Button>
 * </Form>)
 * React.render(form, mountNode);
 * ```
 */

var Form = (function (_React$Component) {
  function Form(props, context) {
    var _this = this;

    _classCallCheck(this, Form);

    _React$Component.call(this, props, context);

    this._queue = [];
    this._pathOptions = Object.create(null);
    this._handleValidationRequest = this._handleValidationRequest.bind(this);

    this.submit = this.submit.bind(this);
    // silence the real submit
    this.onSubmit = function (e) {
      e && e.preventDefault && e.preventDefault();
    };

    this._setPathOptions = function (path, options) {
      _this._pathOptions[path] = options;
    };

    this.validator = new _reactInputMessageValidator2['default'](function (path, _ref) {
      var props = _ref.props;

      var model = props.value,
          schema = (0, _yupLibUtilReach2['default'])(props.schema, path),
          value = props.getter(path, model),
          parent = props.getter(getParent(path), model) || {},
          options = _this._pathOptions[path] || {};

      return schema._validate(value, _extends({}, props, options), { parent: parent, path: path }).then(function () {
        return void 0;
      })['catch'](function (err) {
        return errToJSON(err);
      });
    });

    syncErrors(this.validator, props.errors || {});
  }

  _inherits(Form, _React$Component);

  Form.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return _reactPureRenderFunction2['default'].call(this, nextProps, nextState);
  };

  Form.prototype.componentWillUnmount = function componentWillUnmount() {
    var timers = this._timers || {};

    this._unmounted = true;
    for (var k in timers) if (has(timers, k)) clearTimeout(timers[k]);
  };

  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.schema !== this.props.schema) {
      this._queueValidation({
        fields: Object.keys(nextProps.errors || {})
      });
    }

    syncErrors(this.validator, nextProps.errors || {});
    this._flushValidations(nextProps);
  };

  Form.prototype.getChildContext = function getChildContext() {
    var _props2 = this.props;
    var noValidate = _props2.noValidate;
    var schema = _props2.schema;

    var context = this._context && this._context.reactFormalContext;

    if (!context || context.noValidate !== noValidate || context.schema !== schema) this._context = {
      reactFormalContext: {
        noValidate: noValidate,
        schema: schema,
        onSubmit: this.submit,
        onOptions: this._setPathOptions
      }
    };

    return this._context;
  };

  Form.prototype.render = function render() {
    var _this2 = this;

    var _props3 = this.props;
    var children = _props3.children;
    var onChange = _props3.onChange;
    var value = _props3.value;
    var Element = _props3.component;
    var getter = _props3.getter;
    var setter = _props3.setter;

    var props = _objectWithoutProperties(_props3, ['children', 'onChange', 'value', 'component', 'getter', 'setter']);

    if (Element === 'form') props.noValidate = true; // disable html5 validation

    return _react2['default'].createElement(
      BindingContext,
      {
        value: value,
        onChange: onChange,
        getter: getter,
        setter: setter
      },
      _react2['default'].createElement(
        _reactInputMessageMessageContainer2['default'],
        {
          ref: function (ref) {
            return _this2._container = ref;
          },
          messages: this.props.errors,
          onValidationNeeded: this._handleValidationRequest
        },
        _react2['default'].createElement(
          Element,
          _extends({}, props, { onSubmit: this.onSubmit }),
          children
        )
      )
    );
  };

  Form.prototype._handleValidationRequest = function _handleValidationRequest(e) {
    if (this.props.noValidate) return;

    this.notify('onValidate', e);
    this._queueValidation(e);

    if (e.type !== 'onChange') this._flushValidations(this.props);
  };

  Form.prototype._processValidations = function _processValidations(fields, props) {
    var _this3 = this;

    this.validator.validate(fields, { props: props }).then(function (errors) {
      if (props.debug && process.env.NODE_ENV !== 'production') {
        (0, _warning2['default'])(!Object.keys(errors).length, '[react-formal] invalid fields: ' + Object.keys(errors).join(', '));
      }

      _this3.notify('onError', errors);
    })['catch'](done);
  };

  Form.prototype.submit = function submit() {
    var _this4 = this;

    var _props4 = this.props;
    var schema = _props4.schema;
    var value = _props4.value;
    var debug = _props4.debug;

    var options = _objectWithoutProperties(_props4, ['schema', 'value', 'debug']);

    options.abortEarly = false;
    options.strict = false;

    schema.validate(value, options).then(function () {
      return _this4.notify('onSubmit', value);
    })['catch'](function (err) {
      var errors = errToJSON(err);

      if (debug && process.env.NODE_ENV !== 'production') {
        (0, _warning2['default'])(!Object.keys(errors).length, '[react-formal] (onSubmit) invalid fields: ' + Object.keys(errors).join(', '));
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
    this._queue = _utilPaths2['default'].reduce(uniq(this._queue.concat(e.fields)));
  };

  Form.prototype._flushValidations = function _flushValidations(props) {
    var _this5 = this;

    this.timeout('flush-validations', function () {
      var fields = _this5._queue;
      _this5._queue = [];
      if (fields.length) _this5._processValidations(fields, props);
    }, props.delay);
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
      value: _react2['default'].PropTypes.object,

      /**
       * Callback that is called when the `value` prop changes.
       *
       * ```js
       * function(
       *   value: object,
       *   updatedPaths: array<string>
       * )
       * ```
       */
      onChange: _react2['default'].PropTypes.func,

      /**
       * An object hash of field errors for the form. The object should be keyed with paths
       * with the values being an array of messages or message objects. Errors can be
       * left [uncontrolled](/controllables) (use `defaultErrors` to set an initial value)
       * or managed along with the `onError` callback. You can use any object shape you'd like for
       * messages, as long as you provide the Form.Message component an `extract` prop that
       * understands how to pull out the strings message. By default it understands strings and objects
       * with a `'message'` property.
       *
       * ```js
       * <Form errors={{
       *  "name.first": [
       *    'First names are required',
       *    {
       *    	message: "Names must be at least 2 characters long",
       *    	type: 'min'
       *    }
       *  ],
       * }}/>
       * ```
       */
      errors: _react2['default'].PropTypes.object,

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
      onError: _react2['default'].PropTypes.func,

      /**
       * Callback that is called whenever a validation is triggered.
       * It is called _before_ the validation is actually run.
       * ```js
       * function onValidate(event){
       *   let { type, fields, args } = event
       * }
       * ```
       */
      onValidate: _react2['default'].PropTypes.func,

      /**
       * Callback that is fired when the native onSubmit event is triggered. Only relevant when
       * the `component` prop renders a `<form/>` tag. onSubmit will trigger only if the form is valid.
       *
       * ```js
       * function onSubmit(formValue){
       *   // do something with valid value
       * }
       * ```
       */
      onSubmit: _react2['default'].PropTypes.func,

      /**
       * A value getter function. `getter` is called with `path` and `value` and
       * should return the plain **javascript** value at the path.
       *
        * ```js
       * function(
       *  path: string,
       *  value: any,
       * ) -> object
       * ```
       */
      getter: _react2['default'].PropTypes.func,

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
      setter: _react2['default'].PropTypes.func,

      /**
       * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
       * made at the expense of a slight delay. Helpful for performance.
       */
      delay: _react2['default'].PropTypes.number,

      /**
       * Validations will be strict, making no attempt to coarce input values to the appropriate type.
       */
      strict: _react2['default'].PropTypes.bool,

      /**
       * Turns off input validation for the Form, value updates will continue to work.
       */
      noValidate: _react2['default'].PropTypes.bool,

      /**
       * A tag name or Component class the Form should render as
       */
      component: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.string]).isRequired,

      /**
       * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
       * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
       * @type {YupSchema}
       */
      schema: function schema(props, name, componentName) {
        var err = !props.noValidate && _react2['default'].PropTypes.any.isRequired(props, name, componentName);

        if (props[name] && !props[name].__isYupSchema__) err = new Error('`schema` must be a proper yup schema: (' + componentName + ')');

        return err;
      }
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: _extends({}, BindingContext.defaultProps, {
      component: 'form',
      strict: false,
      delay: 300,
      getter: function getter(path, model) {
        return path ? _propertyExpr2['default'].getter(path, true)(model || {}) : model;
      }
    }),
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: _utilContextType2['default'],
    enumerable: true
  }]);

  return Form;
})(_react2['default'].Component);

module.exports = (0, _uncontrollableBatching2['default'])(Form, { value: 'onChange', errors: 'onError' }, ['submit']);

function uniq(arr) {
  return arr.filter(function (item, i) {
    return arr.indexOf(item) === i;
  });
}

function errToJSON(error) {
  if (error.inner.length) return error.inner.reduce(function (list, inner) {
    list[inner.path] = (list[inner.path] || []).concat(errToJSON(inner));

    return list;
  }, {});

  return {
    message: error.message,
    type: error.type
  };
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