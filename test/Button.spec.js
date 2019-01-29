import React from 'react'
import Form from '../src'

import { mount } from 'enzyme'

describe('Form Button', () => {
  it('should passthrough props', () => {
    mount(<Form.Submit className="foo" />)
      .find('button.foo')
      .should.have.length(1)
  })

  it('should chain events', () => {
    let stub = sinon.stub(console, 'error')
    let spy = sinon.spy()

    mount(<Form.Submit onClick={spy} />).simulate('click')

    spy.should.have.been.calledOnce()

    stub.should.have.been.calledOnce()
    stub.restore()
  })

  it('should render with child function', () => {
    mount(
      <Form.Submit>
        {({ submitting }) => <button>{`busy: ${submitting}`}</button>}
      </Form.Submit>
    )
      .find('button')
      .text()
      .should.equal('busy: false')
  })
})
