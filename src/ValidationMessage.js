import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import uniq from './utils/uniqMessage'
import connectToMessageContainer from './connectToMessageContainer'

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
    messagesForNames: PropTypes.func,

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

    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
      .isRequired,

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
    component: 'span',
    errorClass: 'validation-error',
    filter: uniq,
    extract: error => error.message || error,
    children: messages => messages.join(', '),
  }

  render() {
    let {
      /* eslint-disable no-unused-vars */
      for: fieldFor,
      group,
      /* eslint-enable no-unused-vars */
      className,
      errorClass,
      extract,
      filter,
      messages,
      component: Component,
      children,
      ...props
    } = this.props

    if (!Object.keys(messages || {}).length) return null

    messages = Object.values(messages)
      .reduce(flatten, [])
      .filter((...args) => filter(...args, extract))
      .map(extract)

    return (
      <Component {...props} className={cn(className, errorClass)}>
        {children(messages)}
      </Component>
    )
  }
}

export default connectToMessageContainer(Message)
