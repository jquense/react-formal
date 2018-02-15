import Link from 'gatsby-link'
import PropTypes from 'prop-types'
import React from 'react'

import bowTie from '../../static/bow-tie.svg'
import Editor from '../components/Editor'

import IntroExample from '../examples/intro'

export default class App extends React.Component {
  static contextTypes = {
    history: PropTypes.object,
  }

  render() {
    var location = this.props.location
    var home =
      location.pathname === '/' ||
      location.pathname.indexOf('/getting-started') === 0

    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h1>
              React&nbsp;<img
                src="./bow-tie.svg"
                style={{ width: 75, marginTop: -5 }}
              />&nbsp;Formal
            </h1>
            <p>Classy HTML form management</p>
          </div>
        </div>
        <div className="container">
          <div className="row text-center headlines">
            <div className="col-sm-4">
              <h2>Strongly Typed</h2>
              <p>
                Schema based forms to handle all the frustrating parsing and
                serializing of strings to objects automatically.
              </p>
            </div>
            <div className="col-sm-4">
              <h2>Minimal Wiring</h2>
              <p>
                Requires about as much boilerplate as a single input. No
                managing tons of values and onChange handlers.
              </p>
            </div>
            <div className="col-sm-4">
              <h2>Extreme Flexibility</h2>
              <p>
                You have complete control how each field renders. Use any
                components you want!
              </p>
            </div>
          </div>
          <p>
            React Formal is a library for quickly and painlessly handling HTML
            form validation and serialization. It tries to strike a balance
            between prescriptive form generators and libraries that require you
            to manually handle ever input and manage them in state. React
            Formal, lets you build your form however you want with no
            restrictions on form markup, or unnecessary boilerplate. React
            Formal leverages a schema validation system, which offers helpful
            benefits over the traditional "validate the state DOM" approach.
          </p>

          <ul>
            <li>
              Forms can be handled the "React Way", with controlled or
              uncontrolled values, completely decoupled from DOM state.
            </li>
            <li>
              Working against javascript objects instead of HTML representations
              of an objects, means no need for `<input type="hidden" />`; only
              render inputs that a user actually needs to change!
            </li>
            <li>
              Schema based validation, lets you reuse your parsing and model
              validation logic outside of forms, in your server API utilities,
              or Flux stores.
            </li>
          </ul>
          <h3> Getting Started</h3>

          <p>Lets install both `react-formal` and `yup`.</p>

          <pre>
            <code>npm install react-formal yup --save</code>
          </pre>

          <blockquote>
            For older browsers without the `Promise` global object, you'll need
            to include a polyfill such as `es6-promise`.
          </blockquote>
          <p>
            If you'd like more robust inputs such as, date and number pickers,
            multiselect, and comboboxes (like in the documentation) you might
            want to also install `react-formal-inputs` which is swaps out the
            native input types for
            [react-widgets](http://jquense.github.io/react-widgets/) (read the
            docs for complete installation instructions).
          </p>
          <pre>
            <code>npm install react-formal-inputs --save</code>
          </pre>
          <p>
            Lets first define the object schema that our form will provide input
            too. The `yup` api and style is heavily inspired by Joi, an
            excellent library but is too large and difficult to use in a
            browser. Yup is a leaner and mostly as expressive, without the
            server specific bulk. Check out the [quick start guide to
            `yup`](/api/yup) for schema basics, or the [yup documentation
            site](https://github.com/jquense/yup/blob/master/README.md) for a
            full run down of the features.
          </p>
          <Editor code={IntroExample} />
        </div>
      </div>
    )
  }
}
