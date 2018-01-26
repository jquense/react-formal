import PropTypes from 'prop-types';
import React from 'react';
import connectToMessageContainer from './connectToMessageContainer';

let values = obj => Object.keys(obj).map( k => obj[k] )
let flatten = (arr, next) => arr.concat(next)


let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);

class Message extends React.Component {
  static propTypes = {
    for: stringOrArrayOfStrings,
    group: stringOrArrayOfStrings,
    messagesForNames: PropTypes.func,
    children: PropTypes.func,
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
  }

  static defaultProps = {
    component: 'span',
    children: messages => messages.join(', ')
  }

  static contextTypes = {
    messageContainer: PropTypes.object,
  }

  render() {
    let {
      /* eslint-disable no-unused-vars */
        for: fieldFor
        , group
      /* eslint-enable no-unused-vars */
      , messages
      , component: Component
      , children
      , ...props } = this.props;


    if (!Object.keys(messages || {}).length)
      return null

    return (
      <Component {...props}>
        {children(
          values(messages)
            .reduce(flatten, [])
        )}
      </Component>
    )
  }
}

module.exports = connectToMessageContainer(Message)
module.exports._Message = Message
