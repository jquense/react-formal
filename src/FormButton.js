import chain from 'chain-function'
import PropTypes from 'prop-types'
import React from 'react'

import Trigger from './FormTrigger'

function mergeWithEvents(events, objects) {
  let result = Object.assign({}, ...objects)
  if (events)
    [].concat(events).forEach(event => {
      let handlers = objects.map(p => p[event])
      result[event] = chain(...handlers)
    })
  return result
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

  render() {
    let {
      group,
      events,
      component: Component,
      formKey,
      children,
      ...props
    } = this.props

    if (props.type.toLowerCase() === 'submit') group = '@submit'

    return (
      <Trigger formKey={formKey} group={group} events={events}>
        {meta =>
          typeof children === 'function' ? (
            children({
              ...meta,
              props: mergeWithEvents(events, [props, meta.props]),
            })
          ) : (
            <Component {...mergeWithEvents(events, [props, meta.props])}>
              children
            </Component>
          )
        }
      </Trigger>
    )
  }
}

export default FormButton
