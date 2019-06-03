import invariant from 'invariant'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { move, remove, shift, unshift } from './utils/ErrorUtils'

import { useField, useMergedHandlers } from './Field'

function filter(errors, baseName) {
  const paths = Object.keys(errors || {})
  const result = {}

  paths.forEach(path => {
    if (path.indexOf(baseName) !== 0) return
    result[path] = errors[path]
  })

  return result
}

export function useFieldArray(props) {
  const [field, meta] = useField(props)
  const { value, onChange } = field
  const { errors, onError } = meta

  const helperRef = useRef({})
  const helpers = helperRef.current

  const sendErrors = fn => {
    onError(fn(errors || {}, props.name))
  }

  helpers.onAdd = item => {
    const { value } = this.fieldProps
    helperRef.current.insert(item, value ? value.length : 0)
  }

  helpers.onItemError = (name, errors) => {
    sendErrors(fieldErrors => ({
      ...remove(fieldErrors, name),
      ...errors,
    }))
  }

  helpers.update = (updatedItem, oldItem) => {
    const index = value.indexOf(oldItem)
    const newValue = value == null ? [] : [...value]

    newValue.splice(index, 1, updatedItem)

    onChange(newValue)
  }

  helpers.insert = (item, index) => {
    const newValue = value == null ? [] : [...value]

    newValue.splice(index, 0, item)

    onChange(newValue)
    sendErrors((errors, name) => unshift(errors, name, index))
  }

  helpers.move = (item, toIndex) => {
    const fromIndex = value.indexOf(item)
    const newValue = value == null ? [] : [...value]

    invariant(
      fromIndex !== -1,
      '`onMove` must be called with an item in the array'
    )

    newValue.splice(toIndex, 0, ...newValue.splice(fromIndex, 1))

    // FIXME: doesn't handle syncing error state.
    onChange(newValue, { action: 'move', toIndex, fromIndex })

    sendErrors((errors, name) => move(errors, name, fromIndex, toIndex))
  }

  helpers.remove = item => {
    if (value == null) return

    const index = value.indexOf(item)
    onChange(value.filter(v => v !== item))

    sendErrors((errors, name) => shift(errors, name, index))
  }

  helpers.items = () => {
    const values = value
    return !values
      ? []
      : values.map((value, index) => {
          const itemName = `${props.name}[${index}]`
          const itemErrors = filter(meta.errors, itemName)

          return {
            value,
            name: itemName,
            onChange: item => helperRef.current.onUpdate(item, values[index]),
            meta: {
              ...meta,
              errors: itemErrors,
              valid: !Object.keys(itemErrors).length,
              invalid: !!Object.keys(itemErrors).length,
              onError: errors =>
                helperRef.current.onItemError(itemName, errors),
            },
          }
        })
  }

  return [field, meta, helpers]
}

/**
 * A specialized `Form.Field` component that helps with common list manipulations.
 * Provide a `name`, like normal, to the field with the array and `<FieldArray>` will
 * inject a set of special `arrayHelpers` for handling removing, reordering,
 * editing and adding new items, as well as any error handling quirks that come with those
 * operations.
 *
 * ```js { "editable": true }
 * const schema = yup.object({
 *   friends: yup.array().of(
 *     yup.object({
 *       name: yup.string().required()
 *     })
 *   )
 * });
 *
 * render(
 *  <Form
 *   debug
 *   schema={schema}
 *   defaultValue={{
 *     friends: [{ name: 'Sally'}]
 *   }}
 * >
 *   <Form.FieldArray name="friends" events="blur">
 *    {({ value, arrayHelpers }) => (
 *       <ul>
 *        {value.map((value, idx) => (
 *          <li key={idx} >
 *            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
 *              <Form.Field name={`friends[${idx}].name`} />
 *              <button type="button" onClick={() => arrayHelpers.remove(value)}>-</button>
 *              <button type="button" onClick={() => arrayHelpers.insert({ name: undefined }, idx)}>+</button>
 *            </div>
 *            <Form.Message for={`friends[${idx}].name`} />
 *          </li>
 *        ))}
 *       </ul>
 *     )}
 *   </Form.FieldArray>
 * </Form>
 * )
 * ```
 *
 */
const FieldArray = React.forwardRef((props, ref) => {
  const { children } = props
  const [field, meta, arrayHelpers] = useFieldArray(props)

  const nextProps = {
    ...props,
    ...field,
    ...useMergedHandlers(meta.events, props, field),
    meta,
    ref,
    arrayHelpers,
  }

  return typeof children === 'function'
    ? children(nextProps)
    : React.cloneElement(children, nextProps)
})

FieldArray.displayName = 'FieldArray'
FieldArray.propTypes = {
  name: PropTypes.string.isRequired,
  /**
   * The same signature as providing a function to `<Field>` but with an
   * additional `arrayHelpers` object passed to the render function
   *
   * @type {Function}
   */
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
}

export default FieldArray
