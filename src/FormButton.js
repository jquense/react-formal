import chain from 'chain-function'
import PropTypes from 'prop-types'
import React from 'react'
import warning from 'warning'

import { withState } from './FormContext'

function notify(handler, args) {
  handler && handler(...args)
}

/**
 * A Form Button, for triggering validations for specific Field groups
 */
class FormButton extends React.Component {
  static propTypes = {
    /**
     * The `<button/>` type
     */
    type: PropTypes.oneOf(['button', 'submit']),

    /**
     * Specify particular fields to validate in the related form. If empty the entire form will be validated.
     * If the button type is 'submit' the group will be ignored and the
     * entire form will be validated prior to submission.
     */
    triggers: PropTypes.arrayOf(PropTypes.string.isRequired),

    /**
     * The key of `Form` that "owns" this button. Validation will be triggered
     * only for that `Form`.
     */
    formKey: PropTypes.string,

    /**
     * When a function, `children` is called with the Form submitting state
     *
     * ```js
     * <Form.Button>
     *   {submitting => submitting ? 'Saving…' : 'Submit'}
     * </Form.Button>
     * ```
     */
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * An array of event names that trigger validation.
     *
     * @default 'onClick'
     */
    events: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    type: 'button',
    component: 'button',
    events: ['onClick'],
  }

  constructor(...args) {
    super(...args)
    this.eventHandlers = {}

    const { events } = this.props

    if (events) {
      ;[].concat(events).forEach(event => {
        let handler = (...args) => {
          this.props[event] && this.props[event](args)

          this.handleValidateField(event, args)
        }

        this.eventHandlers[event] = this.eventHandlers[event] || handler
      })
    }
  }

  handleSubmit(event, args) {
    const { formMethods, triggers, formKey } = this.props
    if (!formMethods) {
      return warning(
        false,
        (!triggers ? 'A Form submit event ' : `A validation for ${triggers} `) +
          `was triggered from a component outside the context of a Form. ` +
          `The Field, Button, or Trigger should be wrapped in a Form or Form.Context component` +
          (formKey ? ` with the formKey: "${formKey}" ` : '.')
      )
    }

    if (triggers && triggers.length)
      formMethods.onValidate(triggers, event, args)
  }
  render() {
    let {
      events,
      triggers,
      component: Component,
      formKey,
      children,
      ...props
    } = this.props

    if (events)
      for (let event of [].concat(events))
        this.eventHandlers[event] =
          this.eventHandlers[event] ||
          ((...args) => {
            this.props[event] && this.props[event](args)
            this.handleSubmit()
          })

    return (
      <Trigger formKey={formKey} events={events}>
        {meta =>
          typeof children === 'function' ? (
            children({
              ...meta,
              props: mergeWithEvents(events, [props, meta.props]),
            })
          ) : (
            <Component {...mergeWithEvents(events, [props, meta.props])}>
              {children}
            </Component>
          )
        }
      </Trigger>
    )
  }
}

export default withState(
  (formMethods, messages, submitting) => <FormButton />,
  [
    state => state.formMethods,
    state => state.messages,
    state => state.submitting,
  ]
)
