import PropTypes from 'prop-types'
import React, { useContext, useMemo } from 'react'
import { FormErrorContext } from './Contexts'
import { filterAndMapErrors } from './utils/ErrorUtils'
import uniq from './utils/uniqMessage'

let flatten = (arr, next) => arr.concat(next)

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias FormMessage
 */
function Message({
  errors: propsErrors,
  for: names,
  className,
  filter = uniq,
  extract = error => error.message || error,
  children = (errors, props) => <span {...props}>{errors.join(', ')}</span>,
  ...props
}) {
  const formErrors = useContext(FormErrorContext)

  const errors = useMemo(
    () =>
      filterAndMapErrors({
        errors: propsErrors || formErrors,
        names,
      }),
    [names, propsErrors || formErrors]
  )

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

Message.propTypes = {
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
   * Map the passed in message object for the field to a string to display
   */
  extract: PropTypes.func,

  filter: PropTypes.func,
}

export default Message
