'use strict';

let React = require('react')
  , Input   = require('../Input.jsx')
  , { 
    Combobox
  , DropdownList
  , NumberPicker
  , Calendar
  , DateTimePicker
  , MultiSelect
  , SelectList } = require('react-widgets')

let wrapWithDefaults = 
  (Component, defaults) => props => ({
    props,
    render() {
      return React.createElement(Component, {...defaults, ...this.props})
    }
  })

let types = Object.create(null);

types.text           = 
  types.email        = Input
  
types.combobox       = Combobox
types.dropdownlist   = DropdownList
types.calendar       = Calendar
types.selectlist     = SelectList

types.date           = wrapWithDefaults(DateTimePicker, { time: false })
types.time           = wrapWithDefaults(DateTimePicker, { date: false })
types.datetimepicker = DateTimePicker

types.number         = 
  types.numberpicker = NumberPicker

types.array          =
  types.multiselect  = MultiSelect

module.exports = types
