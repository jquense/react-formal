import React from 'react'
import PropTypes from 'prop-types'

import uniq from './utils/uniqMessage'
import { filterAndMapErrors } from './utils/ErrorUtils'
import { withState, FORM_DATA } from './Contexts'

let flatten = (arr, next) => arr.concat(next)

/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias FormMessage
 */
class Message extends React.Component {
  render() {
    let {
      errors,
      for: names,
      className,
      extract = error => error.message || error,
      filter = uniq,
      children = (errors, props) => <span {...props}>{errors.join(', ')}</span>,
      ...props
    } = this.props

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

export default withState(
  ({ errors }, props) => <Message errors={errors} {...props} />,
  FORM_DATA.errors
)
