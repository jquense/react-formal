import { useContext } from 'react'
import { Context } from 'topeka/BindingContext'

export function useFormValues(fields: string[] | string): any[] {
  const ctx = useContext(Context)
  return ([] as any[]).concat(fields).map(f => ctx.getValue(f))
}
