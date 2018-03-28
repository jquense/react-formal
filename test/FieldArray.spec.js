import { mount } from 'enzyme'
import React from 'react'
import { object, array, string } from 'yup'

import Form from '../src'

describe('FieldArray', () => {
  let schema = object({
    colors: array()
      .of(
        object({
          name: string().required(),
          hexCode: string().required(),
        })
      )
      .default(() => [{ name: 'red', hexCode: '#ff0000' }]),
  })

  class ColorList extends React.Component {
    remove(index) {
      this.props.arrayHelpers.remove(this.props.value[index])
    }

    render() {
      const { value, name } = this.props

      return (
        <ul>
          {value.map((value, idx) => (
            <li key={`${value.hexCode}-${value.name}`}>
              <Form.Field name={`${name}[${idx}].name`} />
              <Form.Field name={`${name}[${idx}].hexCode`} />
            </li>
          ))}
        </ul>
      )
    }
  }

  it('should render forms correctly', () => {
    mount(
      <Form
        schema={schema}
        defaultValue={schema.default()}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <Form.FieldArray name="colors">
          {({ value }) => (
            <ul>
              {value.map((value, idx) => (
                <li key={idx}>
                  <Form.Field
                    name={`colors[${idx}].name`}
                    errorClass="invalid"
                  />
                  <Form.Field name={`colors[${idx}].hexCode`} />
                </li>
              ))}
            </ul>
          )}
        </Form.FieldArray>
      </Form>
    ).assertSingle('input.invalid')
  })

  it('should update the form value correctly', () => {
    let value, last
    let changeSpy = sinon.spy(v => (value = v))

    let wrapper = mount(
      <Form
        schema={schema}
        defaultValue={schema.default()}
        onChange={changeSpy}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <Form.FieldArray name="colors">
          {({ value }) => (
            <ul>
              {value.map((value, idx) => (
                <li key={idx}>
                  <Form.Field name={`colors[${idx}].name`} className="field" />
                  <Form.Field
                    name={`colors[${idx}].hexCode`}
                    className="field2"
                  />
                </li>
              ))}
            </ul>
          )}
        </Form.FieldArray>
      </Form>
    )

    wrapper
      .find('.field')
      .first()
      .simulate('change', { target: { value: 'beige' } })

    changeSpy.should.have.been.calledOnce()

    value.should.eql({
      colors: [
        {
          name: 'beige',
          hexCode: '#ff0000',
        },
      ],
    })

    last = value
    wrapper
      .find('.field2')
      .last()
      .simulate('change', { target: { value: 'LULZ' } })

    value.should.eql({
      colors: [
        {
          name: 'beige',
          hexCode: 'LULZ',
        },
      ],
    })

    value.should.not.equal(last)
  })

  it('should handle removing array items', () => {
    let value
    let changeSpy = sinon.spy(v => (value = v))
    let defaultValue = {
      colors: [
        { name: 'red', hexCode: '#ff0000' },
        { name: 'other red', hexCode: '#ff0000' },
      ],
    }

    let wrapper = mount(
      <Form
        schema={schema}
        onChange={changeSpy}
        defaultValue={defaultValue}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <Form.FieldArray name="colors">
          <ColorList />
        </Form.FieldArray>
      </Form>
    )

    let list = wrapper.find(ColorList)

    list.prop('value').should.have.length(2)

    list.instance().remove(1)

    value.should.eql({
      colors: [
        {
          name: 'red',
          hexCode: '#ff0000',
        },
      ],
    })
  })

  it('should shift errors for removed fields', async () => {
    let value, errors
    let errorSpy = sinon.spy(v => (errors = v))
    let changeSpy = sinon.spy(v => (value = v))
    let defaultValue = {
      colors: [
        { name: '', hexCode: '#ff0000' },
        { name: 'other red', hexCode: '#ff0000' },
      ],
    }

    let wrapper = mount(
      <Form
        schema={schema}
        onChange={changeSpy}
        onError={errorSpy}
        defaultValue={defaultValue}
      >
        <Form.FieldArray name="colors">
          <ColorList />
        </Form.FieldArray>
      </Form>
    )
    let list = wrapper.find(ColorList)
    list.prop('value').should.have.length(2)

    await wrapper.instance().submit()

    // First color has an error
    errors.should.have.property('colors[0].name')

    // remove the first color
    list.instance().remove(0)

    // The error for the first color should be gone
    errorSpy.should.have.been.calledTwice()
    errors.should.not.have.property('colors[0].name')

    value.should.eql({
      colors: [{ name: 'other red', hexCode: '#ff0000' }],
    })
  })
})
