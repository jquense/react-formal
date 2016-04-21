import React from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';
import MessageTrigger from 'react-input-message/MessageTrigger';
import invariant from 'invariant';
import types from './util/types';
import contextTypes from './util/contextType';
import config from './config';
import Input from './inputs/Input';
import isReactComponent from './util/isReactComponent';
import cn from 'classnames';
import { Binding } from 'topeka';

var options = { recurse: undefined }

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
class Field extends React.Component {

  static contextTypes = contextTypes

  static propTypes = {
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
    name: React.PropTypes.string.isRequired,

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
    group: React.PropTypes.string,

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
    type: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string
          ]),

    /**
     * Event name or array of event names that the Field should trigger a validation.
     */
    events: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]),

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
    mapValue: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string,
            React.PropTypes.object
          ]),

    /**
     * The css class added to the Field Input when it fails validation
     */
    errorClass: React.PropTypes.string,

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
    alsoValidates: React.PropTypes.arrayOf(React.PropTypes.string),

    /**
     * Specify whether the Field will recursively validate sub paths.
     * The below example will also validate `name.first` and `name.last`. Generally you won't need to touch this
     * as `react-formal` makes some intelligent choices about whether to recurse or not on any given path.
     *
     * ```js
     * <Form.Field name='name' recursive={true}/>
     * ```
     */
    recursive: React.PropTypes.string,

    /**
     * Disables validation for the Field.
     */
    noValidate: React.PropTypes.bool
  }

  static defaultProps = {
    type: ''
  }

  constructor() {
    super()
    this._inject = this._inject.bind(this)
  }

  componentWillMount() {
    let { name } = this.props
      , context = this.context.reactFormalContext;

    if (process.env.NODE_ENV !== 'production')
      invariant(context.noValidate || !name || this.schema(name),
        `There is no corresponding schema defined for this field: "${name}" ` +
        `Each Field's \`name\` prop must be a valid path defined by the parent Form schema`)

    context.onOptions(this.props.name, this.options(this.props))
  }

  componentWillReceiveProps(nextProps) {
    let context = this.context.reactFormalContext;

    context.onOptions(nextProps.name, this.options(nextProps))
  }

  shouldComponentUpdate(nextProps, _, nextContext) {
    //return scu.call(this, nextProps, nextState)
    let result = !shallowEqual(nextProps, this.props)
              || !shallowEqual(nextContext, this.context);

    return result
  }

  render() {
    let {
        events
      , group
      , mapValue
      , name
      , type
      , valueAccessor
      , ...props } = this.props;

    let schema = this.schema(name)
      , Widget = this.getComponent(type, schema, props);

    if (valueAccessor && typeof mapValue !== 'object')
      mapValue = { [name]: mapValue}

    let forProp = props.alsoValidates == null
      ? name : [ name ].concat(props.alsoValidates)

    return (
      <Binding
        bindTo={valueAccessor || name}
        mapValue={mapValue}
      >
        { bind => !this.shouldValidate()
          ? bind(Widget)
          : (
            <MessageTrigger
              for={forProp}
              group={group}
              events={events || config.events}
              inject={this._inject}
            >
              { bind(Widget) }
            </MessageTrigger>
          )
        }
      </Binding>
    )
  }

  _inject(child, isActive) {
    let errorClass = this.props.errorClass !== undefined
      ? this.props.errorClass : config.errorClass;

    return {
      className: cn(child.props.className, isActive && errorClass)
    }
  }

  options(props) {
    if (options.recursive !== props.recursive)
      options = { recursive: props.recursive };

    return options
  }

  getComponent(type, schema, props) {
    if (!type && schema) {
      let meta = (schema.meta && schema.meta()) || {};
      type = meta[config.metadataField] || schema._type
    }

    let typeIsString = typeof type === 'string'
      , Widget = type

    if (typeIsString) {
      Widget = types[type.toLowerCase()] || Input
      props.type = type
    }

    return (
      <Widget
        ref={isReactComponent(Widget) ? 'input' : null}
        {...props}
        name={this.props.name}
      />
    )
  }

  schema(path) {
    let context = this.context.reactFormalContext;
    let schema;
    try {
      schema = path && context.schema && context.schema(path)
    }
    catch (err) {} // eslint-disable-line no-empty

    return schema
  }

  shouldValidate() {
    let context = this.context.reactFormalContext;
    return !(this.props.noValidate || context.noValidate)
  }

  inputInstance() {
    return this.refs.input
  }
}

module.exports = Field;
