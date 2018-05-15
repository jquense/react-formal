import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import uniq from './utils/uniqMessage'
import { filterAndMapMessages, namesForGroup } from './utils/ErrorUtils'
import { withState } from './FormContext'

let flatten = (arr, next) => arr.concat(next)
const channels = ['messages', 'groups']

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
    group: PropTypes.string,
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
      for: names,
      group,
      formKey,
      className,
      errorClass,
      extract,
      filter,
      children,
      ...props
    } = this.props

    return (
      <FormContext.Subscriber formKey={formKey} channels={channels}>
        {(messages, groups) => {
          messages = filterAndMapMessages({
            messages,
            names: names || namesForGroup(group, groups),
          })

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
      </FormContext.Subscriber>
    )
  }
}

function render(
  messages,
  groups,
  {
    for: names,
    group,
    className,
    errorClass,
    extract,
    filter,
    children,
    ...props
  }
) {
  messages = filterAndMapMessages({
    messages,
    names: names || namesForGroup(group, groups),
  })

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

export default withState(render, [
  state => state.messages,
  state => state.groups,
])
