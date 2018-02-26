import React from 'react'
import { mount } from 'enzyme'

import Form from '../src/Form'
import MessageTrigger from '../src/MessageTrigger'
import Message from '../src/ValidationMessage'

describe('Message', () => {
  it('should allow empty for', () => {
    let renderSpy = sinon.spy(msgs => {
      msgs.should.eql(['hi', 'good day'])
      return null
    })
    mount(
      <Form noValidate defaultErrors={{ fieldA: 'hi', fieldB: 'good day' }}>
        <div>
          <Message className="msg">{renderSpy}</Message>
        </div>
      </Form>
    )

    renderSpy.should.have.been.called()
  })

  it('should allow group summaries', () => {
    let renderSpy = sinon.spy(msgs => {
      msgs.should.eql(['foo', 'hi'])
      return null
    })

    mount(
      <Form
        noValidate
        defaultErrors={{ fieldA: ['foo', 'hi'], fieldB: 'good day' }}
      >
        <div>
          <MessageTrigger for="fieldA" group="test">
            <input />
          </MessageTrigger>
          <Message group="test" className="msg">
            {renderSpy}
          </Message>
        </div>
      </Form>
    )

    renderSpy.should.have.been.called()
  })
})
