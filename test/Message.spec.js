import React from 'react'
import { mount } from 'enzyme'

import Form from '../src'

describe('Message', () => {
  it('should allow empty for', () => {
    let renderSpy = sinon.spy(msgs => {
      msgs.should.eql(['hi', 'good day'])
      return null
    })
    mount(
      <Form noValidate defaultErrors={{ fieldA: 'hi', fieldB: 'good day' }}>
        <div>
          <Form.Message className="msg">{renderSpy}</Form.Message>
        </div>
      </Form>
    )

    renderSpy.should.have.been.called()
  })

  it('should allow group summaries', done => {
    let renderSpy = sinon.spy(msgs => {
      msgs.should.eql(['foo', 'hi', 'good day'])
      return null
    })

    mount(
      <Form
        noValidate
        defaultErrors={{
          fieldA: ['foo', 'hi'],
          fieldB: 'good day',
          fieldC: 'fooo',
        }}
      >
        <div>
          <Form.Message for={['fieldA', 'fieldB']} className="msg">
            {renderSpy}
          </Form.Message>
        </div>
      </Form>
    )

    setTimeout(() => {
      renderSpy.should.have.been.called()
      done()
    }, 10)
  })
})
