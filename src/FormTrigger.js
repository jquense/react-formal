import PropTypes from 'prop-types'
import React from 'react'
import createBridge from 'topeka/createChildBridge'
import warning from 'warning'
import FormContext from './FormContext'
import { filterAndMapMessages, namesForGroup } from './utils/ErrorUtils'

let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
])

const channels = ['messages', 'groups', 'form', 'submitting']

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

    this.renderChild = createBridge(this.handleEvent, props =>
      this.props.children({
        props,
        messages: this.messages || {},
        submitting: this.submitting,
      })
    )
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
    let { for: name, group, mapMessages, formKey } = this.props

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
          this.messages = filterAndMapMessages({
            messages,
            mapMessages,
            names: this.names,
          })

          this.submitting = !!submitting
          return this.renderChild(this.props.events)
        }}
      </FormContext.Subscriber>
    )
  }
}

export default FormTrigger
