import React from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'

import mergeWithEvents from './utils/chainEvents'
import Trigger from './MessageTrigger'

/**
 * A Form Button, for triggering validations for specific Field groups
 */
class Button extends React.Component {
  static propTypes = {
    /**
     * The `<button/>` type
     */
    type: PropTypes.oneOf(['button', 'submit']),

    /**
     * Specify a group to validate, if empty the entire form will be validated.
     * If the button type is 'submit' the group will be ignored and the
     * entire form will be validated prior to submission.
     */
    group: PropTypes.string,

    /**
     * The key of `Form` that "owns" this button. Validation will be triggered
     * only for that `Form`.
     */
    formKey: PropTypes.string,

    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    /**
     * An array of event names that trigger validation.
     */
    events: PropTypes.arrayOf(PropTypes.string),

    onClick: PropTypes.func,
  }

  static defaultProps = {
    type: 'button',
    component: 'button',
    events: ['onClick'],
  }

  renderChildren(isBusy = false) {
    const { children } = this.props
    if (typeof children === 'function') return children(isBusy)

    return children
  }

  render() {
    let { type, group, events, component: Component, formKey, ...props } = this.props

    warning(
      !group || type.toLowerCase() !== 'submit',
      'You have specified a `group` prop with type="submit" on this Form.Button component. ' +
        'submit type buttons will automatically trigger a form wide validation. ' +
        'to trigger validation for just the group: `' +
        group +
        '` use type="button" instead.'
    )

    if (type.toLowerCase() === 'submit') group = '@submit'

    return (
      <Trigger formKey={formKey} group={group || '@all'} events={events}>
        {({ messages: _, ...triggerProps }) => (
          <Component
            {...mergeWithEvents(events, [props, triggerProps])}
            type={type}
          >
            {this.renderChildren()}
          </Component>
        )}
      </Trigger>
    )
  }
}

export default Button
