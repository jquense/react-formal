import classNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import types from 'react-formal-inputs'
import * as yup from 'yup'
import Form from 'react-formal'

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

import '../css/one-light.less'

const MyDateInput = props => <DateInput {...props} type="datetime-local" />

const nameSchema = yup
  .string()
  .default('')
  .required('You must provide a name')

const modelSchema = yup.object({
  name: yup.object({ first: nameSchema, last: nameSchema }),
  dateOfBirth: yup
    .date()
    .required('Please enter a date of birth')
    .max(new Date(), "You can't be born in the future!"),
  colorId: yup.number(),
  age: yup
    .number()
    .nullable()
    .required('Please enter an age')
    .positive('Ages must be a positive number'),
})

const reqMap = {
  react: React,
  'react-dom': ReactDOM,
  'react-formal': Form,
  'react-formal-inputs': types,
}
const scope = {
  Form,
  React,
  ReactDOM,
  yup,
  modelSchema,
  MyDateInput,
  require: name => reqMap[name] || scope[name],
}

export default class Playground extends React.Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
  }

  render() {
    const { code } = this.props

    return (
      <LiveProvider
        code={code}
        scope={scope}
        mountStylesheet={false}
        noInline={code.includes('render(')}
      >
        <div className={classNames('bs-example', this.props.exampleClassName)}>
          <LivePreview />
          <LiveError />
        </div>
        <div className="bs-code-editor">
          <LiveEditor />
        </div>
      </LiveProvider>
    )
  }
}
