import PropTypes from 'prop-types'
import React from 'react'
import { RenderFieldProps } from './useField'
import {
  FieldArrayHelpers,
  FieldArrayMeta,
  UseFieldArrayOptions,
  useFieldArray,
} from './useFieldArray'
import { useMergedHandlers } from './utils/useEventHandlers'

export type RenderFieldArrayProps = RenderFieldProps & {
  arrayHelpers: FieldArrayHelpers
  meta: FieldArrayMeta
  ref: React.Ref<any>
}

export type FieldArrayProps = UseFieldArrayOptions & {
  children: (
    props: RenderFieldArrayProps,
    meta: FieldArrayMeta,
    helpers: FieldArrayHelpers,
  ) => React.ReactNode
}

function FieldArray({ children, ...props }: FieldArrayProps) {
  const [field, meta, arrayHelpers] = useFieldArray(props)

  const nextProps: any = {
    ...field,
    ...useMergedHandlers(meta.events, props, field),
  }

  return <>{children(nextProps, meta, arrayHelpers)}</>
}

FieldArray.displayName = 'FieldArray'

// @ts-ignore
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
