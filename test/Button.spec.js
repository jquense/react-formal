import React from 'react'
import yup from 'yup'
import Form from '../src'

import { mount } from 'enzyme'

describe('Form Button', () => {
  it('should passthrough props', () => {
    mount(<Form.Button className="foo" />)
      .find('button.foo')
      .should.have.length(1)
  })

  it('should chain events', () => {
    let spy = sinon.spy()

    mount(<Form.Button onClick={spy} />).simulate('click')

    spy.should.have.been.calledOnce
  })
})
