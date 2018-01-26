import PropTypes from 'prop-types';
import React from 'react';
import Bridge from 'topeka/ChildBridge';
import connectToMessageContainer, { resolveNames } from './connectToMessageContainer';

let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);

class MessageTrigger extends React.Component {

  static propTypes = {
    noValidate: PropTypes.bool.isRequired,

    events: stringOrArrayOfStrings,

    for: stringOrArrayOfStrings,

    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element
    ]),

    group: (props, name, compName, ...args) => {
      if (!props[name] && (!props.for || !props.for.length)) {
        return new Error(
          'A `group` prop is required when no `for` prop is provided' +
          `for component ${compName}`
        )
      }
      return stringOrArrayOfStrings(props, name, compName, ...args);
    }
  }

  static contextTypes = {
    messageContainer: PropTypes.object,
  }

  static defaultProps = {
    events: 'onChange',
    noValidate: false,
  }

  constructor(...args) {
    super(...args)
    this.state = { isActive: false }
  }

  componentWillMount() {
    this.addToGroup();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.addToGroup(nextProps, nextContext);
  }

  componentWillUnmount() {
    this.removeFromGroup &&
      this.removeFromGroup()
  }

  render() {
    return (
      <Bridge
        events={this.props.events}
        onEvent={this.onEvent}
      >
        {this.inject}
      </Bridge>
    )
  }

  onEvent = (event, ...args) => {
    let { children, noValidate } = this.props
    let { messageContainer } = this.context;
    let handler = React.isValidElement(children) && children.props[event]

    handler &&
      handler.apply(this, args)

    if (noValidate || !messageContainer) return

    messageContainer.onValidate(
        this.resolveNames()
      , event
      , args
    );
  }

  inject = (props) => {
    let { messages, children } = this.props;

    props.messages = messages

    if (typeof children === 'function')
      return children(props)

    return React.cloneElement(children, props)
  }

  addToGroup(props = this.props, context = this.context){
    let { messageContainer } = context;
    let { 'for': forNames, group } = props;

    this.removeFromGroup &&
      this.removeFromGroup()

    if (!messageContainer || !forNames)
      return

    this.removeFromGroup =
      messageContainer.addToGroup(group, forNames)
  }

  resolveNames(props = this.props, context = this.context) {
    return resolveNames(this.props, context.messageContainer)
  }
}

export default connectToMessageContainer(MessageTrigger)
