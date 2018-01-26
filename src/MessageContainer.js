import PropTypes from 'prop-types';
import React from 'react';

import connectToMessageContainer from './connectToMessageContainer';

let uniq = array => array.filter((item, idx) => array.indexOf(item) === idx);

let add = (array, item) => array.indexOf(item) === -1 && array.push(item)

let remove = (array, item) => array.filter(i => i !== item)

const ALL_FIELDS = '@all';

class MessageContainer extends React.Component {

  static propTypes = {
    passthrough: PropTypes.bool,
    mapNames: PropTypes.func,
    messages: PropTypes.object,
    onValidationNeeded: PropTypes.func
  }

  static defaultProps = {
    messages: Object.create(null),
    mapNames: names => names,
  }

  static contextTypes = {
    messageContainer: PropTypes.object,
  }

  static childContextTypes = {
    messageContainer: PropTypes.object,
  }

  constructor(...args) {
    super(...args)
    this._handlers = []
    this._groups = Object.create(null)
  }

  componentWillReceiveProps(nextProps) {
    this._emit(nextProps)
  }

  getChildContext() {
    if (!this._context)
      this._context = {
        messageContainer: {
          addToGroup: this.addToGroup,
          namesForGroup: this.namesForGroup,
          subscribe: this.subscribe,
          onValidate: this.onValidate
        }
      }

    return this._context
  }

  namesForGroup = (groups) => {
    groups = groups ? [].concat(groups) : [];

    if (groups.indexOf(ALL_FIELDS) !== -1) {
      groups = Object.keys(this._groups);
    }

    return uniq(groups.reduce(
      (fields, group) => fields.concat(this._groups[group]), [])
    )
  };

  addToGroup = (grpName, names) => {
    if (grpName === ALL_FIELDS) return

    grpName = grpName || '@@unassigned-group';

    names = names && [].concat(names)

    let group = this._groups[grpName]

    if (!names || !names.length)
      return

    if (!group)
      group = this._groups[grpName] = []

    names.forEach(name => add(group, name))

    return () => names.forEach(name => remove(group, name))
  };

  onValidate = (fields, type, args) => {
    if (!fields || !fields.length) return

    let { mapNames, passthrough } = this.props;
    let { messageContainer } = this.context;

    if (messageContainer && passthrough) {
      messageContainer.onValidate(
        mapNames(fields),
        type,
        args
      )
      return;
    }

    this.props.onValidationNeeded &&
      this.props.onValidationNeeded({ type, fields, args })
  };

  subscribe = listener => {
    let context = this._listenerContext(this.props);

    this._handlers.push(listener)

    listener(context);

    return () => remove(this._handlers, listener)
  };

  _emit(props) {
    let context = this._listenerContext(props);
    this._handlers.forEach(fn => fn(context))
  }

  _listenerContext({ messages }) {
    return messages
  }

  render() {
    return this.props.children
  }
}

export default connectToMessageContainer(MessageContainer, {
  resolveNames: () => {},
  mapMessages: messages => messages,
  methods: [
    'namesForGroup',
    'addToGroup'
  ]
})
