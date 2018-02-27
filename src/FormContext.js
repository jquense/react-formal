import PropTypes from 'prop-types';
import React from 'react'

const DEFAULT_CHANNEL = '@@parent'

const contextKey = `@@react-formal-subscription-key`
const contextTypes = () => {}

const splitChannel = channel => channel.split(':')

class FormContext extends React.Component {
  static contextTypes = {
    [contextKey]: contextTypes,
  }
  static childContextTypes = {
    [contextKey]: contextTypes,
  }

  constructor(...args) {
    super(...args)

    this.data = new Map()
    this.handlers = new Map()

    this.subscriptionContext = {
      stop: (channel, propagateIfPossible) => {
        if (!this.shouldHandleChannel(channel, propagateIfPossible)) {
          return this.getParent().stop(channel)
        }

        this.data.delete(channel)
        const handlers = this.handlers.get(channel)
        handlers && handlers.clear()
      },

      publish: (channel, args, propagateIfPossible) => {
        if (!this.shouldHandleChannel(channel, propagateIfPossible))
          return this.getParent().publish(channel, args)

        this.data.set(channel, args)
        const handlers = this.handlers.get(channel)
        handlers && handlers.forEach(fn => fn(args))
      },

      get: channel =>
        this.data.has(channel)
          ? this.data.get(channel)
          : this.getParent() && this.getParent().get(channel),

      subscribe: (channel, handler) => {
        if (!this.shouldHandleChannel(channel))
          return this.getParent().subscribe(channel, handler)

        const handlers = this.handlers.get(channel) || new Set()
        if (!handlers.has(handler)) {
          handlers.add(handler)
          this.handlers.set(channel, handlers)
        }
        return () => handlers.delete(handler)
      },
    }
  }
  getChildContext() {
    return { [contextKey]: this.subscriptionContext }
  }
  getParent() {
    return this.context[contextKey]
  }
  shouldHandleChannel(channel, force) {
    const group = splitChannel(channel)[0]

    return !this.getParent() || (group === DEFAULT_CHANNEL && !force)
  }

  render() {
    if (typeof this.props.children === 'function')
      return this.props.children(this.subscriptionContext)

    return this.props.children
  }
}

class Publisher extends React.Component {
  static propTypes = {
    group: PropTypes.string,
    bubbles: PropTypes.bool,
  }
  static contextTypes = {
    [contextKey]: contextTypes,
  }

  constructor(...args) {
    super(...args)
    this.group = this.props.group || DEFAULT_CHANNEL
    this.bubbles = this.props.bubbles
    this.channels = []
  }

  componentWillUnmount() {
    if (!this.context[contextKey]) return
    this.channels.forEach(channel =>
      this.context[contextKey].stop(channel, this.bubbles)
    )
  }

  publish = (key, args) => {
    if (!this.context[contextKey]) return

    const channel = `${this.group}:${key}`
    this.channels.push(channel)
    this.context[contextKey].publish(channel, args, this.bubbles)
  }

  render() {
    return this.props.children(this.publish)
  }
}

class Subscriber extends React.Component {
  static propTypes = {
    channel: PropTypes.string,
  }
  static contextTypes = {
    [contextKey]: contextTypes,
  }

  constructor(...args) {
    super(...args)
    this.channel = this.props.channel

    if (this.context[contextKey])
      this.unsubscribe = this.context[contextKey].subscribe(this.channel, () =>
        this.forceUpdate()
      )
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  get() {
    if (this.context[contextKey])
      return this.context[contextKey].get(this.channel)
  }

  render() {
    return this.props.children(this.get())
  }
}

FormContext.Publisher = Publisher
FormContext.Subscriber = Subscriber

export default FormContext
