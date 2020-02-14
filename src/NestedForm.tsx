import PropTypes from 'prop-types'
import React from 'react'
import * as Yup from 'yup'
import Form, { FormProps } from './Form'
import useField from './useField'
import { prefix } from './utils/ErrorUtils'

const propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object,
  errors: PropTypes.object,
  context: PropTypes.object,
  meta: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    onError: PropTypes.func.isRequired,
  }),
}

export interface NestedFormProps<TSchema extends Yup.ObjectSchema>
  extends Omit<
    FormProps<TSchema>,
    'onError' | 'onChange' | 'value' | 'defaultValue' | 'defaultErrors'
  > {
  name: string
}

/**
 * A `Form` component that takes a `name` prop. Functions exactly like a normal
 * Form, except that when a `name` is present it will defer errors up to the parent `<Form>`,
 * functioning like a `<Form.Field>`.
 *
 * This is useful for encapsulating complex input groups into self-contained
 * forms without having to worry about `"very.long[1].paths[4].to.fields"` for names.
 */
function NestedForm<T extends Yup.ObjectSchema>({
  name,
  schema,
  errors,
  ...props
}: NestedFormProps<T>) {
  const [_, meta] = useField({
    name,
    noValidate: true,
    events: null,
  })

  return (
    <Form
      {...props}
      value={meta.value}
      onChange={meta.onChange}
      onError={errors => meta.onError(prefix(errors, name))}
      errors={name ? meta.errors : errors}
      schema={schema || (meta.schema as T)}
      context={name ? { ...meta.context, ...props.context } : props.context}
    />
  )
}

NestedForm.propTypes = propTypes

export default NestedForm
