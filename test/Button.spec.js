import { mount } from 'enzyme'
import React from 'react'
import Form from '../src'

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
})
