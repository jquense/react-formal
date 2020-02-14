import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import * as yup from 'yup'
import Form from '../src'

describe('Field', () => {
  let schema = yup.object({
    name: yup.string().default(''),
    age: yup.number(),
    more: yup.object().when('name', {
      is: 'jason',
      then: yup.object({
        isCool: yup.bool(),
      }),
    }),
  })

  class TestInput extends React.Component {
    render() {
      return (
        <input
          value={this.props.value || ''}
          onChange={e => this.props.onChange(e, 'hi')}
        />
      )
    }
  }

  it('should pass props to inner type', () => {
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" as={TestInput} className="test" />
      </Form>,
    )
      .find(TestInput)
      .instance()
      .props.className.should.include('test') // test invalid-field
  })

  it('should fall back to using schema types', () => {
    let schema = yup.object({
      string: yup.string(),
      number: yup.number(),
      date: yup.date(),
      bool: yup.bool(),
    })

    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="string" />
        <Form.Field name="number" />
        <Form.Field name="date" />
        <Form.Field name="bool" />
        <Form.Field as="select" name="string" />
        <Form.Field as="textarea" name="string" />
      </Form>,
    )

    // console.log(wrapper.debug())
    wrapper.assertSingle(`input[name='string']`)
    wrapper.assertSingle('input[type="number"]')
    wrapper.assertSingle('input[type="date"]')

    wrapper.assertSingle('input[type="checkbox"]')
    wrapper.assertSingle('select')
    wrapper.assertSingle('textarea')
  })

  it('should use as override', () => {
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" as="select" />
        <Form.Field name="name" as="textarea" />
        <Form.Field name="name" as={TestInput} />
      </Form>,
    )
    wrapper.assertSingle(TestInput)
    wrapper.assertSingle('textarea')
    wrapper.assertSingle('select')
  })

  it('should fire onChange', done => {
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          as={TestInput}
          onChange={() => {
            done()
          }}
        />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change')
  })

  it('should pull value from event target', () => {
    let spy = sinon.spy()

    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    )
      //.tap(_ => console.log(_.debug()))
      .assertSingle('input')
      .simulate('change', { target: { value: 'foo' } })

    spy.should.have.been.calledWith({ name: 'foo' })
  })

  it('should coerce value to number', () => {
    let spy = sinon.spy()

    let form = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="age" id="first" />
        <Form.Field type="range" name="age" id="second" />
      </Form>,
    )

    form
      .find('input[type="number"]')
      .simulate('change', { target: { value: '3.56', type: 'number' } })

    spy.should.have.been.calledWith({ age: 3.56 })

    form
      .find('input[type="range"]')
      .simulate('change', { target: { value: '42', type: 'range' } })

    spy.should.have.been.calledWith({ age: 42 })
  })

  it('should update touched value', () => {
    let spy = sinon.spy()

    mount(
      <Form schema={schema} defaultValue={{}} onTouch={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', 'foo')

    spy.should.have.been.calledWith({ name: true }, ['name'])
  })

  it('should update touched once per field', () => {
    let spy = sinon.spy()

    mount(
      <Form schema={schema} defaultValue={{}} onTouch={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', 'foo')
      .simulate('change', 'bar')

    spy.callCount.should.equal(1)
  })

  it('ensures values are never undefined', () => {
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" />
      </Form>,
    )

    expect(wrapper.assertSingle('input').prop('value')).to.equal('')
  })

  it('maps value from string', () => {
    let spy = sinon.spy()
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} mapFromValue="value" />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('maps value from function', () => {
    let spy = sinon.spy()
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} mapFromValue={e => e.value} />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('gets value from accessor', () => {
    let spy = sinon.spy(model => model.other)
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapToValue={spy}
          mapFromValue={{
            other: e => e.value,
          }}
        />
      </Form>,
    )

    spy.should.have.been.and.calledWith({})

    wrapper.assertSingle('input').simulate('change', { value: 'john' })

    spy.should.have.been.and.calledWith({ other: 'john' })
  })

  it('maps values from hash', () => {
    let spy = sinon.spy()
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapFromValue={{
            name: e => e.value,
            text: 'text',
          }}
        />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', { value: 'john', text: 'hi' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john', text: 'hi' })
  })

  it('should pass all args to mapFromValue', function(done) {
    let spy = sinon.spy()
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapFromValue={(...args) => {
            args.length.should.equal(2)
            args[1].should.equal('hi')
            done()
          }}
        />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change')
  })

  it('should forward inner ref', () => {
    let inst
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          as={TestInput}
          ref={r => {
            inst = r
          }}
        />
      </Form>,
    )
    ;(inst instanceof TestInput).should.be.true()
  })

  it('should work with conditional schema', () => {
    const spy = sinon.stub(console, 'warn').callsFake(() => {})

    let render = name => {
      mount(
        <Form schema={schema} defaultValue={{ ...schema.default(), name }}>
          <Form.Field name="more.isCool" />
        </Form>,
      )
    }

    render('john')
    expect(spy).to.have.been.called()
  })

  describe.only('meta', () => {
    it('should pass meta to field', done => {
      let Input = ({ meta }) => {
        // //first pass isn't correct since form hasn't propagated it's state yet.
        // if (!meta.invalid) return null

        meta.invalid.should.equals(true)
        meta.valid.should.equals(false)

        meta.touched.should.equals(true)

        meta.errors.should.eqls({
          name: 'foo',
        })
        done()
        return null
      }

      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo' }}
          defaultTouched={{ name: true }}
        >
          <Form.Field name="name" as={Input} />
        </Form>,
      )
    })

    it('should pass meta to field with noValidate', done => {
      let Input = ({ meta }) => {
        meta.invalid.should.equals(true)
        meta.valid.should.equals(false)
        meta.errors.should.eqls({
          name: 'foo',
        })
        done()
        return null
      }

      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field noValidate name="name" as={Input} />
        </Form>,
      )
    })

    it('should field onError should remove existing errors', () => {
      let errorSpy = sinon.spy()
      act(() => {
        mount(
          <Form
            schema={schema}
            defaultValue={{}}
            defaultErrors={{ name: 'foo', bar: 'baz' }}
            onError={errorSpy}
          >
            <Form.Field name="name" as={TestInput} />
          </Form>,
        )
          .find(TestInput)
          .props()
          .meta.onError({})
      })

      errorSpy.should.have.been.calledOnce.and.calledWith({ bar: 'baz' })
    })

    it('should field onError should update field errors', () => {
      let errorSpy = sinon.spy()
      act(() => {
        mount(
          <Form
            schema={schema}
            defaultValue={{}}
            defaultErrors={{ name: 'foo', bar: 'baz' }}
            onError={errorSpy}
          >
            <Form.Field name="name" as={TestInput} />
          </Form>,
        )
          .find(TestInput)
          .props()
          .meta.onError({ name: 'foo', 'name.first': 'baz' })
      })

      errorSpy.should.have.been.calledOnce.and.calledWith({
        name: 'foo',
        'name.first': 'baz',
        bar: 'baz',
      })
    })

    it.only('should set events via a function', done => {
      let schema = yup.object({
        number: yup.number().min(5),
      })
      let spy = sinon.spy()
      let wrapper = mount(
        <Form
          delay={0}
          schema={schema}
          onValidate={spy}
          defaultValue={{ number: 6 }}
        >
          <Form.Field
            name="number"
            events={({ valid }) => (valid ? ['onBlur'] : ['onChange'])}
          />
        </Form>,
      )
      // Field is valid only; `onBlur`
      act(() => {
        wrapper.find('input').simulate('change', { target: { value: '4' } })
        wrapper.find('input').simulate('blur', { target: { value: '4' } })
      })
      setTimeout(() => {
        act(() => {
          spy.callCount.should.equal(1)
          // field is invalid now: `onChange`
          wrapper.find('input').simulate('blur', { target: { value: '4' } })

          spy.callCount.should.equal(1)

          wrapper.find('input').simulate('change', { target: { value: '6' } })

          spy.callCount.should.equal(2)
        })
        done()
      }, 100)
    })

    it('should field onError should replace field errors', () => {
      let errorSpy = sinon.spy()

      act(() => {
        mount(
          <Form
            schema={schema}
            defaultValue={{}}
            defaultErrors={{ name: 'foo', bar: 'baz' }}
            onError={errorSpy}
          >
            <Form.Field name="name" as={TestInput} />
          </Form>,
        )
          .find(TestInput)
          .props()
          .meta.onError({ 'name.first': 'baz' })
      })

      errorSpy.should.have.been.calledOnce.and.calledWith({
        'name.first': 'baz',
        bar: 'baz',
      })
    })
  })

  describe('inclusive active matching', () => {
    it('should count path matches', () => {
      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field name="name" errorClass="invalid" />
        </Form>,
      ).assertSingle('input.invalid')
    })

    it('should use inclusive active checking', () => {
      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field name="name" errorClass="invalid" />
        </Form>,
      ).assertSingle('input.invalid')
    })

    it('should respect `exclusive`', () => {
      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field exclusive name="name" errorClass="invalid" />
        </Form>,
      ).assertNone('input.invalid')
    })

    it('should respect `exclusive` and still have errors', () => {
      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field exclusive name="name" errorClass="invalid" />
        </Form>,
      ).assertSingle('input.invalid')
    })
  })

  xdescribe('form fields', () => {
    it('should inject onError', () => {
      mount(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field name="name" />
        </Form>,
      )
        .find('input')
        .prop('onError')
        .should.be.a('function')
    })

    // skip for now since name is still required.
    xit('should not inject onError for nameless fields', () => {
      mount(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field />
        </Form>,
      )
        .find('input')
        .prop('onError')
        .should.be.a('function')
    })

    it('should propagate onError to form', () => {
      let spy = sinon.spy()

      mount(
        <Form schema={schema} defaultValue={{}} onError={spy}>
          <Form.Field name="name" />
        </Form>,
      )
        .find('input')
        .prop('onError')({ foo: 'bar' })

      spy.should.have.been.calledOnce.and.calledWith({
        'name.foo': 'bar',
      })
    })

    it('should properly prefix nested errors', () => {
      const onError = mount(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field name="name" />
        </Form>,
      )
        .find('input')
        .prop('onError')

      onError({ foo: 'bar' }).should.eql({ 'name.foo': 'bar' })
      onError({ '[1].foo': 'bar' }).should.eql({ 'name[1].foo': 'bar' })
      onError({ '[1].baz.foo': 'bar' }).should.eql({ 'name[1].baz.foo': 'bar' })
    })
  })
})
