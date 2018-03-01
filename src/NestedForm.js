import PropTypes from 'prop-types'
import React from 'react'
import Form, { Consumer } from './Form'

import { filter, prefix } from './utils/ErrorUtils'

/**
 * A `Form` component that takes a `name` prop. Functions exactly like a normal
 * Form, except that when a `name` is present it will defer errors up to the parent Form,
 * functioning like a Form.Field.
 *
 * This is useful for encapsulating complex input groups into self-contained
 * forms without having to worry about "very.long[1].paths[4].to.fields" for names.
 */
class NestedForm extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object,
    errors: PropTypes.object,
    onError: PropTypes.func.isRequired,
    meta: PropTypes.shape({
      errors: PropTypes.object.isRequired,
      onError: PropTypes.func.isRequired,
    }),
  }

  onError = formErrors => {
    const { name, meta, onError } = this.props

    if (name) {
      meta.onError(prefix(formErrors, name))
    } else if (onError) {
      onError(formErrors)
    }
  }

  render() {
    const { name, meta, schema, errors, ...props } = this.props

    return (
      <Consumer>
        {({ getSchemaForPath, context }) => (
          <Form
            {...props}
            onError={this.onError}
            errors={name ? filter(meta.errors, name) : errors}
            schema={schema || getSchemaForPath(name)}
            context={name ? { ...context, ...props.context } : props.context}
          />
        )}
      </Consumer>
    )
  }
}

export default NestedForm
