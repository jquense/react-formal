import PropTypes from 'prop-types'
import React from 'react'
import Form from './Form'
import Field from './Field'

import { filter, prefix, unprefix } from './utils/ErrorUtils'

/**
 * A `Form` component that takes a `name` prop. Functions exactly like a normal
 * Form, except that when a `name` is present it will defer errors up to the parent `<Form>`,
 * functioning like a `<Form.Field>`.
 *
 * This is useful for encapsulating complex input groups into self-contained
 * forms without having to worry about `"very.long[1].paths[4].to.fields"` for names.
 */
class NestedForm extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object,
    errors: PropTypes.object,
    meta: PropTypes.shape({
      errors: PropTypes.object.isRequired,
      onError: PropTypes.func.isRequired,
    }),
  }

  render() {
    const { name, schema, errors, ...props } = this.props

    return (
      <Field name={name} noResolveType noValidate events="onChange">
        {({ meta, value, onChange }) => {
          return (
            <Form
              as="div"
              {...props}
              value={value}
              onChange={onChange}
              onError={errors => meta.onError(prefix(errors, name))}
              errors={unprefix(name ? meta.errors : errors, name)}
              schema={schema || meta.schema}
              context={
                name ? { ...meta.context, ...props.context } : props.context
              }
            />
          )
        }}
      </Field>
    )
  }
}

export default NestedForm
