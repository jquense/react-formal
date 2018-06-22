import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import uniq from './utils/uniqMessage'
import { filterAndMapMessages } from './utils/ErrorUtils'
import { withState } from './FormContext'

let flatten = (arr, next) => arr.concat(next)

const renderMessage = (messages, props) => (
  <span {...props}>{messages.join(', ')}</span>
)

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias Message
 */
function FormMessage(
  messages,
  {
    for: names,
    className,
    errorClass = 'validation-error',
    extract = error => error.message || error,
    filter = uniq,
    children = renderMessage,
    ...props
  }
) {
  messages = filterAndMapMessages({ messages, names })

  if (!messages || !Object.keys(messages).length) return null

  return children(
    Object.values(messages)
      .reduce(flatten, [])
      .filter((...args) => filter(...args, extract))
      .map(extract),
    {
      ...props,
      className: cn(className, errorClass),
    }
  )
}

const propTypes = {
  for: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  formKey: PropTypes.string,

  /**
   * A function that maps an array of message strings
   * and returns a renderable string or ReactElement.
   *
   * ```js
   * <Message>
   *  {messages => messages.join(', ')}
   * </Message>
   * ```
   */
  children: PropTypes.func,

  /**
   * A css class that should be always be applied to the Message container.
   */
  errorClass: PropTypes.string,

  /**
   * Map the passed in message object for the field to a string to display
   */
  extract: PropTypes.func,

  filter: PropTypes.func,
}

// FormMessage.propTypes = propTypes
// FormMessage.defaultProps = defaultProps;

export default withState(FormMessage, [state => state && state.messages], {
  propTypes,
})
