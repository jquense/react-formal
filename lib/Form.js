'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _propertyExpr = require('property-expr');

var _propertyExpr2 = _interopRequireDefault(_propertyExpr);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _MessageContainer = require('react-input-message/MessageContainer');

var _MessageContainer2 = _interopRequireDefault(_MessageContainer);

var _topeka = require('topeka');

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _universalPromise = require('universal-promise');

var _universalPromise2 = _interopRequireDefault(_universalPromise);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _reach = require('yup/lib/util/reach');

var _reach2 = _interopRequireDefault(_reach);

var _errorManager = require('./errorManager');

var _errorManager2 = _interopRequireDefault(_errorManager);

var _contextType = require('./util/contextType');

var _contextType2 = _interopRequireDefault(_contextType);

var _errToJSON = require('./util/errToJSON');

var _errToJSON2 = _interopRequireDefault(_errToJSON);

var _timeoutManager = require('./util/timeoutManager');

var _timeoutManager2 = _interopRequireDefault(_timeoutManager);

var _registerWithContext = require('./util/registerWithContext');

var _registerWithContext2 = _interopRequireDefault(_registerWithContext);

var _ErrorUtils = require('./util/ErrorUtils');

var ErrorUtils = _interopRequireWildcard(_ErrorUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BindingContext = _topeka.BindingContext.ControlledComponent;

var done = function done(e) {
  return setTimeout(function () {
    throw e;
  });
};
var splitPath = function splitPath(path) {
  var parts = _propertyExpr2.default.split(path);
  var tail = parts.pop();
  return [_propertyExpr2.default.join(parts), tail];
};

var isValidationError = function isValidationError(err) {
  return err && err.name === 'ValidationError';
};

var YUP_OPTIONS = ['context', 'stripUnknown', 'recursive', 'abortEarly', 'strict'];

function maybeWarn(debug, errors, target) {
  if (!debug) return;

  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.keys(errors);
    (0, _warning2.default)(!keys.length, '[react-formal] (' + target + ') invalid fields: ' + keys.join(', '));
  }
}

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

var Form = function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form(props, context) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _initialiseProps.call(_this);

    _this.queue = [];
    _this.pathOptions = Object.create(null);
    _this.timeouts = (0, _timeoutManager2.default)(_this);
    _this.errors = (0, _errorManager2.default)(_this.handleValidate);

    (0, _registerWithContext2.default)(_this, _this.submit);
    return _this;
  }

  Form.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return _function2.default.call(this, nextProps, nextState);
  };

  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.schema !== this.props.schema) {
      this.enqueue(Object.keys(nextProps.errors || {}));
    }
    this.flush(nextProps.delay);
  };

  Form.prototype.getChildContext = function getChildContext() {
    var _props = this.props;
    var noValidate = _props.noValidate;
    var schema = _props.schema;

    var options = _objectWithoutProperties(_props, ['noValidate', 'schema']);

    var context = this._context && this._context.reactFormalContext;

    if (!context || context.schema !== schema || context.noValidate !== noValidate) {
      this._context = {
        reactFormalContext: {
          options: options,
          noValidate: noValidate,
          registerForm: null,
          submitForm: this.handleContextSubmit,
          schema: this.getSchemaForPath,
          onFieldError: this.handleFieldError
        }
      };
    }

    return this._context;
  };

  Form.prototype.enqueue = function enqueue(fields) {
    this.queue = this.queue.concat(fields);
  };

  Form.prototype.flush = function flush(delay) {
    var _this2 = this;

    this.timeouts.set('flush-validations', function () {
      var fields = _this2.queue;
      var props = _this2.props;

      if (!fields.length) return;

      _this2.queue = [];
      _this2._validate(fields, _this2.props).then(function (errors) {
        if (errors !== _this2.props.errors) {
          maybeWarn(props.debug, errors, 'field validation');
          _this2.notify('onError', errors);
        }
      }).catch(done);
    }, delay);
  };

  Form.prototype._validate = function _validate(fields) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? this.props : arguments[1];

    return this.errors.collect(fields, props.errors, { props: props });
  };

  Form.prototype.validate = function validate(fields) {
    return this._validate(fields);
  };

  Form.prototype.validateGroup = function validateGroup(groups) {
    var fields = this._container.fieldsForGroup(groups);
    return this.validate(fields);
  };

  Form.prototype.render = function render() {
    var _this3 = this;

    var _props2 = this.props;
    var children = _props2.children;
    var onChange = _props2.onChange;
    var value = _props2.value;
    var Element = _props2.component;
    var getter = _props2.getter;
    var setter = _props2.setter;
    var errors = _props2.errors;
    var _props2$__messageCont = _props2.__messageContainer;
    var containerProps = _props2$__messageCont === undefined ? {} : _props2$__messageCont;


    var props = (0, _omit2.default)(this.props, ['__messageContainer'].concat(YUP_OPTIONS, Object.keys(Form.propTypes)));

    if (Element === 'form') props.noValidate = true; // disable html5 validation

    props.onSubmit = this.handleSubmit;

    if (Element === null || Element === false) {
      children = _react2.default.cloneElement(_react2.default.Children.only(children), props);
    } else {
      children = _react2.default.createElement(
        Element,
        props,
        children
      );
    }

    if (!containerProps.passthrough) {
      containerProps.messages = errors;
    }

    return _react2.default.createElement(
      BindingContext,
      {
        value: value,
        onChange: onChange,
        getter: getter,
        setter: setter
      },
      _react2.default.createElement(
        _MessageContainer2.default,
        _extends({}, containerProps, {
          ref: function ref(_ref) {
            return _this3._container = _ref;
          },
          onValidationNeeded: this.handleValidationRequest
        }),
        children
      )
    );
  };

  Form.prototype.notify = function notify(event) {
    var _props3;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (this.props[event]) (_props3 = this.props)[event].apply(_props3, args);
  };

  return Form;
}(_react2.default.Component);

