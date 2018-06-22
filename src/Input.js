import React from 'react'
import PropTypes from 'prop-types'

let pad = n => (n < 10 ? '0' + n : n)

let isValid = date => date && !isNaN(date.getTime())

let toLocal = date => {
  if (!date) return null
  date = new Date(date)
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
}

let parse = (date, original, part) =>
  toLocal(
    part === 'time'
      ? toDateString(original || new Date(), 'date') + 'T' + date
      : date
  )

let localISOString = date =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}.000`

let toDateString = (date, part) => {
  if (!isValid(date)) return ''
  date = localISOString(date)
  if (part === 'date') date = date.substr(0, 10)
  if (part === 'time') date = date.substr(11)
  return date
}

let isDateType = type =>
  type === 'date' || type === 'datetime' || type === 'datetime-local'

class Input extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    inputRef: PropTypes.func,
    meta: PropTypes.object,
    multiple: PropTypes.bool,
    type: PropTypes.string,
  }

  handleChange = e => {
    const { meta, onChange, multiple, value: lastValue } = this.props
    const { resolvedType, schema, context } = meta

    if (resolvedType === 'file') {
      return onChange(multiple ? e.target.files : e.target.files[0])
    }

    let value =
      resolvedType === 'radio' ||
      resolvedType === 'checkbox' ||
      resolvedType === 'boolean'
        ? e.target.checked
        : e.target.value

    // coearce empty inputs to null
    if (value === '') value = null
    if (isDateType(resolvedType)) value = parse(value, lastValue, resolvedType)

    if (schema && schema.isType(value)) {
      try {
        value = schema.cast(value, { context })
      } catch (err) {
        /* ignore */
      }
    }

    onChange(value)
  }

  render() {
    let { meta, value, inputRef, ...props } = this.props
    const { resolvedType } = meta

    // not really supported...
    if (resolvedType === 'radio') {
      return <input {...props} type="radio" />
    }
    if (resolvedType === 'checkbox' || resolvedType === 'boolean') {
      return <input {...props} type="checkbox" checked={!!value} />
    }

    let Component = 'input'
    if (resolvedType === 'textarea') Component = 'textarea'
    if (resolvedType === 'select') Component = 'select'

    if (isDateType(resolvedType)) value = toDateString(value, resolvedType)
    if (value == null || resolvedType === 'file') value = ''

    return (
      <Component
        {...props}
        value={value}
        ref={inputRef}
        onChange={this.handleChange}
      />
    )
  }
}

export default React.forwardRef((props, ref) => (
  <Input inputRef={ref} {...props} />
))
