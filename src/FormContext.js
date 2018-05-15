import PropTypes from 'prop-types'
import React from 'react'
import produce from 'immer'
import mapContextToProps from 'react-context-toolbox/lib/mapContextToProps'

import { Consumer as FormConsumer } from './Form'

export const DEFAULT_CHANNEL = '@@parent'

// const ContextPublisher = React.createContext({ publish() {}, stop() {} })
const State = React.createContext({})

class FormContext extends React.Component {
  constructor(...args) {
    super(...args)

    const publisher = {
      stop: (channel, propagateIfPossible) => {
        if (!this.shouldHandleChannel(channel, propagateIfPossible)) {
          return this.getParent().stop(channel)
        }

        this.update(this.state, draft => {
          draft.formState[channel] = null
        })
      },
      publish: (channel, fn, propagateIfPossible) => {
        if (!this.shouldHandleChannel(channel, propagateIfPossible))
          return this.getParent().publish(channel, args)

        this.update(this.state, draft => {
          draft.formState[channel] = draft.formState[channel] || {}
          fn(draft.formState[channel])
        })
      },
    }

    this.state = {
      formState: {},
      combinedState: {},
      publisher,
    }
  }

  static getDerivededStateFromProps({ parentContext }, prevState) {
    if (!parentContext) return
    return {
      parentContext,
      combinedState: {
        ...parentContext.combinedState,
        ...prevState.formState,
      },
    }
  }

  update = (channel, fn) => {
    const nextState = produce(this.state, draft => {
      fn(draft)
      if (!draft.parentContext) {
        draft.combinedState = draft.formState
        return
      }

      draft.combinedState = {
        ...draft.parentContext.combinedState,
        ...draft.formState,
      }
    })

    if (nextState !== this.state) {
      console.log('updating state', nextState)
      this.setState(nextState)
    }
  }

  getParent() {
    return this.props.parentContext && this.props.parentContext.publisher
  }

  shouldHandleChannel(channel, force) {
    return !this.getParent() || (channel === DEFAULT_CHANNEL && !force)
  }

  render() {
    console.log('Reeender', this.state)
    return (
      <State.Provider value={this.state}>{this.props.children}</State.Provider>
    )
  }
}

export const withPublish = Component =>
  mapContextToProps(
    State.Consumer,
    ({ publisher }, props) => ({
      publish: fn =>
        publisher.publish(props.formKey || DEFAULT_CHANNEL, fn, true),
      stop: () => publisher.stop(props.formKey || DEFAULT_CHANNEL, true),
    }),
    Component
  )

class ConsumerIndirection extends React.Component {
  shouldComponentUpdate({ state }) {
    const currentState = this.props.state
    return state.some((observedState, i) => observedState !== currentState[i])
  }
  render() {
    const { children, state } = this.props
    return children(state)
  }
}

export const withState = (render, selectors) => {
  return React.forwardRef((props, ref) => (
    <FormConsumer.Consumer>
      {({ formKey }) => {
        const key = props.formKey || formKey || DEFAULT_CHANNEL
        return (
          <State.Consumer>
            {fullState =>
              fullState.combinedState[key] ? (
                <ConsumerIndirection
                  state={selectors.map(fn => fn(fullState.combinedState[key]))}
                >
                  {state => render(...state, props, ref)}
                </ConsumerIndirection>
              ) : null
            }
          </State.Consumer>
        )
      }}
    </FormConsumer.Consumer>
  ))
}

// class Publisher extends React.Component {
//   static propTypes = {
//     group: PropTypes.string,
//     bubbles: PropTypes.bool,
//   }
//   static contextTypes = {
//     [contextKey]: contextTypes,
//   }

//   constructor(...args) {
//     super(...args)
//     this.group = this.props.group || DEFAULT_CHANNEL
//     this.bubbles = this.props.bubbles
//     this.channels = []
//   }

//   componentWillUnmount() {
//     if (!this.context[contextKey]) return
//     this.channels.forEach(channel =>
//       this.context[contextKey].stop(channel, this.bubbles)
//     )
//   }

//   publish = (key, args) => {
//     if (!this.context[contextKey]) return

//     const channel = `${this.group}:${key}`
//     this.channels.push(channel)
//     this.context[contextKey].publish(channel, args, this.bubbles)
//   }

//   render() {
//     return this.props.children(this.publish)
//   }
// }

// class Subscriber extends React.Component {
//   static propTypes = {
//     channels: PropTypes.array.isRequired,
//     formKey: PropTypes.oneOfType([
//       PropTypes.string.isRequired,
//       PropTypes.array.isRequired,
//     ]),
//   }

//   static contextTypes = {
//     [contextKey]: contextTypes,
//   }
//   componentWillUnmount() {
//     this.unmounted = true
//     this.subs && this.subs.forEach(fn => fn())
//   }
//   update = () => {
//     if (!this.unmounted) this.forceUpdate()
//   }
//   subscribe(contextFormKey) {
//     if (this.subs || !this.context[contextKey]) return
//     const { formKey, channels } = this.props

//     let key = formKey || contextFormKey || DEFAULT_CHANNEL
//     this.channels = []
//     channels.map(channel => {
//       this.channels.push(`${key}:${channel}`)
//       this.context[contextKey].subscribe(`${key}:${channel}`, this.update)
//     })
//   }

//   get() {
//     if (!this.context[contextKey]) return []
//     return this.channels.map(channel => this.context[contextKey].get(channel))
//   }

//   render() {
//     return (
//       <FormConsumer>
//         {({ formKey }) => {
//           this.subscribe(formKey)
//           return this.props.children(...this.get())
//         }}
//       </FormConsumer>
//     )
//   }
// }

// FormContext.Publisher = Publisher
// FormContext.Subscriber = Subscriber

export default FormContext
