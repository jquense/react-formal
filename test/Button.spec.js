import React from 'react'
import Form from '../src'

import { mount } from 'enzyme'

describe('Form Button', () => {
  it('should passthrough props', () => {
    mount(<Form.Button className="foo" />)
      .find('button.foo')
      .should.have.length(1)
  })

  it('should chain events', () => {
    let stub = sinon.stub(console, 'error')
    let spy = sinon.spy()

    mount(<Form.Button onClick={spy} />).simulate('click')

    spy.should.have.been.calledOnce()

    stub.should.have.been.calledOnce()
    stub.restore()
  })

  it('should render with child function', () => {
    mount(
      <Form.Button>
        {({ submitting }) => <button>{`busy: ${submitting}`}</button>}
      </Form.Button>
    )
      .find('button')
      .text()
      .should.equal('busy: false')
  })
})
