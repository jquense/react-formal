import React from'react';
import Message from'react-input-message/Message';
import cn from'classnames';
import shallowEqual from 'recompose/shallowEqual'

import uniq from './util/uniqMessage';

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias Message
 */
class ValidationMessage extends React.Component {

  static propTypes = {
    ...Message.propTypes,
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
    children: React.PropTypes.func,

    component: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string
    ]).isRequired,

    /**
     * A css class that should be always be applied to the Message container.
     */
    errorClass: React.PropTypes.string,

    /**
     * Map the passed in message object for the field to a string to display
     */
    extract: React.PropTypes.func
  }

  static defaultProps = {
    component: 'span',
    errorClass: 'validation-error',
    filter: uniq,
    extract: error => error.message || error,
    children: messages => messages.join(', ')
  }

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props, nextProps)
  }

  render(){
    let {
        className
      , errorClass
      , children
      , extract
      , filter
      , ...props } = this.props;

    return (
      <Message
        {...props}
        className={cn(className, errorClass)}
      >
        {messages => children(
          messages
            .filter((...args) => filter(...args, extract))
            .map(extract)
        )}
      </Message>
    )
  }
}

export default ValidationMessage
