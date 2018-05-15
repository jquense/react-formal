import React from 'react'
import produce from 'immer'

const State = React.createContext()

class ConsumerIndirection extends React.Component<> {
  shouldComponentUpdate({ state }) {
    const currentState = this.props.state
    return state.some((observedState, i) => observedState !== currentState[i])
  }
  render() {
    const { children, state } = this.props
    return children(...state)
  }
}

const Consumer = React.forwardRef(({ children, selector }) => (
  <State.Consumer>
    {state => (
      <ConsumerIndirection state={selector.map(fn => fn(state))}>
        {children}
      </ConsumerIndirection>
    )}
  </State.Consumer>
))

export const createState = listener => {
  return function update(currentState, fn) {
    const nextState = produce(currentState, fn)
    if (nextState !== currentState) {
      listener(currentState)
    }
  }

  // class Provider extends React.Component {
  //   state = initial

  //   componentDidMount() {
  //     listener = () => {
  //       this.setState(currentState)
  //     }
  //   }

  //   render() {
  //     return (
  //       <State.Provider value={this.state}>
  //         {this.props.children}
  //       </State.Provider>
  //     )
  //   }
  // }

  // return { Provider, Consumer }
}
