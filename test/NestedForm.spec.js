import { mount } from 'enzyme'
import React from 'react'
import * as yup from 'yup'
import Form from '../src'
import NestedForm from '../src/NestedForm'

describe('NestedForm', () => {
  let schema = yup.object({
    name: yup.object({
      first: yup.string().default(''),
      last: yup.string().default(''),
    }),
  })

  it('should work', () => {
    let value, last
    let change = sinon.spy(v => (value = v))

    let wrapper = mount(
      <Form schema={schema} defaultValue={schema.default()} onChange={change}>
        <div>
          <NestedForm as="div" name="name">
            <Form.Field name="first" className="field" />
            <Form.Field name="last" className="field" />
          </NestedForm>
        </div>
      </Form>,
    )

    wrapper
      .find('.field')
      .first()
      .simulate('change', { target: { value: 'Jill' } })

    expect(change).have.been.calledOnce()

    expect(value).toEqual({
      name: {
        first: 'Jill',
        last: '',
      },
    })

    last = value

    wrapper
      .find('.field')
      .last()
      .simulate('change', { target: { value: 'Smith' } })

    expect(value).toEqual({
      name: {
        first: 'Jill',
        last: 'Smith',
      },
    })

    expect(value).not.toBe(last)
  })
})
