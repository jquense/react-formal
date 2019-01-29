import * as yup from 'yup'
import React from 'react'
import ReactDOM from 'react-dom'

import Form from '../../src'

let nameSchema = yup
  .string()
  .default('')
  .required('You must provide a name')

let modelSchema = yup.object({
  name: yup.object({
    first: nameSchema,
    last: nameSchema,
  }),
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

let MyDateInput = props => <input {...props} type="datetime-local" />

let reqMap = {
  'react-formal': 'Form',
  'react-formal-inputs': 'types',
  react: 'React',
}
let scope = {
  // eslint-disable-next-line no-undef
  ...__SCOPE__,
  Form,
  React,
  ReactDOM,
  yup,
  modelSchema,
  MyDateInput,
  require(name) {
    return scope[reqMap[name] || name]
  },
}

export default scope
