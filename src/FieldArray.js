import invariant from 'invariant'
import PropTypes from 'prop-types'
import React from 'react'
import { move, remove, shift, unshift } from './utils/ErrorUtils'

import Field from './Field'

function filter(messages, baseName) {
  const paths = Object.keys(messages || {})
  const result = {}

  paths.forEach(path => {
    if (path.indexOf(baseName) !== 0) return
    result[path] = messages[path]
  })

  return result
}

/**
 * A specialized `Form.Field` component that handles array fields.
 * Specifically it handles errors correctly when items are added, removed, or
 * reordered.
 */
class FieldArray extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  onAdd = item => {
    const { value } = this.fieldProps
    this.onInsert(item, value ? value.length : 0)
  }

  onItemError(name, errors) {
    this.sendErrors(fieldErrors => ({
      ...remove(fieldErrors, name),
      ...errors,
    }))
  }

  onUpdate = (updatedItem, oldItem) => {
    const { value, onChange } = this.fieldProps
    const index = value.indexOf(oldItem)
    const newValue = value == null ? [] : [...value]

    newValue.splice(index, 1, updatedItem)

    onChange(newValue)
  }

  onInsert = (item, index) => {
    const { value, onChange } = this.fieldProps
    const newValue = value == null ? [] : [...value]

    newValue.splice(index, 0, item)

    onChange(newValue)
    this.sendErrors((errors, name) => unshift(errors, name, index))
  }

  onMove = (item, toIndex) => {
    const { value, onChange } = this.fieldProps
    const fromIndex = value.indexOf(item)
    const newValue = value == null ? [] : [...value]

    invariant(
      fromIndex !== -1,
      '`onMove` must be called with an item in the array'
    )

    newValue.splice(toIndex, 0, ...newValue.splice(fromIndex, 1))

    // FIXME: doesn't handle syncing error state.
    onChange(newValue, { action: 'move', toIndex, fromIndex })

    this.sendErrors((errors, name) => move(errors, name, fromIndex, toIndex))
  }

  onRemove = item => {
    const { value, onChange } = this.fieldProps
    if (value == null) return

    const index = value.indexOf(item)
    onChange(value.filter(v => v !== item))

    this.sendErrors((errors, name) => shift(errors, name, index))
  }

  sendErrors(fn) {
    const { name } = this.fieldProps
    const { errors, onError } = this.meta
    onError(fn(errors || {}, name))
  }

  mapValues = fn => {
    const { value, name } = this.fieldProps

    return value.map((item, index) => fn(item, `${name}[${index}]`, index))
  }

  items = () => {
    const { value: values, name } = this.fieldProps

    return !values
      ? []
      : values.map((value, index) => {
          const itemName = `${name}[${index}]`
          const itemErrors = filter(this.meta.errors, itemName)

          return {
            value,
            name: itemName,
            onChange: item => this.onUpdate(item, values[index]),
            meta: {
              ...this.meta,
              errors: itemErrors,
              valid: !Object.keys(itemErrors).length,
              invalid: !!Object.keys(itemErrors).length,
              onError: errors => this.onItemError(itemName, errors),
            },
          }
        })
  }

  render() {
    const { children, ...fieldProps } = this.props
    return (
      <Field {...fieldProps} noResolveType>
        {({ meta, ...props }) => {
          this.fieldProps = props
          this.meta = meta

          const nextProps = {
            ...props,
            meta,
            arrayHelpers: {
              items: this.items,
              add: this.onAdd,
              move: this.onMove,
              insert: this.onInsert,
              remove: this.onRemove,
              update: this.onUpdate,
            },
          }

          return typeof children === 'function'
            ? children(nextProps)
            : React.cloneElement(children, nextProps)
        }}
      </Field>
    )
  }
}

export default FieldArray
