import React from 'react'
import PropTypes from 'prop-types'

import uniq from './utils/uniqMessage'
import { filterAndMapErrors } from './utils/ErrorUtils'
import { withState, FORM_DATA } from './Contexts'

let flatten = (arr, next) => arr.concat(next)

const renderMessage = (errors, props) => (
  <span {...props}>{errors.join(', ')}</span>
)

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias Message
 */
function FormMessage(
  { errors },
  {
    for: names,
    className,
    extract = error => error.message || error,
    filter = uniq,
    children = renderMessage,
    ...props
  }
) {
  errors = filterAndMapErrors({ errors, names })

  if (!errors || !Object.keys(errors).length) return null

  return children(
    Object.values(errors)
      .reduce(flatten, [])
      .filter((...args) => filter(...args, extract))
      .map(extract),
    {
      ...props,
      className,
    }
  )
}

const propTypes = {
  for: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  formKey: PropTypes.string,

  /**
   * A function that maps an array of message strings
   * and returns a renderable string or ReactElement.
   *
   * ```js
   * <Message>
   *  {errors => errors.join(', ')}
   * </Message>
   * ```
   */
  children: PropTypes.func,

  /**
   * A css class that should be always be applied to the Message container.
   */
  errorClass: PropTypes.string,

  /**
   * Map the passed in message object for the field to a string to display
   */
  extract: PropTypes.func,

  filter: PropTypes.func,
}

export default withState(FormMessage, FORM_DATA.errors, {
  propTypes,
})
