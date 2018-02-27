import React from 'react'
import { mount } from 'enzyme'
import yup from 'yup'

import From from '../src/Form'
import MessageTrigger from '../src/MessageTrigger'

describe('Trigger', () => {
  const schema = yup.object({ fieldA: yup.mixed() })

  it('should simulate event for name', () => {
    let spy = sinon.spy()
    mount(
      <From schema={schema} onValidate={spy}>
        <div>
          <MessageTrigger for="fieldA">
            <input />
          </MessageTrigger>
        </div>
      </From>
    )
      .find('input')
      .simulate('change')

    spy.should.have.been.calledOnce()
    spy.args[0][0].fields.should.eql(['fieldA'])
  })

  it('should simulate event for name with func child', () => {
    let spy = sinon.spy(),
      wrapper = mount(
        <From schema={schema} onValidate={spy}>
          <div>
            <MessageTrigger for="fieldA">
              {props => <input {...props} />}
            </MessageTrigger>
          </div>
        </From>
      )

    wrapper.find('input').simulate('change')

    spy.should.have.been.calledOnce()
    spy.args[0][0].fields.should.eql(['fieldA'])
  })

  it('should simulate event once with multiple names', () => {
    let spy = sinon.spy(),
      wrapper = mount(
        <From schema={schema} onValidate={spy}>
          <div>
            <MessageTrigger for={['fieldA', 'fieldB']}>
              <input />
            </MessageTrigger>
          </div>
        </From>
      )

    wrapper.find('input').simulate('change')

    spy.should.have.been.calledOnce()
    spy.args[0][0].fields.should.eql(['fieldA', 'fieldB'])
  })

  it('should simulate group', function(done) {
    function spy({ fields }) {
      fields.should.eql(['fieldA'])
      done()
    }

    let wrapper = mount(
      <From schema={schema} onValidate={spy}>
        <div>
          <MessageTrigger for={'fieldA'} group="foo">
            <input />
          </MessageTrigger>
          <MessageTrigger for={'fieldB'}>
            <input />
          </MessageTrigger>

          <MessageTrigger events="onClick" group="foo">
            <button />
          </MessageTrigger>
        </div>
      </From>
    )

    wrapper.find('button').simulate('click')
  })

  it('should simulate entire form', function(done) {
    function spy({ fields }) {
      fields.should.eql(['fieldA', 'fieldB'])
      done()
    }

    let wrapper = mount(
      <From schema={schema} onValidate={spy}>
        <div>
          <MessageTrigger for={'fieldA'} group="foo">
            <input />
          </MessageTrigger>
          <MessageTrigger for={'fieldB'}>
            <input />
          </MessageTrigger>

          <MessageTrigger events="onClick" group="@all">
            <button />
          </MessageTrigger>
        </div>
      </From>
    )

    wrapper.find('button').simulate('click')
  })

  it('should trigger a submit', function(done) {
    let wrapper = mount(
      <From schema={schema} onSubmit={() => done()}>
        <div>
          <MessageTrigger for={'fieldA'} group="foo">
            <input />
          </MessageTrigger>
          <MessageTrigger for={'fieldB'}>
            <input />
          </MessageTrigger>

          <MessageTrigger events="onClick" group="@submit">
            <button />
          </MessageTrigger>
        </div>
      </From>
    )

    wrapper.find('button').simulate('click')
  })
})
