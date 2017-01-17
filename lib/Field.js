'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowEqual = require('react-pure-render/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _MessageTrigger = require('react-input-message/MessageTrigger');

var _MessageTrigger2 = _interopRequireDefault(_MessageTrigger);

var _topeka = require('topeka');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _isNativeType = require('./util/isNativeType');

var _isNativeType2 = _interopRequireDefault(_isNativeType);

var _resolveFieldComponent = require('./util/resolveFieldComponent');

var _resolveFieldComponent2 = _interopRequireDefault(_resolveFieldComponent);

var _contextType = require('./util/contextType');

var _contextType2 = _interopRequireDefault(_contextType);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _isReactComponent = require('./util/isReactComponent');

var _isReactComponent2 = _interopRequireDefault(_isReactComponent);

var _ErrorUtils = require('./util/ErrorUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function notify(handler, args) {
  handler && handler.apply(undefined, args);
}

function getValue(value, bindTo, getter) {
  if (typeof bindTo === 'function') {
    return bindTo(value, getter);
  }
  if (typeof bindTo === 'string') {
    return getter(bindTo, value);
  }

  return Object.keys(bindTo).reduce(function (obj, key) {
    obj[key] = getValue(value, bindTo[key], getter);
    return obj;
  }, {});
}

/**
 * The Field Component renders a form control and handles input value updates and validations.
 * Changes to the Field value are automatically propagated back up to the containing Form
 * Component.
 *
 * Fields provide a light abstraction over normal input components where values and onChange handlers
 * are take care of for you. Beyond that they just render the input for their type, Fields whille pass along
 * any props and children to the input so you can easily configure new input types.
 *
 * ```editable
 * <Form
 *   noValidate
 *   schema={modelSchema}
 *   defaultValue={{
 *     name: { first: 'Sally'},
 *     colorID: 0
 *   }}
 * >
 *   <label>Name</label>
 *   <Form.Field
 *     name='name.first'
 *     placeholder='First name'
 *   />
 *
 *   <label>Favorite Color</label>
 *   <Form.Field name='colorId' type='select'>
 *     <option value={0}>Red</option>
 *     <option value={1}>Yellow</option>
 *     <option value={2}>Blue</option>
 *     <option value={3}>other</option>
 *   </Form.Field>
 *   <Form.Button type='submit'>Submit</Form.Button>
 * </Form>
 * ```
 */

