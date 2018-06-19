import PropTypes from 'prop-types'
import React from 'react'
import mapContextToProps from 'react-context-toolbox/lib/mapContextToProps'
import forwardRef from 'react-context-toolbox/lib/forwardRef'

// import { Consumer as FormConsumer } from './Form'

export const DEFAULT_CHANNEL = '@@parent'

const State = React.createContext(/*{
  formState: {},
  combinedState: {},
} */)
let id = 0
class FormContext extends React.Component {
  constructor(...args) {
    super(...args)
    this.id = id++

    this.state = {
      formState: {},
      combinedState: {},
      update: this.update,
      defaultKey: this.props.defaultKey || DEFAULT_CHANNEL,
    }
  }

  static getDerivedStateFromProps(
    { parentContext, defaultKey = DEFAULT_CHANNEL },
    prevState
  ) {
    if (!parentContext)
      return {
        combinedState: prevState.formState,
      }

    return {
      defaultKey,
      combinedState: {
        ...parentContext.combinedState,
        ...prevState.formState,
      },
    }
  }

  getParent() {
    return this.props.parentContext && this.props.parentContext.publisher
  }

  update = (channel, fn, propagateIfPossible) => {
    const { parentContext } = this.props

    if (parentContext) {
      parentContext.update(channel, fn, false)

      if (!propagateIfPossible) return
      // console.log('publish to parent', this.id)
    }

    this.setState(({ formState }) => {
      const channelState = formState[channel]
      const nextChannelState = fn(channelState || {})
      // TODO: optimize the nullish case
      if (nextChannelState === channelState) return null
      // console.log(this.id, 'updating for channel: ', channel)
      return {
        formState: {
          ...formState,
          [channel]: nextChannelState,
        },
      }
    })
  }

  publish = fn => {
    this.update(this.props.defaultKey || DEFAULT_CHANNEL, fn, true)
  }

  render() {
    // console.log('Reeender', this.id)
    return (
      <State.Provider value={this.state}>
        {typeof this.props.children === 'function'
          ? this.props.children(this.publish)
          : this.props.children}
      </State.Provider>
    )
  }
}

export const withPublish = Component =>
  mapContextToProps(
    State.Consumer,
    ({ publisher }, props) => ({
      publish: fn =>
        publisher.publish(props.formKey || DEFAULT_CHANNEL, fn, true),
    }),
    Component
  )

class ConsumerIndirection extends React.Component {
  shouldComponentUpdate({ state }) {
    const currentState = this.props.state
    return state.some((observedState, i) => observedState !== currentState[i])
  }
  render() {
    const {
      children,
      state,
      Component,
      mapToProps,
      innerRef,
      props,
    } = this.props
    if (Component)
      return <Component ref={innerRef} {...mapToProps(state, props)} />

    return children(state)
  }
}

export const withState = (render, selectors, { displayName, ...rest } = {}) => {
  const fn = (props, ref) => {
    return (
      <State.Consumer>
        {context => {
          const key =
            props.formKey || (context ? context.defaultKey : DEFAULT_CHANNEL)
          const state = context && context.combinedState[key]

          return (
            <ConsumerIndirection state={selectors.map(fn => fn(state, props))}>
              {state => render(...state, props, ref)}
            </ConsumerIndirection>
          )
        }}
      </State.Consumer>
    )
  }
  fn.displayName = displayName
  return Object.assign(React.forwardRef(fn), rest)
}

export const withState2 = (Component, selectors, mapToProps, staticProps) => {
  return forwardRef((props, ref) => {
    return (
      <State.Consumer>
        {context => {
          const key =
            props.formKey || (context ? context.defaultKey : DEFAULT_CHANNEL)

          const state = selectors.map(fn =>
            fn(context && context.combinedState[key], props)
          )

          return (
            <ConsumerIndirection
              state={state}
              mapToProps={mapToProps}
              Component={Component}
              innerRef={ref}
              props={props}
            />
          )
        }}
      </State.Consumer>
    )
  }, staticProps)
}

export default mapContextToProps(
  State.Consumer,
  parentContext => ({ parentContext }),
  FormContext
)
