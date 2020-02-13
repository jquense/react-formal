import React from 'react'
import { Schema } from 'yup'
import { Errors } from './types'
import { EMPTY_ERRORS } from './utils/ErrorUtils'

export const DEFAULT_CHANNEL = '@@parent'

// const isEqualOrNullish = (a, b) => a === b || (a == null && b == null)

// export const initial = {
//   errors: EMPTY_ERRORS,
//   touched: {},
//   submits: {
//     submitCount: 0,
//     submitAttempts: 0,
//     submitting: false,
//   },
// }

// export const FORM_DATA = {
//   VALUE: 1,
//   ERRORS: 2,
//   TOUCHED: 4,
//   SUBMITS: 8,
//   YUP_CONTEXT: 16,
//   NO_VALIDATE: 32,
// }

export interface FormActions {
  getSchemaForPath: (name?: string) => Schema<any> | undefined
  yupContext: any
  onSubmit: () => void
  onValidate: (fields: string[], event: string, args: any[]) => void
  onFieldError: (name: string, errors: Errors) => void
}

export const FormActionsContext = React.createContext<FormActions | null>(null)

export const FormErrorContext = React.createContext(EMPTY_ERRORS)

export const FormTouchedContext = React.createContext<Record<string, boolean>>(
  {},
)

export const FormSubmitsContext = React.createContext({
  submitCount: 0,
  submitAttempts: 0,
  submitting: false,
})