var Field = function (_React$Component) {
  _inherits(Field, _React$Component);

  function Field() {
    var _temp, _this, _ret;

    _classCallCheck(this, Field);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onError = function (errors) {
      var name = _this.props.name;
      var context = _this.context.reactFormalContext;

      context.onFieldError(name, errors);
    }, _this.bindTo = function (_value, getter) {
      var _this$props = _this.props;
      var mapToValue = _this$props.mapToValue;
      var name = _this$props.name;

      var value = getValue(_value, mapToValue || name, getter);

      // ensure that no inputs are left uncontrolled
      if (value === undefined) value = null;

      return value;
    }, _this.constructComponent = function (bindingProps) {
      var triggerProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var _this$props2 = _this.props;
      var name = _this$props2.name;
      var type = _this$props2.type;
      var children = _this$props2.children;
      var className = _this$props2.className;
      var _this$props2$errorCla = _this$props2.errorClass;
      var errorClass = _this$props2$errorCla === undefined ? _config2.default.errorClass : _this$props2$errorCla;


      var fieldProps = (0, _omit2.default)(_this.props, Object.keys(Field.propTypes));

      fieldProps = _extends({ name: name }, _this._fieldProps = fieldProps, _this._bindingProps = bindingProps, _this._triggerProps = triggerProps, _this.eventHandlers);

      var schema = _this.schema(name);

      var _resolveFieldComponen = (0, _resolveFieldComponent2.default)(type, schema);

      var Component = _resolveFieldComponen[0];
      var resolvedType = _resolveFieldComponen[1];


      fieldProps.type = (0, _isNativeType2.default)(resolvedType) ? resolvedType : undefined;

      var meta = {
        resolvedType: resolvedType,
        errorClass: errorClass,
        schema: schema,
        onError: _this.onError
      };

      if (_this.context.reactFormalContext) {
        meta.context = _this.context.reactFormalContext.options.context; // lol
      }

      if (_this.shouldValidate()) {
        var _fieldProps = fieldProps;
        var messages = _fieldProps.messages;

        var invalid = messages && !!Object.keys(messages).length;

        meta.errors = messages;
        meta.invalid = invalid;
        meta.valid = !meta.invalid;

        fieldProps.className = (0, _classnames2.default)(className, invalid && errorClass);

        delete fieldProps.messages;
      }

      if (!_this.props.noMeta) fieldProps.meta = meta;

      // Escape hatch for more complex Field types.
      if (typeof children === 'function') {
        return children(fieldProps, Component);
      }

      return _react2.default.createElement(
        Component,
        _extends({}, fieldProps, {
          ref: (0, _isReactComponent2.default)(Component) ? function (r) {
            return _this.input = r;
          } : null
        }),
        children
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Field.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, _, nextContext) {
    return !(0, _shallowEqual2.default)(nextProps, this.props) || !(0, _shallowEqual2.default)(nextContext, this.context);
  };

  Field.prototype.componentWillMount = function componentWillMount() {
    var name = this.props.name;
    var context = this.context.reactFormalContext;

    this.eventHandlers = {};
    this.createEventHandlers(this.props);

    if (process.env.NODE_ENV !== 'production') (0, _invariant2.default)(context.noValidate || !name || this.schema(name), 'There is no corresponding schema defined for this field: "' + name + '" ' + 'Each Field\'s `name` prop must be a valid path defined by the parent Form schema');
  };

  // create a set of handlers with a stable identity so as not to
  // thwart SCU checks
  Field.prototype.createEventHandlers = function createEventHandlers(_ref) {
    var _this2 = this;

    var _ref$events = _ref.events;
    var events = _ref$events === undefined ? _config2.default.events : _ref$events;

    if (events == null) return;

    [].concat(events).forEach(function (event) {
      var handler = function handler() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        notify(_this2._fieldProps[event], args);
        notify(_this2._bindingProps[event], args);
        notify(_this2._triggerProps[event], args);
      };
      _this2.eventHandlers[event] = _this2.eventHandlers[event] || handler;
    });
  };

  Field.prototype.render = function render() {
    var _mapFromValue,
        _this3 = this;

    var _props = this.props;
    var name = _props.name;
    var group = _props.group;
    var exclusive = _props.exclusive;
    var mapFromValue = _props.mapFromValue;
    var alsoValidates = _props.alsoValidates;
    var _props$events = _props.events;
    var events = _props$events === undefined ? _config2.default.events : _props$events;


    var mapMessages = !exclusive ? _ErrorUtils.inclusiveMapMessages : undefined;

    if ((typeof mapFromValue === 'undefined' ? 'undefined' : _typeof(mapFromValue)) !== 'object') mapFromValue = (_mapFromValue = {}, _mapFromValue[name] = mapFromValue, _mapFromValue);

    if (!this.shouldValidate()) {
      return _react2.default.createElement(
        _topeka.Binding,
        { bindTo: this.bindTo, mapValue: mapFromValue },
        this.constructComponent
      );
    }

    if (alsoValidates != null) {
      name = [name].concat(alsoValidates);
    }

    return _react2.default.createElement(
      _topeka.Binding,
      { bindTo: this.bindTo, mapValue: mapFromValue },
      function (bindingProps) {
        return _react2.default.createElement(
          _MessageTrigger2.default,
          {
            'for': name,
            group: group,
            events: events,
            mapMessages: mapMessages
          },
          function (triggerProps) {
            return _this3.constructComponent(bindingProps, triggerProps);
          }
        );
      }
    );
  };

  Field.prototype.schema = function schema(path) {
    var schema = void 0;
    var context = this.context.reactFormalContext;
    try {
      schema = path && context.schema && context.schema(path);
    } catch (err) {} // eslint-disable-line no-empty

    return schema;
  };

  Field.prototype.shouldValidate = function shouldValidate() {
    var context = this.context.reactFormalContext;
    return !(this.props.noValidate || context.noValidate);
  };

  Field.prototype.inputInstance = function inputInstance() {
    return this.input;
  };

  return Field;
}(_react2.default.Component);

Field.contextTypes = _contextType2.default;
Field.defaultProps = {
  type: '',
  exclusive: false
};


Field.propTypes = {
  /**
   * The Field name, which should be path corresponding to a specific form `value` path.
   *
   * ```js
   * // given the form value
   * value = {
   *   name: { first: '' }
   *   languages: ['english', 'spanish']
   * }
   *
   * // the path "name.first" would update the "first" property of the form value
   * <Form.Field name='name.first' />
   *
   * // use indexes for paths that cross arrays
   * <Form.Field name='languages[0]' />
   *
   * ```
   */
  name: _react2.default.PropTypes.string.isRequired,

  /**
   * Group Fields together with a common `group` name. Groups can be
   * validated together, helpful for multi-part forms.
   *
   * ```editable
   * <Form
   *   schema={modelSchema}
   *   defaultValue={modelSchema.default()}
   * >
   *
   *   <Form.Field
   *     name='name.first'
   *     group='name'
   *     placeholder='first'
   *   />
   *   <Form.Field
   *     name='name.last'
   *     group='name'
   *     placeholder='surname'
   *   />
   *   <Form.Message for={['name.first', 'name.last']}/>
   *
   *   <Form.Field
   *     name='dateOfBirth'
   *     placeholder='dob'
   *   />
   *
   *   <Form.Button group='name'>
   *     Validate Name
   *   </Form.Button>
   * </Form>
   * ```
   */
  group: _react2.default.PropTypes.string,

  /**
   * The Component Input the form should render. You can sepcify a builtin type
   * with a string name e.g `'text'`, `'datetime-local'`, etc. or provide a Component
   * type class directly. When no type is provided the Field will attempt determine
   * the correct input from the corresponding scheme. A Field corresponding to a `yup.number()`
   * will render a `type='number'` input by default.
   *
   * ```editable
   * <Form noValidate schema={modelSchema}>
   *   Use the schema to determine type
   *   <Form.Field
   *     name='dateOfBirth'
   *     placeholder='date'
   *   />
   *
   *   Override it!
   *   <Form.Field
   *     name='dateOfBirth'
   *     type='time'
   *     placeholder='time only'
   *   />
   *
   *   Use a custom Component
   *   (need native 'datetime' support to see it)
   *   <Form.Field
   *     name='dateOfBirth'
   *     type={MyDateInput}/>
   *
   * </Form>
   * ```
   * Custom Inputs should comply with the basic input api contract: set a value via a `value` prop and
   * broadcast changes to that value via an `onChange` handler.
   *
   * You can also permenantly map Components to a string `type` name via the top-level
   * `addInputType()` api.
   */
  type: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string]),

  /**
   * Event name or array of event names that the Field should trigger a validation.
   */
  events: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),

  /**
   * Customize how the Field value maps to the overall Form `value`.
   * `mapFromValue` can be a a string property name or a function that returns a
   * value for `name`'d path, allowing you to set commuted values from the Field.
   *
   * ```js
   * <Form.Field name='name'
   *   mapFromValue={fieldValue => fieldValue.first + ' ' + fieldValue.last}
   * />
   * ```
   *
   * You can also provide an object hash, mapping paths of the Form `value`
   * to fields in the field value using a string field name, or a function accessor.
   *
   * ```editable
   * <Form
   *   schema={modelSchema}
   *   defaultValue={modelSchema.default()}
   * >
   *   <label>Name</label>
   *   <Form.Field
   *     name='name.first'
   *     placeholder='First name'
   *   />
   *
   *   <label>Date of Birth</label>
   *   <Form.Field name='dateOfBirth'
   *     mapFromValue={{
   *       'dateOfBirth': date => date,
   *       'age': date =>
   *         (new Date()).getFullYear() - date.getFullYear()
   *   }}/>
    *   <label>Age</label>
   *   <Form.Field name='age'/>
   *
   *   <Form.Button type='submit'>Submit</Form.Button>
   * </Form>
   * ```
   */
  mapFromValue: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.string, _react2.default.PropTypes.object]),

  /**
   * Map the Form value to the Field value. By default
   * the `name` of the Field is used to extract the relevant
   * property from the Form value.
   *
   * ```js
   * <Form.Field
   *   name='location'
   *   type="dropdownlist"
   *   mapToValue={model=> pick(model, 'location', 'locationId')}
   * />
   * ```
   */
  mapToValue: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.func, _react2.default.PropTypes.object]),

  /**
   * The css class added to the Field Input when it fails validation
   */
  errorClass: _react2.default.PropTypes.string,

  /**
   * Tells the Field to trigger validation for addition paths as well as its own (`name`).
   * Useful when used in conjuction with a `mapFromValue` hash that updates more than one value, or
   * if you want to trigger validation for the parent path as well.
   *
   * ```js
   * <Form.Field name='name.first' alsoValidates="name" />
   * <Form.Field name='name.last' alsoValidates={['name', 'surname']} />
   * ```
   */
  alsoValidates: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),

  /**
   * Indicates whether child fields of the named field
   * affect the active state ofthe field.
   *
   * ```js
   * -> 'names'
   * -> 'names.first'
   * -> 'names.last'
   * ```
   *
   * Are all considered "part" of a field named `'names'` by default.
   */
  exclusive: _react2.default.PropTypes.bool,

  /**
   * Disables validation for the Field.
   */
  noValidate: _react2.default.PropTypes.bool,

  /**
   * When children is the traditional react element or nodes, they are
   * passed through as-is to the Field `type` component.
   *
   * ```jsx
   * <Field type='select'>
   *   <option>red</option>
   *   <option>red</option>
   * </Field>
   * ```
   *
   * When `children` is a function, its called with the processed field
   * props and the resolved Field Input component, for more advanced use cases
   *
   * ```jsx
   * <Field name='birthDate'>
   *  {(props, Input) =>
   *    <DataProvider>
   *      <Input {...props} />
   *    </DataProvider>
   *  }
   * </Field>
   * ```
   */
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.node, _react2.default.PropTypes.func]),

  /**
   * Instruct the field to not inject the `meta` prop into the input
   */
  noMeta: _react2.default.PropTypes.bool
};

exports.default = Field;
module.exports = exports['default'];