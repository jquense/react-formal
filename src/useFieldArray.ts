import invariant from 'invariant'
import { useRef } from 'react'
import { Errors } from './types'
import useField, { FieldMeta, UseFieldOptions } from './useField'
import { move, remove, shift, unshift } from './utils/ErrorUtils'

export type FieldArrayMeta = FieldMeta

export interface FieldArrayHelpers<T = any> {
  update(item: T, oldItem: T): void

  add(item: T): void

  insert(item: T, index: number): void

  move(item: T, toIndex: number): void

  remove(item: T): void

  items(): Array<{
    value: T
    name: string
    onChange: (T) => void
    meta: FieldArrayMeta
  }>

  onItemError(name: string, errors: Errors): void
}

function filter(errors, baseName) {
  const paths = Object.keys(errors || {})
  const result = {}

  paths.forEach(path => {
    if (path.indexOf(baseName) !== 0) return
    result[path] = errors[path]
  })

  return result
}

export type UseFieldArrayOptions = UseFieldOptions

export function useFieldArray<T = any>(props: UseFieldArrayOptions) {
  const [fieldProps, meta] = useField(props)

  const { errors, onError, value, onChange } = meta

  const sendErrors = (fn: (e: Errors, n: string) => Errors) => {
    onError(fn(errors || {}, props.name))
  }

  const helpersRef = useRef<FieldArrayHelpers<T>>({
    add: item => {
      const { value } = fieldProps
      helpersRef.current.insert(item, value ? value.length : 0)
    },

    onItemError: (name, errors) => {
      sendErrors(fieldErrors => ({
        ...remove(fieldErrors, name),
        ...errors,
      }))
    },

    update: (updatedItem, oldItem) => {
      const index = value.indexOf(oldItem)
      const newValue = value == null ? [] : [...value]

      newValue.splice(index, 1, updatedItem)

      onChange(newValue)
    },

    insert: (item, index) => {
      const newValue = value == null ? [] : [...value]

      newValue.splice(index, 0, item)

      onChange(newValue)
      sendErrors((errors, name) => unshift(errors, name, index))
    },

    move: (item, toIndex) => {
      const fromIndex = value.indexOf(item)
      const newValue = value == null ? [] : [...value]

      invariant(
        fromIndex !== -1,
        '`onMove` must be called with an item in the array',
      )

      newValue.splice(toIndex, 0, ...newValue.splice(fromIndex, 1))

      // FIXME: doesn't handle syncing error state. , { action: 'move', toIndex, fromIndex }
      onChange(newValue)

      sendErrors((errors, name) => move(errors, name, fromIndex, toIndex))
    },

    remove: item => {
      if (value == null) return

      const index = value.indexOf(item)
      onChange(value.filter(v => v !== item))

      sendErrors((errors, name) => shift(errors, name, index))
    },

    items: () => {
      const values = value
      return !values
        ? []
        : values.map((value, index) => {
            const itemName = `${props.name}[${index}]`
            const itemErrors = filter(meta.errors, itemName)

            return {
              value,
              name: itemName,
              onChange: item => helpersRef.current.update(item, values[index]),
              meta: {
                ...meta,
                errors: itemErrors,
                valid: !Object.keys(itemErrors).length,
                invalid: !!Object.keys(itemErrors).length,
                onError: errors =>
                  helpersRef.current.onItemError(itemName, errors),
              },
            }
          })
    },
  })

  return [fieldProps, meta, helpersRef.current] as const
}
