import { mount } from 'enzyme'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as yup from 'yup'
import Form from '../src'
import Input from '../src/Input'

describe('Field', () => {
  let schema = yup.object({
    name: yup.string().default(''),
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
        <Form.Field name="name" type={TestInput} className="test" />
      </Form>
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
        <Form.Field type="select" name="string" />
        <Form.Field type="textarea" name="string" />
      </Form>
    )

    wrapper.assertSingle(`input[name='string']`)
    wrapper.assertSingle('input[type="number"]')
    wrapper.assertSingle('input[type="date"]')

    wrapper.assertSingle('input[type="checkbox"]')
    wrapper.assertSingle('select')
    wrapper.assertSingle('textarea')
  })

  it('should use schema metadata', () => {
    let schema = yup.object({
      string: yup.string().meta({
        reactFormalType: 'number',
      }),
    })

    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="string" />
      </Form>
    ).assertSingle('input[type="number"]')
  })

  it('should use type override', () => {
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" />
        <Form.Field name="name" type="textarea" />
        <Form.Field name="name" type={TestInput} />
      </Form>
    )
    wrapper.assertSingle(TestInput)
    wrapper.find('Input').length.should.equal(2)
  })

  it('should fire onChange', done => {
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" type={TestInput} onChange={() => done()} />
      </Form>
    )
      .assertSingle('input')
      .simulate('change')
  })

  it('should pull value from event target', () => {
    let spy = sinon.spy()

    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" type={TestInput} />
      </Form>
    )
      .assertSingle('input')
      .simulate('change', { target: { value: 'foo', tagName: 'input' } })

    spy.should.have.been.calledWith({ name: 'foo' })
  })

  it('ensures values are never undefined', () => {
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" />
      </Form>
    )

    expect(wrapper.assertSingle('Input').prop('value')).to.equal(null)
  })

  it('maps value from string', () => {
    let spy = sinon.spy()
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" type={TestInput} mapFromValue="value" />
      </Form>
    )
      .assertSingle('input')
      .simulate('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('maps value from function', () => {
    let spy = sinon.spy()
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" type={TestInput} mapFromValue={e => e.value} />
      </Form>
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
          type={TestInput}
          mapToValue={spy}
          mapFromValue={{
            other: e => e.value,
          }}
        />
      </Form>
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
          type={TestInput}
          mapFromValue={{
            name: e => e.value,
            text: 'text',
          }}
        />
      </Form>
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
          type={TestInput}
          mapFromValue={(...args) => {
            args.length.should.equal(2)
            args[1].should.equal('hi')
            done()
          }}
        />
      </Form>
    )
      .assertSingle('input')
      .simulate('change')
  })

  it('should add inner ref', () => {
    let inst
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          type={TestInput}
          fieldRef={r => {
            inst = r
          }}
        />
      </Form>
    )
    ;(inst instanceof TestInput).should.be.true()
  })

  it('should forward inner ref', () => {
    let inst
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          type={TestInput}
          ref={r => {
            inst = r
          }}
        />
      </Form>
    )
    ;(inst instanceof TestInput).should.be.true()
  })

  it('should work with conditional schema', () => {
    const spy = sinon.stub(console, 'error').callsFake(() => {})

    let render = name => {
      mount(
        <Form schema={schema} defaultValue={{ ...schema.default(), name }}>
          <Form.Field name="more.isCool" />
        </Form>
      )
    }
    // render('jason')
    // spy.should.not.have.been.called()
    render('john')
    spy.should.have.been.called()
  })

  describe('meta', () => {
    it('should pass meta to field', done => {
      let Input = ({ meta }) => {
        //first pass isn't correct since form hasn't propagated it's state yet.
        if (!meta.invalid) return null

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
          <Form.Field name="name" type={Input} />
        </Form>
      )
    })

    it('should pass meta to field with noValidate', done => {
      let Input = ({ meta }) => {
        //first pass isn't correct since form hasn't propagated it's state yet.
        if (!meta.invalid) return null

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
          <Form.Field noValidate name="name" type={Input} />
        </Form>
      )
    })

    it('should field onError should remove existing errors', () => {
      let errorSpy = sinon.spy()
      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name="name" type={TestInput} />
        </Form>
      )
        .find(TestInput)
        .props()
        .meta.onError({})

      errorSpy.should.have.been.calledOnce.and.calledWith({ bar: 'baz' })
    })

    it('should field onError should update field errors', () => {
      let errorSpy = sinon.spy()
      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name="name" type={TestInput} />
        </Form>
      )
        .find(TestInput)
        .props()
        .meta.onError({ name: 'foo', 'name.first': 'baz' })

      errorSpy.should.have.been.calledOnce.and.calledWith({
        name: 'foo',
        'name.first': 'baz',
        bar: 'baz',
      })
    })

    it('should field onError should replace field errors', () => {
      let errorSpy = sinon.spy()
      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name="name" type={TestInput} />
        </Form>
      )
        .find(TestInput)
        .props()
        .meta.onError({ 'name.first': 'baz' })

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
        </Form>
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
        </Form>
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
        </Form>
      ).assertNone('input.invalid')
    })

    it('should respect `exclusive` and still have errors', () => {
      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field exclusive name="name" errorClass="invalid" />
        </Form>
      ).assertSingle('input.invalid')
    })
  })

  xdescribe('form fields', () => {
    it('should inject onError', () => {
      mount(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field name="name" />
        </Form>
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
        </Form>
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
        </Form>
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
        </Form>
      )
        .find('input')
        .prop('onError')

      onError({ foo: 'bar' }).should.eql({ 'name.foo': 'bar' })
      onError({ '[1].foo': 'bar' }).should.eql({ 'name[1].foo': 'bar' })
      onError({ '[1].baz.foo': 'bar' }).should.eql({ 'name[1].baz.foo': 'bar' })
    })
  })
})
