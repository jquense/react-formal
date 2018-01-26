import PropTypes from 'prop-types';
import React from 'react';

function isReactComponent(component) {
  return !!(
    component &&
    component.prototype &&
    component.prototype.isReactComponent
  );
}


function defaultResolveNames(props, container) {
  let { group, 'for': forNames } = props;

  if (!forNames && container)
    forNames = container.namesForGroup(group);

  return forNames ? [].concat(forNames) : [];
}

function defaultMapMessages(messages, names) {
  if (!names.length) return messages;

  let messagesForNames = {};
  names.forEach(name => {
    if (messages[name])
      messagesForNames[name] = messages[name]
  })

  return messagesForNames
}


function connectToMessageContainer(Component, {
  methods = [],
  mapMessages = defaultMapMessages,
  resolveNames = defaultResolveNames,
} = {}) {

  function resolveNamesAndMapMessages(messages, props, container) {
    let names = resolveNames ? resolveNames(props, container) : [];

    return (props.mapMessages || mapMessages)(
      messages,
      names,
      props,
      container
    )
  }

  class MessageListener extends React.Component {

    static DecoratedComponent = Component

    static propTypes = {
      mapMessages: PropTypes.func,
    }

    static contextTypes = {
      messageContainer: PropTypes.object,
    }

    componentWillMount() {
      let container = this.context.messageContainer;

      if (container) {
        this.unsubscribe = container.subscribe(allMessages => {
          if (this.unmounted)
            return;

          let messages = resolveNamesAndMapMessages(
            allMessages,
            this.props,
            this.context.messageContainer
          )

          this.setState({ messages, allMessages })
        })
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (mapMessages && mapMessages.length >= 2) {
        let container = nextContext.messageContainer;
        // callback style because the listener may have been called before
        // and not had a chance to flush it's changes yet
        this.setState(({ allMessages }) => ({
          messages: resolveNamesAndMapMessages(
            allMessages,
            nextProps,
            container
          ),
        }))
      }
    }

    componentWillUnmount() {
      this.unmounted = true;
      this.unsubscribe && this.unsubscribe()
    }

    render() {
      let { messages = {} } = this.state || {};

      if (this.props.messages) {
        messages = this.props.messages;
      }

      return (
        <Component
          {...this.props}
          messages={messages}
          ref={isReactComponent(Component) ? 'inner' : undefined}
        />
      )
    }
  }

  methods.forEach(method => {
    MessageListener.prototype[method] = function(...args) {
      return this.refs.inner[method](...args)
    }
  })

  return MessageListener;
}

connectToMessageContainer.resolveNames = defaultResolveNames;

export { defaultResolveNames as resolveNames }

export default connectToMessageContainer;
