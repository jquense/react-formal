import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import React from 'react'
import createContext from 'create-react-context'

import isReactComponent from './utils/isReactComponent'

const MessageContext = createContext({
  messages: {},
  addToGroup() {},
  namesForGroup() {},
  onValidate() {},
})

function messagesForNames(messages, names) {
  if (!names.length) return messages
  return pick(messages, names)
}

function Consumer({
  children,
  for: names,
  group,
  resolveNames,
  mapMessages = messagesForNames,
}) {
  return (
    <MessageContext.Consumer>
      {({ messages, ...container }) => {
        names = resolveNames
          ? resolveNames()
          : names || container.namesForGroup(group)

        const mappedMessages = mapMessages(
          messages,
          names ? [].concat(names) : []
        )

        return children(mappedMessages, container)
      }}
    </MessageContext.Consumer>
  )
}

export default {
  Consumer,
  Provider: MessageContext.Provider,
}
