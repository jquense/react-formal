import React from 'react';
import Input from '../inputs/Input';
import DateInput from '../inputs/Date';
import NumberInput from '../inputs/Number';
import BoolInput from '../inputs/Bool';
import FileInput from '../inputs/File';
import SelectInput from '../inputs/Select';

let localDt = 'datetime-local'

let wrapWithDefaults =
  (Component, defaults) => class extends React.Component {
    static propTypes = {
      type: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func,
      ]),
    };

    render() {
      return React.createElement(Component, {
        ...defaults,
        ...this.props,
        type: defaults.type || this.props.type
      })
    }
  }

let types = Object.create(null);

types.string = wrapWithDefaults(Input, { type: 'text'})
types.number = NumberInput

types.date =
  types.time =
  types.datetime =
  types[localDt] = DateInput

types.array =
  types.listbox = wrapWithDefaults(SelectInput, { multiple: true })

types.bool =
  types.boolean = BoolInput

types.textarea = wrapWithDefaults(Input, { tagName: 'textarea' })

types.select = SelectInput;
types.file = FileInput;

export default types
