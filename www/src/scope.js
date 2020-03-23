import React from 'react'
import * as yup from 'yup'
import * as Formal from '../../src'

let nameSchema = yup
  .string()
  .default('')
  .required('You must provide a name')

let modelSchema = yup.object({
  name: yup.object({
    first: nameSchema,
    last: nameSchema
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
    .positive('Ages must be a positive number')
})

let MyDateInput = props => <input {...props} type="datetime-local" />

let reqMap = {
  'react-formal': 'Form',
  'react-formal-inputs': 'types',
  react: 'React'
}
let scope = {
  // eslint-disable-next-line no-undef
  Form: Formal.default,
  ...Formal,
  yup,
  modelSchema,
  MyDateInput,
  require(name) {
    return scope[reqMap[name] || name]
  }
}

delete scope.default

export default scope
