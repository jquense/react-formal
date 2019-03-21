import React, { useContext } from 'react'
import forwardRef from 'react-context-toolbox/forwardRef'
import shallowequal from 'shallowequal'
import { EMPTY_ERRORS } from './utils/ErrorUtils'

export const DEFAULT_CHANNEL = '@@parent'

const isEqualOrNullish = (a, b) => a === b || (a == null && b == null)

export const initial = {
  errors: EMPTY_ERRORS,
  touched: {},
  submits: {
    submitCount: 0,
    submitAttempts: 0,
    submitting: false,
  },
}

export const FORM_DATA = {
  VALUE: 1,
  ERRORS: 2,
  TOUCHED: 4,
  SUBMITS: 8,
  YUP_CONTEXT: 16,
  NO_VALIDATE: 32,
}

export const FormActionsContext = React.createContext(null)

// export const FormErrorsContext = React.createContext(null)
// export const FormSubmitMetaContext = React.createContext(null)
// export const FormValueContext = React.createContext(null)

// export const useErrors () => useContext()

export const FormDataContext = React.createContext(initial, (prev, next) => {
  let changed = 0
  if (!shallowequal(prev.errors, next.errors)) changed |= FORM_DATA.ERRORS
  if (!shallowequal(prev.submits, next.submits)) changed |= FORM_DATA.SUBMITS
  if (!isEqualOrNullish(prev.value, next.value)) changed |= FORM_DATA.VALUE

  return changed
})

export const withState = (render, bits, opts) =>
  forwardRef((props, ref) => {
    return (
      <FormDataContext.Consumer unstable_observedBits={bits}>
        {context => render(context, props, ref)}
      </FormDataContext.Consumer>
    )
  }, opts || {})
