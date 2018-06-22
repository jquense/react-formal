import React from 'react'
import { mount } from 'enzyme'
import * as yup from 'yup'

import Form from '../src'

const sleep = ms => new Promise(y => setTimeout(() => y(), ms))

describe('Triggers', () => {
  const schema = yup.object({ fieldA: yup.mixed(), fieldB: yup.mixed() })

  it('should simulate event for name', () => {
    let spy = sinon.spy(),
      wrapper = mount(
        <Form schema={schema} onValidate={spy}>
          <div>
            <Form.Field name="fieldA" noMeta>
              {props => <input {...props} value={props.value || ''} />}
            </Form.Field>
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
            <Form.Submit triggers={['fieldA', 'fieldB']}>
              {({ props: { onClick } }) => <button onClick={onClick} />}
            </Form.Submit>
          </div>
        </Form>
      )

    wrapper.find('button').simulate('click')

    spy.should.have.been.calledOnce()
    spy.args[0][0].fields.should.eql(['fieldA', 'fieldB'])
  })

  it('should simulate for `triggers`', function(done) {
    function spy({ fields }) {
      fields.should.eql(['fieldA'])
      done()
    }

    let wrapper = mount(
      <Form schema={schema} onValidate={spy}>
        <div>
          <Form.Field name={'fieldA'}>
            {props => <input {...props} value={props.value || ''} />}
          </Form.Field>
          <Form.Field name={'fieldB'}>
            {props => <input {...props} value={props.value || ''} />}
          </Form.Field>

          <Form.Submit events="onClick" triggers={['fieldA']}>
            {({ props }) => <button {...props} />}
          </Form.Submit>
        </div>
      </Form>
    )

    wrapper.find('button').simulate('click')
  })

  it('should trigger a submit', done => {
    let wrapper = mount(
      <Form schema={schema} onSubmit={() => done()}>
        <div>
          <Form.Field name="fieldA">
            {({ props }) => <input {...props} />}
          </Form.Field>

          <Form.Field name="fieldB">
            {({ props }) => <input {...props} />}
          </Form.Field>

          <Form.Submit>{({ props }) => <button {...props} />}</Form.Submit>
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
          <Form.Field name="fieldA">
            {({ meta }) => <span>submitting: {String(meta.submitting)}</span>}
          </Form.Field>
        </div>
      </Form>
    )

    let trigger = wrapper.find('span')

    trigger.text().should.equal('submitting: false')

    let promise = wrapper.instance().submit()

    trigger.text().should.equal('submitting: true')

    await promise

    trigger.text().should.equal('submitting: false')
  })
})
