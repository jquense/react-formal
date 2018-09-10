import PropTypes from 'prop-types'
import React from 'react'
import warning from 'warning'
import memoize from 'memoize-one'
import elementType from 'prop-types-extra/lib/elementType'

import createEventHandler from './utils/createEventHandler'
import { filterAndMapErrors } from './utils/ErrorUtils'
import { withState, FORM_DATA, FormActionsContext } from './Contexts'

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
    as: elementType,

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
    errors: PropTypes.object,
    /** @private */
    actions: PropTypes.object,
    /** @private */
    submits: PropTypes.object,
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

    this.memoFilterAndMapErrors = memoize(
      filterAndMapErrors,
      (a, b) =>
        a.errors === b.errors &&
        a.names === b.names &&
        a.maperrors === b.maperrors
    )
  }

  handleSubmit(event, args) {
    const { actions, triggers } = this.props
    if (!actions) {
      return warning(
        false,
        'A Form submit event ' +
          'was triggered from a component outside the context of a Form. ' +
          'The Button should be wrapped in a Form component'
      )
    }

    if (triggers && triggers.length) actions.onValidate(triggers, event, args)
    else actions.onSubmit()
  }

  render() {
    let {
      events,
      triggers,
      children,
      errors,
      submits,
      as: Component,
      actions: _1,
      ...props
    } = this.props

    const partial = triggers && triggers.length
    if (partial) {
      errors = this.memoFilterAndMapErrors({ errors, names: triggers })
    }

    props = Object.assign(props, this.getEventHandlers(events))

    return typeof children === 'function' ? (
      children({ errors, props, ...submits })
    ) : (
      <Component type={partial ? 'button' : 'submit'} {...props}>
        {children}
      </Component>
    )
  }
}

export default withState(
  (ctx, props, ref) => (
    <FormActionsContext.Consumer>
      {actions => (
        <FormSubmit
          {...props}
          ref={ref}
          actions={actions}
          submits={ctx.submits}
          errors={ctx.errors}
        />
      )}
    </FormActionsContext.Consumer>
  ),
  FORM_DATA.errors | FORM_DATA.SUBMITS
)
