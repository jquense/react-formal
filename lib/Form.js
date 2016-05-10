'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _utilPaths = require('./util/paths');

var _utilPaths2 = _interopRequireDefault(_utilPaths);

var _utilContextType = require('./util/contextType');

var _utilContextType2 = _interopRequireDefault(_utilContextType);

var _utilErrToJSON = require('./util/errToJSON');

var _utilErrToJSON2 = _interopRequireDefault(_utilErrToJSON);

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

var isValidationError = function isValidationError(err) {
  return err && err.name === 'ValidationError';
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
 * ReactDOM.render(form, mountNode);
 * ```
 */

var Form = (function (_React$Component) {
  _inherits(Form, _React$Component);

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
       * Callback that is fired when the native onSubmit event is triggered. Only relevant when
       * the `component` prop renders a `<form/>` tag. onInvalidSubmit will trigger only if the form is invalid.
       *
       * ```js
       * function onInvalidSubmit(errors){
       *   // do something with errors
       * }
       * ```
       */
      onInvalidSubmit: _react2['default'].PropTypes.func,

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
       * A tag name or Component class the Form should render.
       *
       * If `null` are `false` the form will simply render it's child. In
       * this instance there must only be one child.
       */
      component: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.string, _react2['default'].PropTypes.oneOf([null, false])]).isRequired,

      /**
       * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
       * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
       * @type {YupSchema}
       */
      schema: function schema(props, name, componentName) {
        var err = !props.noValidate && _react2['default'].PropTypes.any.isRequired(props, name, componentName);

        if (props[name]) {
          var schema = props[name];
          if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate)) err = new Error('`schema` must be a proper yup schema: (' + componentName + ')');
        }

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
    key: 'contextTypes',
    value: {
      reactFormalContext: _react2['default'].PropTypes.object
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: _utilContextType2['default'],
    enumerable: true
  }]);

  function Form(props, context) {
    var _this = this;

    _classCallCheck(this, Form);

    _React$Component.call(this, props, context);

    this._queue = [];
    this._pathOptions = Object.create(null);
    this._handleValidationRequest = this._handleValidationRequest.bind(this);

    this._schema = this._schema.bind(this);
    this.submit = this.submit.bind(this);
    // silence the real submit
    var timer = undefined;
    this.onSubmit = function (e) {
      if (e && e.preventDefault) e.preventDefault();

      clearTimeout(timer);
      timer = setTimeout(function () {
        return _this.submit()['catch'](done);
      }, 0);
    };

    this._setPathOptions = function (path, options) {
      _this._pathOptions[path] = options;
    };

    this.validator = new _reactInputMessageValidator2['default'](function (path, _ref) {
      var props = _ref.props;

      var model = props.value,
          schema = _this._schema(path),
          value = props.getter(path, model),
          parent = props.getter(getParent(path), model) || {},
          options = _this._pathOptions[path] || {};

      return schema.validate(value, _extends({}, props, options, { parent: parent, path: path })).then(function () {
        return void 0;
      })['catch'](function (err) {
        if (isValidationError(err)) return _utilErrToJSON2['default'](err);
        throw err;
      });
    });

    syncErrors(this.validator, props.errors || {});
  }

  Form.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return _reactPureRenderFunction2['default'].call(this, nextProps, nextState);
  };

  Form.prototype.componentDidMount = function componentDidMount() {
    this._registerWithContext();
  };

  Form.prototype.componentWillUnmount = function componentWillUnmount() {
    var timers = this._timers || {};

    this._unmounted = true;
    for (var k in timers) if (has(timers, k)) clearTimeout(timers[k]);
  };

  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
    this._registerWithContext(nextContext);

    if (nextProps.schema !== this.props.schema) {
      this._queueValidation({
        fields: Object.keys(nextProps.errors || {})
      });
    }

    syncErrors(this.validator, nextProps.errors || {});

    //if (nextProps.value !== this.props.value)
    this._flushValidations(nextProps.delay);
  };

  Form.prototype.getChildContext = function getChildContext() {
    var _props = this.props;
    var noValidate = _props.noValidate;
    var schema = _props.schema;

    var context = this._context && this._context.reactFormalContext;

    if (!context || context.noValidate !== noValidate || context.schema !== schema) this._context = {
      reactFormalContext: {
        noValidate: noValidate,
        schema: this._schema,
        onSubmit: this.onSubmit,
        onOptions: this._setPathOptions,
        submit: null
      }
    };

    return this._context;
  };

  Form.prototype.render = function render() {
    var _this2 = this;

    var _props2 = this.props;
    var children = _props2.children;
    var onChange = _props2.onChange;
    var value = _props2.value;
    var Element = _props2.component;
    var getter = _props2.getter;
    var setter = _props2.setter;

    var props = _objectWithoutProperties(_props2, ['children', 'onChange', 'value', 'component', 'getter', 'setter']);

    if (Element === 'form') props.noValidate = true; // disable html5 validation

    props.onSubmit = this.onSubmit;

    if (Element === null || Element === false) {
      children = _react2['default'].cloneElement(_react2['default'].Children.only(children), props);
    } else {
      children = _react2['default'].createElement(
        Element,
        props,
        children
      );
    }

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
        children
      )
    );
  };

  Form.prototype._handleValidationRequest = function _handleValidationRequest(e) {
    if (this.props.noValidate) return;

    this.notify('onValidate', e);
    this._queueValidation(e);

    if (e.type !== 'onChange') this._flushValidations(this.props.delay);
  };

  Form.prototype._processValidations = function _processValidations(fields, props) {
    var _this3 = this;

    return this._validate(fields, props).then(function (errors) {
      _this3._maybeWarnDebug(props.debug, errors, 'field validation');
      _this3.notify('onError', errors);
    })['catch'](done);
  };

  Form.prototype._validate = function _validate(fields) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? this.props : arguments[1];

    return this.validator.validate(fields, { props: props });
  };

  Form.prototype.validate = function validate(fields) {
    return this._validate(fields);
  };

  Form.prototype.validateGroup = function validateGroup(groups) {
    var fields = this._container.fieldsForGroup(groups);

    return this._validate(fields);
  };

  Form.prototype.submit = function submit() {
    var _this4 = this;

    var _props3 = this.props;
    var schema = _props3.schema;
    var noValidate = _props3.noValidate;
    var value = _props3.value;
    var debug = _props3.debug;

    var options = _objectWithoutProperties(_props3, ['schema', 'noValidate', 'value', 'debug']);

    options.abortEarly = false;
    options.strict = false;

    if (noValidate) return this.notify('onSubmit', value);

    var handleSubmit = function handleSubmit(validatedValue) {
      return _this4.notify('onSubmit', validatedValue);
    };

    var handleError = function handleError(err) {
      if (!isValidationError(err)) throw err;

      var errors = _utilErrToJSON2['default'](err);

      _this4._maybeWarnDebug(debug, errors, 'onSubmit');

      _this4.notify('onError', errors);
      _this4.notify('onInvalidSubmit', errors);
    };

    return schema.validate(value, options)
    // no catch, we aren't interested in errors from onSubmit handlers
    .then(handleSubmit, handleError);
  };

  Form.prototype.timeout = function timeout(key, fn, ms) {
    this._timers || (this._timers = Object.create(null));

    if (this._unmounted) return;

    clearTimeout(this._timers[key]);
    this._timers[key] = setTimeout(fn, ms);
  };

  Form.prototype._schema = function _schema(path) {
    var _props4 = this.props;
    var schema = _props4.schema;
    var value = _props4.value;
    var context = _props4.context;

    return schema && path && _yupLibUtilReach2['default'](schema, path, value, context);
  };

  Form.prototype._queueValidation = function _queueValidation(e) {
    this._queue = _utilPaths2['default'].reduce(uniq(this._queue.concat(e.fields)));
  };

  Form.prototype._flushValidations = function _flushValidations(delay) {
    var _this5 = this;

    this.timeout('flush-validations', function () {
      var fields = _this5._queue;
      _this5._queue = [];
      if (fields.length) _this5._processValidations(fields, _this5.props);
    }, delay);
  };

  Form.prototype._registerWithContext = function _registerWithContext() {
    var context = arguments.length <= 0 || arguments[0] === undefined ? this.context : arguments[0];

    if (context.reactFormalContext) {
      var registerSubmit = context.reactFormalContext.registerSubmit;

      if (registerSubmit) registerSubmit(this.submit);
    }
  };

  Form.prototype._maybeWarnDebug = function _maybeWarnDebug(debug, errors, target) {
    if (!debug) return;

    if (process.env.NODE_ENV !== 'production') {
      var keys = Object.keys(errors);
      _warning2['default'](!keys.length, '[react-formal] (' + target + ') invalid fields: ' + keys.join(', '));
    }
  };

  Form.prototype.notify = function notify(event) {
    var _props5;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.props[event] && (_props5 = this.props)[event].apply(_props5, args);
  };

  return Form;
})(_react2['default'].Component);

module.exports = _uncontrollable2['default'](Form, { value: 'onChange', errors: 'onError' }, ['submit', 'validateGroup', 'validate']);

function uniq(arr) {
  return arr.filter(function (item, i) {
    return arr.indexOf(item) === i;
  });
}

function syncErrors(validator) {
  var errors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  validator._errors = {};
  Object.keys(errors).forEach(function (key) {
    if (errors[key] != null) validator._errors[key] = [].concat(errors[key]);
  });
}

function has(o, k) {
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
}