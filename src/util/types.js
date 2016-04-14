'use strict';

let React = require('react')
  , Input   = require('../inputs/Input')
  , DateInput = require('../inputs/Date')
  , NumberInput = require('../inputs/Number')
  , BoolInput = require('../inputs/Bool')
  , SelectInput = require('../inputs/Select')

let localDt = 'datetime-local'

let wrapWithDefaults =
  (Component, defaults) => class extends React.Component {
    render() {
      return React.createElement(Component, {
        ...defaults,
        ...this.props,
        type: defaults.type || this.props.type
      })
    }
  }

let types = Object.create(null);

types.string     = wrapWithDefaults(Input, { type: 'text'})
types.number     = NumberInput
types.date       =
  types.time     =
  types.datetime =
  types[localDt] = DateInput

types.array      =
  types.listbox  = wrapWithDefaults(SelectInput, { multiple: true })

types.bool       =
  types.boolean  = BoolInput

types.textarea   = wrapWithDefaults(Input, { tagName: 'textarea' })

types.select     = SelectInput

export default types