Form.propTypes = {

  /**
   * Form value object, can be left [uncontrolled](/controllables);
   * use the `defaultValue` prop to initialize an uncontrolled form.
   */
  value: _react2.default.PropTypes.object,

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
  onChange: _react2.default.PropTypes.func,

  /**
   * A unique key that names a `Form` within a surrounding `Form.Context`.
   * Corresponding `Form.Button`s with the same `formKey` will trigger validation.
   */
  formKey: _react2.default.PropTypes.string,

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
  errors: _react2.default.PropTypes.object,

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
  onError: _react2.default.PropTypes.func,

  /**
   * Callback that is called whenever a validation is triggered.
   * It is called _before_ the validation is actually run.
   * ```js
   * function onValidate(event){
   *   let { type, fields, args } = event
   * }
   * ```
   */
  onValidate: _react2.default.PropTypes.func,

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
  onSubmit: _react2.default.PropTypes.func,

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
  onInvalidSubmit: _react2.default.PropTypes.func,

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
  getter: _react2.default.PropTypes.func,

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
  setter: _react2.default.PropTypes.func,

  /**
   * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
   * made at the expense of a slight delay. Helpful for performance.
   */
  delay: _react2.default.PropTypes.number,

  /**
   * Validations will be strict, making no attempt to coarce input values to the appropriate type.
   */
  strict: _react2.default.PropTypes.bool,

  /**
   * Turns off input validation for the Form, value updates will continue to work.
   */
  noValidate: _react2.default.PropTypes.bool,

  /**
   * A tag name or Component class the Form should render.
   *
   * If `null` are `false` the form will simply render it's child. In
   * this instance there must only be one child.
   */
  component: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string, _react2.default.PropTypes.oneOf([null, false])]),

  /**
   * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
   * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
   * @type {YupSchema}
   */
  schema: function schema(props, name, componentName) {
    var _React$PropTypes$any;

    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    var err = !props.noValidate && (_React$PropTypes$any = _react2.default.PropTypes.any).isRequired.apply(_React$PropTypes$any, [props, name, componentName].concat(args));

    if (props[name]) {
      var schema = props[name];
      if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate)) err = new Error('`schema` must be a proper yup schema: (' + componentName + ')');
    }

    return err;
  },


  /**
   * yup schema context
   */
  context: _react2.default.PropTypes.object,

  /**
   * toggle debug mode, which `console.warn`s validation errors
   */
  debug: _react2.default.PropTypes.bool
};
Form.defaultProps = _extends({}, BindingContext.defaultProps, {
  component: 'form',
  strict: false,
  delay: 300,
  getter: function getter(path, model) {
    return path ? _propertyExpr2.default.getter(path, true)(model || {}) : model;
  }
});
Form.contextTypes = {
  reactFormalContext: _react2.default.PropTypes.object
};
Form.childContextTypes = _contextType2.default;

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.handleValidate = function (path, _ref2) {
    var props = _ref2.props;

    var options = (0, _pick2.default)(props, YUP_OPTIONS);
    var abortEarly = options.abortEarly == null ? false : options.abortEarly;

    var value = props.value;
    var getter = props.getter;

    var schema = _this4.getSchemaForPath(path, props);

    var _splitPath = splitPath(path);

    var parentPath = _splitPath[0];
    var currentPath = _splitPath[1];

    var parent = getter(parentPath, value) || {};
    var pathValue = parent != null ? parent[currentPath] : value;

    return schema.validate(pathValue, _extends({}, options, { abortEarly: abortEarly, parent: parent, path: path })).then(function () {
      return null;
    }).catch(function (err) {
      return err;
    });
  };

  this.handleValidationRequest = function (e) {
    var _props4 = _this4.props;
    var noValidate = _props4.noValidate;
    var delay = _props4.delay;


    if (noValidate) return;

    _this4.notify('onValidate', e);
    _this4.enqueue(e.fields);

    if (e.type !== 'onChange') _this4.flush(delay);
  };

  this.handleFieldError = function (name, fieldErrors) {
    var errors = _this4.props.errors;


    _this4.handleError(_extends(ErrorUtils.remove(errors, name), fieldErrors));
  };

  this.handleError = function (errors) {
    _this4.notify('onError', errors);
  };

  this.handleContextSubmit = function (formName) {
    var key = _this4.props.formKey || '@@parent';

    if (formName && formName !== key) throw new Error('Cannot trigger a submit for a Form from within a different form');

    _this4.handleSubmit();
  };

  this.handleSubmit = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    clearTimeout(_this4.submitTimer);
    _this4.submitTimer = setTimeout(function () {
      return _this4.submit().catch(done);
    }, 0);
  };

  this.getSchemaForPath = function (path) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? _this4.props : arguments[1];
    var schema = props.schema;
    var value = props.value;
    var context = props.context;


    return schema && path && (0, _reach2.default)(schema, path, value, context);
  };

  this.submit = function () {
    var _props5 = _this4.props;
    var schema = _props5.schema;
    var noValidate = _props5.noValidate;
    var value = _props5.value;
    var debug = _props5.debug;

    var options = _objectWithoutProperties(_props5, ['schema', 'noValidate', 'value', 'debug']);

    options.abortEarly = false;
    options.strict = false;

    if (noValidate) return _universalPromise2.default.resolve(true).then(function () {
      return _this4.notify('onSubmit', value);
    });

    var handleSuccess = function handleSuccess(validatedValue) {
      return _this4.notify('onSubmit', validatedValue);
    };

    var handleError = function handleError(err) {
      if (!isValidationError(err)) throw err;

      var errors = (0, _errToJSON2.default)(err);

      maybeWarn(debug, errors, 'onSubmit');

      _this4.notify('onError', errors);
      _this4.notify('onInvalidSubmit', errors);
    };

    return schema.validate(value, options)
    // no catch, we aren't interested in errors from onSubmit handlers
    .then(handleSuccess, handleError);
  };
};

exports.default = (0, _uncontrollable2.default)(Form, {
  value: 'onChange',
  errors: 'onError'
}, ['submit', 'validateGroup', 'validate']);
module.exports = exports['default'];