import React from 'react'
import PropTypes from 'prop-types'

import { Provider, Consumer } from './Form'

const DEFAULT_CHANNEL = '@@parent'

/**
 * `<Form.Context />` provides declarative API similar in purpose to the
 * HTML5 `.form` attribute. Sometimes it is necessary to trigger a form
 * validation or submission from _outside_ a `<Form />`.
 *
 * One approach is to use the imperative API of capturing the `<Form />` instance in a ref
 * and calling the `.submit()` method on it, but this can be troublesome with
 * Higher order Components, used by your app or other libraries.
 *
 * An more "React" approach is to use `<Form.Context />` to wrap both your form and trigger.
 *
 * ```js
 * <Form.Context>
 *   <MyForm />
 *   <Form.Button type='submit' />
 * </Form.Context>
 * ```
 *
 * @alias Context
 */
class FormContext extends React.Component {
  channels = new Map()

  state = {
    formContext: {
      registerForm: (channelName = DEFAULT_CHANNEL, submit) => {
        if (!this.channels.has(channelName))
          this.channels.set(channelName, submit)
      },

      submitForm: (channelName = DEFAULT_CHANNEL) => {
        const { parentFormContext, channels } = this

        if (channels.has(channelName)) {
          channels.get(channelName)()
        } else if (parentFormContext) parentFormContext.submitForm(channelName)
      },
    },
  }

  render() {
    return (
      <Consumer>
        {formContext => {
          this.parentFormContext = formContext
          return (
            <Provider value={this.state.formContext}>
              {this.props.children}
            </Provider>
          )
        }}
      </Consumer>
    )
  }
}

export default FormContext
