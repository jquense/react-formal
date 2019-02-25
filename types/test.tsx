/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Form from 'react-formal'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string(),
})

const testForm = [
  <Form />,
  <Form schema={schema} />,
  // wrong value shape
  <Form schema={schema} defaultValue={{ foo: 'string ' }} />, // $ExpectError
]
const Field = Form.Field
type FieldValue = { name: string }
const testField = [
  // name missing
  <Field />, // $ExpectError
  <Field name="foo" />,
  <Field name="foo" mapFromValue="name" />,
  <Field name="foo" mapFromValue={(value: { name: string }) => value.name} />,
  <Field name="foo" mapFromValue={{ name: 'foo' }} />,
  // $ExpectError
  <Field<FieldValue> name="foo" mapFromValue={(value: string) => value} />,
  <Field<FieldValue> name="foo" mapFromValue={(name: string) => ({ name })} />,
  <Field<FieldValue> name="foo" mapFromValue={{ name: 'foo' }} />,
  // foo is not assignable
  <Field<FieldValue> name="foo" mapFromValue={{ foo: 'foo' }} />, // $ExpectError

  <Field<FieldValue> name="foo">
    {({ meta, ...rest }) => {
      if (meta.invalid == true) return
      const name = meta.value.name // $ExpectType string
      return <span {...rest}>{name}</span>
    }}
  </Field>,
]
