'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderShallowEqual = require('react-pure-render/shallowEqual');

var _reactPureRenderShallowEqual2 = _interopRequireDefault(_reactPureRenderShallowEqual);

var _reactInputMessageMessageTrigger = require('react-input-message/MessageTrigger');

var _reactInputMessageMessageTrigger2 = _interopRequireDefault(_reactInputMessageMessageTrigger);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utilTypes = require('./util/types');

var _utilTypes2 = _interopRequireDefault(_utilTypes);

var _utilContextType = require('./util/contextType');

var _utilContextType2 = _interopRequireDefault(_utilContextType);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _inputsInput = require('./inputs/Input');

var _inputsInput2 = _interopRequireDefault(_inputsInput);

var _utilIsReactComponent = require('./util/isReactComponent');

var _utilIsReactComponent2 = _interopRequireDefault(_utilIsReactComponent);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _topeka = require('topeka');

var _options = { recurse: undefined };

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

var Field = (function (_React$Component) {
  _inherits(Field, _React$Component);

  _createClass(Field, null, [{
    key: 'contextTypes',
    value: _utilContextType2['default'],
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
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
      name: _react2['default'].PropTypes.string.isRequired,

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
      group: _react2['default'].PropTypes.string,

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
      type: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.string]),

      /**
       * Event name or array of event names that the Field should trigger a validation.
       */
      events: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string)]),

      /**
       * Customize how the Field value maps to the overall Form `value`.
       * `mapValue` can be a a string property name or a function that returns a
       * value for `name`'d path, allowing you to set commuted values from the Field.
       *
       * ```js
       * <Form.Field name='name'
       *   mapValue={fieldValue => fieldValue.first + ' ' + fieldValue.last}
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
       *     mapValue={{
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
      mapValue: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.string, _react2['default'].PropTypes.object]),

      /**
       * The css class added to the Field Input when it fails validation
       */
      errorClass: _react2['default'].PropTypes.string,

      /**
       * Tells the Field to trigger validation for addition paths as well as its own (`name`).
       * Useful when used in conjuction with a `mapValue` hash that updates more than one value, or
       * if you want to trigger validation for the parent path as well.
       *
       * ```js
       * <Form.Field name='name.first' alsoValidates={['name']}/>
       * <Form.Field name='name.last' alsoValidates={['name']}/>
       * ```
       */
      alsoValidates: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),

      /**
       * Specify whether the Field will recursively validate sub paths.
       * The below example will also validate `name.first` and `name.last`. Generally you won't need to touch this
       * as `react-formal` makes some intelligent choices about whether to recurse or not on any given path.
       *
       * ```js
       * <Form.Field name='name' recursive={true}/>
       * ```
       */
      recursive: _react2['default'].PropTypes.string,

      /**
       * Disables validation for the Field.
       */
      noValidate: _react2['default'].PropTypes.bool
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      type: ''
    },
    enumerable: true
  }]);

  function Field() {
    _classCallCheck(this, Field);

    _React$Component.call(this);
    this._inject = this._inject.bind(this);
  }

  Field.prototype.componentWillMount = function componentWillMount() {
    var name = this.props.name;
    var context = this.context.reactFormalContext;

    if (process.env.NODE_ENV !== 'production') _invariant2['default'](context.noValidate || !name || this.schema(name), 'There is no corresponding schema defined for this field: "' + name + '" ' + 'Each Field\'s `name` prop must be a valid path defined by the parent Form schema');

    context.onOptions(this.props.name, this.options(this.props));
  };

  Field.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var context = this.context.reactFormalContext;

    context.onOptions(nextProps.name, this.options(nextProps));
  };

  Field.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, _, nextContext) {
    //return scu.call(this, nextProps, nextState)
    var result = !_reactPureRenderShallowEqual2['default'](nextProps, this.props) || !_reactPureRenderShallowEqual2['default'](nextContext, this.context);

    return result;
  };

  Field.prototype.render = function render() {
    var _mapValue,
        _this = this;

    var _props = this.props;
    var events = _props.events;
    var group = _props.group;
    var mapValue = _props.mapValue;
    var name = _props.name;
    var type = _props.type;
    var valueAccessor = _props.valueAccessor;

    var props = _objectWithoutProperties(_props, ['events', 'group', 'mapValue', 'name', 'type', 'valueAccessor']);

    var schema = this.schema(name),
        Widget = this.getComponent(type, schema, props);

    if (valueAccessor && typeof mapValue !== 'object') mapValue = (_mapValue = {}, _mapValue[name] = mapValue, _mapValue);

    var forProp = props.alsoValidates == null ? name : [name].concat(props.alsoValidates);

    return _react2['default'].createElement(
      _topeka.Binding,
      {
        bindTo: valueAccessor || name,
        mapValue: mapValue
      },
      function (bind) {
        return !_this.shouldValidate() ? bind(Widget) : _react2['default'].createElement(
          _reactInputMessageMessageTrigger2['default'],
          {
            'for': forProp,
            group: group,
            events: events || _config2['default'].events,
            inject: _this._inject
          },
          bind(Widget)
        );
      }
    );
  };

  Field.prototype._inject = function _inject(child, isActive) {
    var errorClass = this.props.errorClass !== undefined ? this.props.errorClass : _config2['default'].errorClass;

    return {
      className: _classnames2['default'](child.props.className, isActive && errorClass)
    };
  };

  Field.prototype.options = function options(props) {
    if (_options.recursive !== props.recursive) _options = { recursive: props.recursive };

    return _options;
  };

  Field.prototype.getComponent = function getComponent(type, schema, props) {
    if (!type && schema) {
      var meta = schema.meta && schema.meta() || {};
      type = meta[_config2['default'].metadataField] || schema._type;
    }

    var typeIsString = typeof type === 'string',
        Widget = type;

    if (typeIsString) {
      Widget = _utilTypes2['default'][type.toLowerCase()] || _inputsInput2['default'];
      props.type = type;
    }

    return _react2['default'].createElement(Widget, _extends({
      ref: _utilIsReactComponent2['default'](Widget) ? 'input' : null
    }, props, {
      name: this.props.name
    }));
  };

  Field.prototype.schema = function schema(path) {
    var context = this.context.reactFormalContext;
    var schema = undefined;
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
    return this.refs.input;
  };

  return Field;
})(_react2['default'].Component);

module.exports = Field;