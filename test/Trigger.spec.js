import React from 'react'
import { mount } from 'enzyme'
import * as yup from 'yup'

import Form from '../src'

const sleep = ms => new Promise(y => setTimeout(() => y(), ms))

describe('Trigger', () => {
  const schema = yup.object({ fieldA: yup.mixed(), fieldB: yup.mixed() })


  it('should simulate event for name', () => {
    let spy = sinon.spy(),
      wrapper = mount(
        <Form schema={schema} onValidate={spy}>
          <div>
            <Form.Trigger for="fieldA">
              {({ props }) => <input {...props} />}
            </Form.Trigger>
          </div>
        </Form>
      )

    wrapper.find('input').simulate('change')

    spy.should.have.been.calledOnce()
    spy.args[0][0].fields.should.eql(['fieldA'])
  })

  it('should simulate event once with multiple names', () => {
    let spy = sinon.spy(),
      wrapper = mount(
        <Form schema={schema} onValidate={spy}>
          <div>
            <Form.Trigger triggers={['fieldA', 'fieldB']}>
              {({ props }) => <input {...props} />}
            </Form.Trigger>
          </div>
        </Form>
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
      <Form schema={schema} onValidate={spy}>
        <div>
          <Form.Trigger for={'fieldA'} group="foo">
            {({ props }) => <input {...props} />}
          </Form.Trigger>
          <Form.Trigger for={'fieldB'}>
            {({ props }) => <input {...props} />}
          </Form.Trigger>

          <Form.Trigger events="onClick" group="foo">
          {({ props }) => <button {...props} />}
          </Form.Trigger>
        </div>
      </Form>
    )

    wrapper.find('button').simulate('click')
  })

  it('should trigger a submit', function(done) {
    let wrapper = mount(
      <Form schema={schema} onSubmit={() => done()}>
        <div>
          <Form.Trigger for={'fieldA'} group="foo">
            {({ props }) => <input {...props} />}
          </Form.Trigger>

          <Form.Trigger for={'fieldB'}>
            {({ props }) => <input {...props} />}
          </Form.Trigger>

          <Form.Trigger events="onClick" group="@submit">
          {({ props }) => <button {...props} />}
          </Form.Trigger>
        </div>
      </Form>
    )

    wrapper.find('button').simulate('click')
  })

  it('should handle submitting state', async () => {
    let spy = sinon.spy(() => sleep(50))

    let wrapper = mount(
      <Form schema={schema} submitForm={spy} formKey="foo">
        <div>
          <Form.Trigger for="fieldA">
            {({ submitting }) => `submitting: ${submitting}`}
          </Form.Trigger>
        </div>
      </Form>
    )

    let trigger = wrapper.find(Form.Trigger)

    trigger.text().should.equal('submitting: false')

    let promise = wrapper.instance().submit()

    trigger.text().should.equal('submitting: true')

    await promise

    trigger.text().should.equal('submitting: false')
  })
})
