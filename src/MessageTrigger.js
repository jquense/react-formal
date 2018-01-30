import PropTypes from 'prop-types'
import React from 'react'
import createBridge from 'topeka/createChildBridge'
import MessageContext from './MessageContext'

let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
])

const noop = () => {}

class MessageTrigger extends React.Component {
  static propTypes = {
    container: PropTypes.object,

    noValidate: PropTypes.bool.isRequired,

    events: stringOrArrayOfStrings,

    for: stringOrArrayOfStrings,

    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

    group: (props, name, compName, ...args) => {
      if (!props[name] && (!props.for || !props.for.length)) {
        return new Error(
          'A `group` prop is required when no `for` prop is provided' +
            `for component ${compName}`
        )
      }
      return stringOrArrayOfStrings(props, name, compName, ...args)
    },
  }

  static defaultProps = {
    events: 'onChange',
    noValidate: false,
  }

  constructor(...args) {
    super(...args)

    this.removeFromGroup = noop
    this.renderChild = createBridge(this.handleEvent, props => {
      let { children } = this.props

      props.messages = this.messages

      if (typeof children === 'function') return children(props)

      return React.cloneElement(children, props)
    })
  }

  componentWillUnmount() {
    this.removeFromGroup()
  }

  handleEvent = (event, ...args) => {
    let { children, noValidate, for: names, group } = this.props

    let handler = React.isValidElement(children) && children.props[event]
    handler && handler.apply(this, args)

    if (noValidate || !this.container) return

    names = names || this.container.namesForGroup(group)
    names = names ? [].concat(names) : []

    this.container.onValidate(names, event, args)
  }

  render() {
    let { for: names, group, mapMessages } = this.props

    return (
      <MessageContext.Consumer
        for={names}
        group={group}
        mapMessages={mapMessages}
      >
        {(messages, container) => {
          if (container && names) {
            this.removeFromGroup()
            this.removeFromGroup = container.addToGroup(group, names)
          }

          this.messages = messages
          this.container = container
          return this.renderChild(this.props.events)
        }}
      </MessageContext.Consumer>
    )
  }
}

export default MessageTrigger
