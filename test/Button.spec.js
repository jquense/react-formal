import { mount } from 'enzyme'
import React from 'react'
import Form from '../src'

describe('Form Button', () => {
  it('should passthrough props', () => {
    expect(mount(<Form.Submit className="foo" />)
      .find('button.foo')).toHaveLength(1)
  })

  it('should chain events', () => {
    let stub = sinon.stub(console, 'error')
    let spy = sinon.spy()

    mount(<Form.Submit onClick={spy} />).simulate('click')

    expect(spy).have.been.calledOnce()

    expect(stub).have.been.calledOnce()
    stub.restore()
  })
})
