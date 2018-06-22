import PropTypes from 'prop-types'
import React from 'react'
import warning from 'warning'
import memoize from 'memoize-one'

import createEventHandler from './utils/createEventHandler'
import { filterAndMapMessages } from './utils/ErrorUtils'
import { withState } from './FormContext'

/**
 * A Form submit button, for triggering validations for the entire form or specific fields.
 */
class FormSubmit extends React.Component {
  static propTypes = {
    /**
     * The `<button/>` type
     */
    type: PropTypes.oneOf(['button', 'submit']),

    /**
     * Specify particular fields to validate in the related form. If empty the entire form will be validated.
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
     * <Form.Submit>
     *   {submitting => submitting ? 'Saving…' : 'Submit'}
     * </Form.Submit>
     * ```
     */
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    /** Control the rendering of the Form Submit component. */
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * A string or array of event names that trigger validation.
     *
     * @default 'onClick'
     */
    events: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),

    /** @private */
    messages: PropTypes.object,
    /** @private */
    formMethods: PropTypes.object,
    /** @private */
    submitting: PropTypes.bool,
  }

  static defaultProps = {
    as: 'button',
    events: ['onClick'],
  }

  constructor(...args) {
    super(...args)
    this.eventHandlers = {}

    this.getEventHandlers = createEventHandler(event => (...args) => {
      this.props[event] && this.props[event](args)
      this.handleSubmit()
    })

    this.memoFilterAndMapMessages = memoize(
      filterAndMapMessages,
      (a, b) =>
        a.messages === b.messages &&
        a.names === b.names &&
        a.mapMessages === b.mapMessages
    )
  }

  handleSubmit(event, args) {
    const { formMethods, triggers, formKey } = this.props
    if (!formMethods) {
      return warning(
        false,
        'A Form submit event ' +
          'was triggered from a component outside the context of a Form. ' +
          'The Button should be wrapped in a Form or Form.Context component' +
          (formKey ? ` with the formKey: "${formKey}" ` : '.')
      )
    }

    if (triggers && triggers.length)
      formMethods.onValidate(triggers, event, args)
    else formMethods.onSubmit()
  }

  render() {
    let {
      events,
      triggers,
      children,
      messages,
      submitting = false,
      as: Component,
      formKey: _0,
      formMethods: _1,
      ...props
    } = this.props

    const partial = triggers && triggers.length
    if (partial) {
      messages = this.memoFilterAndMapMessages({ messages, names: triggers })
    }

    props = Object.assign(props, this.getEventHandlers(events))

    return typeof children === 'function' ? (
      children({ messages, props, submitting })
    ) : (
      <Component type={partial ? 'button' : 'submit'} {...props}>
        {children}
      </Component>
    )
  }
}

export default withState(
  (formMethods, messages, submitting, props) => (
    <FormSubmit
      {...props}
      formMethods={formMethods}
      messages={messages}
      submitting={submitting}
    />
  ),
  [
    state => state.formMethods,
    state => state.messages,
    state => state.submitting,
  ]
)
