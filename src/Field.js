
import cn from 'classnames';
import omit from 'lodash/omit';
import React from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';
import MessageTrigger from 'react-input-message/MessageTrigger';
import { Binding } from 'topeka';
import invariant from 'invariant';

import isNativeType from './util/isNativeType';
import resolveFieldComponent from './util/resolveFieldComponent'
import contextTypes from './util/contextType';
import config from './config';
import isReactComponent from './util/isReactComponent';
import { inclusiveMapMessages } from './util/ErrorUtils';

function notify(handler, args) {
  handler && handler(...args)
}

function getValue(value, bindTo, getter) {
  if (typeof bindTo === 'function') {
    return bindTo(value, getter)
  }
  if (typeof bindTo === 'string') {
    return getter(bindTo, value)
  }

  return Object.keys(bindTo).reduce((obj, key) => {
    obj[key] = getValue(value, bindTo[key], getter);
    return obj
  }, {})
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
class Field extends React.Component {

  static contextTypes = contextTypes

  static defaultProps = {
    type: '',
    exclusive: false
  }

  shouldComponentUpdate(nextProps, _, nextContext) {
    return (
      !shallowEqual(nextProps, this.props) ||
      !shallowEqual(nextContext, this.context)
    );
  }

  componentWillMount() {
    let { name } = this.props
      , context = this.context.reactFormalContext;

    this.eventHandlers = {};
    this.createEventHandlers(this.props)

    if (process.env.NODE_ENV !== 'production')
      invariant(context.noValidate || !name || this.schema(name),
        `There is no corresponding schema defined for this field: "${name}" ` +
        `Each Field's \`name\` prop must be a valid path defined by the parent Form schema`
      )
  }

  onError = (errors) => {
    let { name } = this.props
      , context = this.context.reactFormalContext;

    context.onFieldError(name, errors);
  }

  bindTo = (_value, getter) => {
    let { mapToValue, name } = this.props;
    let value = getValue(_value, mapToValue || name, getter);

    // ensure that no inputs are left uncontrolled
    if (value === undefined)
     value = null;

    return value;
  }

  // create a set of handlers with a stable identity so as not to
  // thwart SCU checks
  createEventHandlers({ events = config.events }) {
    if (events == null) return;

    [].concat(events).forEach(event => {
      let handler = (...args) => {
        notify(this._fieldProps[event], args)
        notify(this._bindingProps[event], args)
        notify(this._triggerProps[event], args)
      }
      this.eventHandlers[event] = this.eventHandlers[event] || handler
    })
  }

  constructComponent = (bindingProps, triggerProps = {}) => {
    let {
      name,
      type,
      children,
      className,
      errorClass = config.errorClass,
    } = this.props;

    let fieldProps = omit(this.props, Object.keys(Field.propTypes))

    fieldProps = Object.assign(
      { name },
      this._fieldProps = fieldProps,
      this._bindingProps = bindingProps,
      this._triggerProps = triggerProps,
      this.eventHandlers
    )

    let schema = this.schema(name);
    let [Component, resolvedType] = resolveFieldComponent(type, schema)

    fieldProps.type = isNativeType(resolvedType)
      ? resolvedType : undefined;

    let meta = {
      resolvedType,
      errorClass,
      schema,
      onError: this.onError
    }

    if (this.context.reactFormalContext) {
      meta.context = this.context.reactFormalContext.options.context // lol
    }

    if (this.shouldValidate()) {
      let { messages } = fieldProps
      let invalid = messages && !!Object.keys(messages).length

      meta.errors = messages
      meta.invalid = invalid
      meta.valid = !meta.invalid

      fieldProps.className = cn(className, invalid && errorClass)

      delete fieldProps.messages
    }

    if (!this.props.noMeta)
      fieldProps.meta = meta;

    // Escape hatch for more complex Field types.
    if (typeof children === 'function') {
      return children(fieldProps, Component)
    }

    return (
      <Component
        {...fieldProps}
        ref={isReactComponent(Component)
          ? r => this.input = r
          : null
        }
      >
        {children}
      </Component>
    )
  }

  render() {
    let {
        name
      , group
      , exclusive
      , mapFromValue
      , alsoValidates
      , events = config.events } = this.props;

    let mapMessages = !exclusive ? inclusiveMapMessages : undefined;

    if (typeof mapFromValue !== 'object')
      mapFromValue = { [name]: mapFromValue }

    if (!this.shouldValidate()) {
      return (
        <Binding bindTo={this.bindTo} mapValue={mapFromValue}>
          {this.constructComponent}
        </Binding>
      )
    }

    if (alsoValidates != null) {
      name = [name].concat(alsoValidates)
    }

    return (
      <Binding bindTo={this.bindTo} mapValue={mapFromValue}>
        {(bindingProps) => (
          <MessageTrigger
            for={name}
            group={group}
            events={events}
            mapMessages={mapMessages}
          >
            {triggerProps => this.constructComponent(
              bindingProps,
              triggerProps
            )}
          </MessageTrigger>
        )}
      </Binding>
    )
  }

  schema(path) {
    let schema;
    let context = this.context.reactFormalContext;
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
    return this.input
  }
}


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
  mapFromValue: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.string,
    React.PropTypes.object
  ]),

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
  mapToValue: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.object
  ]),

  /**
   * The css class added to the Field Input when it fails validation
   */
  errorClass: React.PropTypes.string,

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
  alsoValidates:React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.arrayOf(React.PropTypes.string)
  ]),

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
  exclusive: React.PropTypes.bool,

  /**
   * Disables validation for the Field.
   */
  noValidate: React.PropTypes.bool,

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
  children: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.func,
  ]),

  /**
   * Instruct the field to not inject the `meta` prop into the input
   */
  noMeta: React.PropTypes.bool,
}

export default Field;
