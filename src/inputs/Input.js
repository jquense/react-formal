import React from 'react'
import PropTypes from 'prop-types'

class Input extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    inputRef: PropTypes.func,
  }
  render() {
    let { tagName: Tag = 'input', value, inputRef, ...props } = this.props

    delete props.meta

    if (value === null) value = ''

    return (
      <Tag
        {...props}
        value={value}
        ref={inputRef}
        onChange={e => props.onChange(e.target.value, e)}
      />
    )
  }
}

export default Input
