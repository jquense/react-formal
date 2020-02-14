import { useContext } from 'react'
import { Context } from 'topeka/BindingContext'

function useFormValues(field: string): any
function useFormValues(fields: string[]): any[]
/**
 * @param {string|string[]} fields a field, or set of field, paths to observe.
 * @returns {any | Array<any>}
 */
function useFormValues(fields: string | string[]): any | any[] {
  const ctx = useContext(Context)
  return Array.isArray(fields)
    ? fields.map(f => ctx.getValue(f))
    : ctx.getValue(fields)
}

export default useFormValues
