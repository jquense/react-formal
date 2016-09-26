import wrapWithDefaults from '../util/wrapWithDefaults';
import Bool from './Bool'
import Date from './Date'
import Number from './Number';
import Select from './Select'
import Input from './Input'

let localDt = 'datetime-local'

let types = Object.create(null);

types['']        =
  types.text     =
  types.string   = wrapWithDefaults(Input, { type: 'text' })

types.number     = Number

types.date       =
  types.time     =
  types.datetime =
  types[localDt] = Date

types.array      =
  types.listbox  = wrapWithDefaults(Select, { multiple: true })

types.bool       =
  types.boolean  = Bool

types.textarea   = wrapWithDefaults(Input, { tagName: 'textarea' })

types.select     = Select


export {
  Bool,
  Date,
  Number,
  Select,
  Input,
  types,
}
