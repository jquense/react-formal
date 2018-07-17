import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import React from 'react'
import mapContextToProps from 'react-context-toolbox/lib/mapContextToProps'
import forwardRef from 'react-context-toolbox/lib/forwardRef'

export const DEFAULT_CHANNEL = '@@parent'

const State = React.createContext()

class FormContext extends React.Component {
  static propTypes = {
    /** @private */
    parentContext: PropTypes.object,
    /** @private */
    defaultKey: PropTypes.string,

    /** @private */
    initialState: PropTypes.object,
  }
  constructor(...args) {
    super(...args)

    this.state = {
      formState: {
        [this.props.defaultKey || DEFAULT_CHANNEL]: this.props.initialState,
      },
      combinedState: {},
      update: this.update,
      defaultKey: this.props.defaultKey || DEFAULT_CHANNEL,
    }
  }
  componentWillUnmount() {
    this.unmounted = true
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

  update = (channel, fn, propagateIfPossible) => {
    ReactDOM.unstable_batchedUpdates(() => {
      if (this.unmounted) return

      const { parentContext } = this.props
      if (parentContext) {
        parentContext.update(channel, fn, false)

        if (!propagateIfPossible) return
        this.props.__debugName && this.debug('publish to parent')
      }

      this.setState(({ formState }) => {
        const channelState = formState[channel]
        const nextChannelState = fn(channelState || {})
        // TODO: optimize the nullish case
        if (nextChannelState === channelState || nextChannelState === null) {
          this.debug('no update for channel: ', channel)
          return null
        }

        this.debug('updating for channel: ', channel)
        return {
          formState: {
            ...formState,
            [channel]: { ...channelState, ...nextChannelState },
          },
        }
      })
    })
  }

  publish = (fn, mutate) => {
    this.update(this.props.defaultKey || DEFAULT_CHANNEL, fn, true, mutate)
  }

  debug = (...args) => {
    if (!this.props.__debugName) return
    console.log('FormContext:', this.props.__debugName, ...args)
  }

  render() {
    return (
      <State.Provider value={this.state}>
        {typeof this.props.children === 'function'
          ? this.props.children(this.publish)
          : this.props.children}
      </State.Provider>
    )
  }
}

class ConsumerIndirection extends React.Component {
  // eslint-disable-next-line react/prop-types
  shouldComponentUpdate({ state, props }) {
    const currentState = this.props.state
    const shouldUpdate =
      props !== this.props.props ||
      state.some((observedState, i) => observedState !== currentState[i])

    return shouldUpdate
  }
  render() {
    const { children, state } = this.props

    return children(state)
  }
}

export const withState = (render, selectors, { displayName } = {}) => {
  const fn = (props, ref) => {
    return (
      <State.Consumer>
        {context => {
          const key =
            props.formKey || (context ? context.defaultKey : DEFAULT_CHANNEL) // eslint-disable-line react/prop-types
          const state = context && context.combinedState[key]

          return (
            <ConsumerIndirection
              props={props}
              state={selectors.map(fn => state && fn(state, props))}
            >
              {state => render(...state, props, ref)}
            </ConsumerIndirection>
          )
        }}
      </State.Consumer>
    )
  }
  return forwardRef(fn, { displayName })
}

export default mapContextToProps(
  State.Consumer,
  parentContext => ({ parentContext }),
  FormContext
)
