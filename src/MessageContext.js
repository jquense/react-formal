import pick from 'lodash/pick'
import React from 'react'

import { Consumer as FormConsumer } from './Form'
import FormContext from './FormContext'

function messagesForNames(messages, names) {
  if (!names.length) return messages
  return pick(messages, names)
}


/* eslint-disable react/prop-types */
function Consumer({
  children,
  for: names,
  group,
  resolveNames,
  mapMessages = messagesForNames,
  formKey: propFormKey,
}) {
  return (
    <FormConsumer>
      {({ formKey }) => (
        <FormContext.Subscriber channel={`${propFormKey || formKey || '@@parent'}:messages`}>
          {data => {
            if (!data) return children({}, null)

            const { messages, ...container } = data
            names = resolveNames
              ? resolveNames()
              : names || container.namesForGroup(group)

            const mappedMessages = mapMessages(
              messages,
              names ? [].concat(names) : []
            )

            return children(mappedMessages, container)
          }}
        </FormContext.Subscriber>
      )}
    </FormConsumer>
  )
}
/* eslint-enable react/prop-types */

export default {
  Consumer,
}
