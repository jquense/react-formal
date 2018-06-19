import PropTypes from 'prop-types'
import React from 'react'
import warning from 'warning'
import memoize from 'memoize-one'

import { withState2 } from './FormContext'
import { filterAndMapMessages } from './utils/ErrorUtils'

let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
])

export const filterAndMap = memoize(
  filterAndMapMessages,
  (a, b) =>
    a.messages === b.messages &&
    a.names === b.names &&
    a.mapMessages === b.mapMessages
)

class FormTrigger extends React.Component {
  static propTypes = {
    formKey: PropTypes.string,

    noValidate: PropTypes.bool.isRequired,
    events: stringOrArrayOfStrings,
    for: PropTypes.string,
    triggers: PropTypes.arrayOf(PropTypes.string),

    mapMessages: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

    group: stringOrArrayOfStrings,
  }

  static defaultProps = {
    events: 'onChange',
    noValidate: false,
  }

  constructor(...args) {
    super(...args)

    this.getBridgeProps = createBridge(this.handleEvent)
  }

  componentWillUnmount() {
    this.removeFromGroup && this.removeFromGroup()
  }

  handleEvent = (event, ...args) => {
    let { noValidate, formKey, triggers, group } = this.props

    let names = triggers || this.names
    if (noValidate || !names) return

    if (!this.form) {
      return warning(
        false,
        (group === '@submit'
          ? 'A Form submit event '
          : `A validation for ${names} `) +
          `was triggered from a component outside the context of a Form. ` +
          `The Field, Button, or Trigger should be wrapped in a Form or Form.Context component` +
          (formKey ? ` with the formKey: "${formKey}" ` : '.')
      )
    }

    if (group === '@submit') return this.form.onSubmit()

    this.form.onValidate(names, event, args)
  }

  render() {
    let { for: names, messages, submitting, events } = this.props

    return (
      <FormContext.Subscriber formKey={formKey} channels={channels}>
        {(messages, groups, form, submitting) => {
          if (
            form &&
            !this.removeFromGroup &&
            name &&
            group &&
            group !== '@submit'
          ) {
            this.removeFromGroup = form.addToGroup(name, group)
          }

          this.form = form
          this.names = name || namesForGroup(group, groups)
          messages = this.submitting = !!submitting

          return this.props.children({
            props: this.getBridgeProps(this.props.events),
            submitting,
            messages,
          })
        }}
      </FormContext.Subscriber>
    )
  }
}

function FormTrigger(
  messages = {},
  onSubmit,
  onValidate,
  submitting = false,
  props,
  ref
) {
  let {
    for: names,
    formKey,
    triggers,
    noValidate = false,
    events = 'onChange',
  } = props

  const eventHandlers = {}
  for (const event of [].concat(events)) {
    eventHandlers[event] = (...args) => {
      let fieldsToValidate = triggers || names

      if (noValidate) return

      if (!onSubmit) {
        return warning(
          false,
          (!fieldsToValidate
            ? 'A Form submit event '
            : `A validation for ${fieldsToValidate} `) +
            `was triggered from a component outside the context of a Form. ` +
            `The Field, Button, or Trigger should be wrapped in a Form or Form.Context component` +
            (formKey ? ` with the formKey: "${formKey}" ` : '.')
        )
      }

      if (!fieldsToValidate) onSubmit()
      else onValidate(fieldsToValidate, event, args)
    }
  }

  return props.children({
    ref,
    submitting,
    messages,
    props: eventHandlers,
  })
}

export default withState(
  FormTrigger,
  [
    (state, props) =>
      state &&
      filterAndMap({
        messages: state.messages,
        names: props.for,
        mapMessages: props.mapMessages,
      }),
    state => state && state.onSubmit,
    state => state && state.onValidate,
    state => state && state.submitting,
  ],
  {
    displayName: 'FormTrigger',
  }
)
