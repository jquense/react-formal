import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import React from 'react'

import { Consumer as FormConsumer } from './Form'

export const DEFAULT_CHANNEL = '@@parent'

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
    channels: PropTypes.array.isRequired,
    formKey: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.array.isRequired,
    ]),
  }

  static contextTypes = {
    [contextKey]: contextTypes,
  }
  componentWillUnmount() {
    this.subs && this.subs.forEach(fn => fn())
  }
  update = () => {
    this.forceUpdate()
  }
  subscribe(contextFormKey) {
    if (this.subs || !this.context[contextKey]) return
    const { formKey, channels } = this.props

    let key = formKey || contextFormKey || DEFAULT_CHANNEL
    this.channels = []
    channels.map(channel => {
      this.channels.push(`${key}:${channel}`)
      this.context[contextKey].subscribe(`${key}:${channel}`, this.update)
    })
  }

  get() {
    if (!this.context[contextKey]) return []
    return this.channels.map(channel => this.context[contextKey].get(channel))
  }

  render() {
    return (
      <FormConsumer>
        {({ formKey }) => {
          this.subscribe(formKey)
          return this.props.children(...this.get())
        }}
      </FormConsumer>
    )
  }
}

FormContext.Publisher = Publisher
FormContext.Subscriber = Subscriber

export default FormContext
