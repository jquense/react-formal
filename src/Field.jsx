'use strict';
var React = require('react')
  , invariant = require('scoped-invariant')('react-formal')
  , types = require('./util/types')
  , Input   = require('./inputs/Input');

var has = {}.hasOwnProperty
  , MessageTrigger = require('react-input-message/lib/MessageTrigger');

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
 * <Form noValidate
 *   schema={modelSchema}
 *   defaultValue={{ name: { first: 'Sally'}, colorID: 0 }}
 * >
 *   <label>Name</label>
 *   <Form.Field name='name.first' placeholder='First name'/>
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

  static _isYupFormField = true

  static contextTypes = {
    schema:     React.PropTypes.func,
    onChange:   React.PropTypes.func,
    value:      React.PropTypes.func,
    noValidate: React.PropTypes.func,
  }

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
     * <Form schema={modelSchema} defaultValue={modelSchema.default()}>
     *
     *   <Form.Field name='name.first' group='name'
     *     placeholder='first'/>
     *
     *   <Form.Field name='name.last' group='name'
     *     placeholder='surname'/>
     *
     *   <Form.Message for={['name.first', 'name.last']}/>
     *
     *   <Form.Field name='dateOfBirth' placeholder='dob'/>
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
     *     placeholder='date'/>
     *
     *   Override it!
     *   <Form.Field name='dateOfBirth'
     *       type='time'
     *       placeholder='time only'/>
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
            React.PropTypes.string,
          ]),

    /**
     * An array of event names that the Field should trigger a validation.
     */
    events: React.PropTypes.arrayOf(
              React.PropTypes.string),

    /**
     * Customize how the Field value maps to the overall Form `value`.
     * `mapValue` can be a function that returns a value for `name`'d path, allowing
     * you to set commuted values from the Field.
     *
     * ```js
     * <Form.Field name='name'
     *   mapValue={ fieldValue => fieldValue.first + ' ' + fieldValue.last }
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
     *   <Form.Field name='name.first' placeholder='First name'/>
     *
     *   <label>Date of Birth</label>
     *   <Form.Field name='dateOfBirth'
     *     mapValue={{
     *       'dateOfBirth': date => date,
     *       'age': date =>
     *       (new Date()).getFullYear() - date.getFullYear()
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
            React.PropTypes.object,
          ]),

    /**
     * The css class added to the Field Input when it fails validation
     */
    errorClass: React.PropTypes.string,

    /**
     * Tells the Field to trigger validation for addition paths as well as its own (`name`).
     * Useful when used in conjuction with a `mapValue` hash that updates more than one value.
     *
     * ```js
     * <Form.Field name='name'
     *   mapValue={{
     *     'name.first': 'first',
     *     'name.last':  'surname'
     *   }}
     *   alsoValidates={['name.first', 'name.last']}
     * />
     * ```
     */
    alsoValidates: React.PropTypes.arrayOf(React.PropTypes.string),

    /**
     * Disables validation for the Field.
     */
    noValidate: React.PropTypes.bool
  }

  static defaultProps = {
    type: '',
    events: ['onChange', 'onBlur'],
    errorClass: 'invalid-field'
  }

  componentWillMount() {
    if ( process.env.NODE_ENV !== 'production' )
      invariant(
           this.getContext().noValidate()
        || !!this.getContext().schema(this.props.name),
        `There is no corresponding schema defined for this field: "${this.props.name}" ` +
        `Each Field's \`name\` prop must be a valid path defined by the parent Form schema`)
  }

  render() {
    var {
        events
      , group
      , mapValue
      , name
      , ...props } = this.props
      , schema = this.getContext().schema(name)
      , value  = this.getContext().value(name)
      , type   = this.props.type || (schema && schema._type) || ''
      , Widget = type;

    Widget = typeof this.props.type === 'function'
      ? ((type = undefined), this.props.type)
      : types[type.toLowerCase()] || Input

    Widget = (
      <Widget 
        name={name}
        type={type}
        value={value}
        {...props}
        onChange={this._change.bind(this)}/>
    )

    if ( this.props.noValidate || this.getContext().noValidate() )
      return Widget

    name = props.alsoValidates == null ? name : [name].concat(props.alsoValidates)

    return (
      <MessageTrigger for={name} group={group} events={events} activeClass={props.errorClass}>
        { Widget }
      </MessageTrigger>
    )
  }

  _change(...args){
    this.getContext().onChange(this.props.name, this.props.mapValue, args[0])
    this.props.onChange
      && this.props.onChange(...args)
  }

  getContext(){
    return this._reactInternalInstance._context
  }
}

module.exports = Field;

