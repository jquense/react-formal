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
      formState: {},
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  updateFormState = fn => {
    ReactDOM.unstable_batchedUpdates(() => {
      if (this.unmounted) return
      this.setState(({ formState }) => {
        const nextFormState = fn(formState)
        // TODO: optimize the nullish case
        return nextFormState !== formState && nextFormState !== null
          ? { formState: { ...formState, ...nextFormState } }
          : null
      })
    })
  }

  render() {
    return (
      <State.Provider value={this.state.formState}>
        {this.props.children}
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
          const state = context?.formState

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
