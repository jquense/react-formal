import React from 'react'
import { mount } from 'enzyme'

import Form from '../src'

describe('Message', () => {
  it('should allow empty for', () => {
    let renderSpy = sinon.spy(msgs => {
      expect(msgs).toEqual(['hi', 'good day'])
      return null
    })
    mount(
      <Form noValidate defaultErrors={{ fieldA: 'hi', fieldB: 'good day' }}>
        <div>
          <Form.Message className="msg">{renderSpy}</Form.Message>
        </div>
      </Form>
    )

    expect(renderSpy).have.been.called()
  })

  it('should allow group summaries', done => {
    let renderSpy = sinon.spy(msgs => {
      expect(msgs).toEqual(['foo', 'hi', 'good day'])
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
      expect(renderSpy).have.been.called()
      done()
    }, 10)
  })
})
