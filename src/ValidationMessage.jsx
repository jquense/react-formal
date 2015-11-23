import React from'react';
import shouldComponentUpdate from'react-pure-render/function';
import Message from'react-input-message/Message';
import cn from'classnames';

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
    extract: error => error.message || error
  }

  shouldComponentUpdate(p, s, c){
    return shouldComponentUpdate.call(this, p, s, c)
  }

  render(){
    let { className, errorClass } = this.props;

    return <Message
      {...this.props}
      className={cn(className, errorClass)}
    />
  }
}

module.exports = ValidationMessage
