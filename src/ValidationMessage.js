import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import uniq from './utils/uniqMessage'
import MessageContext from './MessageContext'

let flatten = (arr, next) => arr.concat(next)

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias Message
 */
class Message extends React.PureComponent {
  static propTypes = {
    for: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    group: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),

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
  }

  static defaultProps = {
    errorClass: 'validation-error',
    filter: uniq,
    extract: error => error.message || error,
    children: (messages, props) => (
      <span {...props}>{messages.join(', ')}</span>
    ),
  }

  render() {
    let {
      for: fieldFor,
      group,
      className,
      errorClass,
      extract,
      filter,
      children,
      ...props
    } = this.props

    return (
      <MessageContext.Consumer for={fieldFor} group={group}>
        {messages => {
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
        }}
      </MessageContext.Consumer>
    )
  }
}

export default Message
