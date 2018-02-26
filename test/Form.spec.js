import { mount } from 'enzyme'
import React from 'react'
import yup from 'yup'

import Form from '../src'
import { Consumer } from '../src/Form'
import errorManager from '../src/errorManager'

let LeakySubmit = () => (
  <Consumer>
    {({ onSubmit }) => (
      <button type="submit" onClick={onSubmit}>
        Submit
      </button>
    )}
  </Consumer>
)

describe('Form', () => {
  var schema = yup.object({
    name: yup.object({
      first: yup.string().default(''),
      last: yup.string().default(''),
    }),
  })

  it('should expose setter', () => {
    Form.setter('foo', {}, 5).should.eql({ foo: 5 })
  })

  it('should expose setter', () => {
    Form.getter('foo', { foo: 5 }).should.equal(5)
  })

  it('should pass messages', () => {
    let wrapper = mount(
      <Form schema={schema} defaultErrors={{ fieldA: ['hi', 'good day'] }}>
        <div>
          <Form.Message for="fieldA" className="msg" />
          <Form.Message for="fieldB" className="msg" />
        </div>
      </Form>
    )

    wrapper
      .find('span.msg')
      .text()
      .should.equal('hi, good day')
  })

  it('should update the form value', function() {
    let value, last
    let change = sinon.spy(v => (value = v))

    let wrapper = mount(
      <Form schema={schema} defaultValue={schema.default()} onChange={change}>
        <Form.Field name="name.first" className="field" />
        <Form.Field name="name.last" className="field" />
      </Form>
    )

    wrapper
      .find('.field')
      .first()
      .simulate('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce()

    value.should.eql({
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

    value.should.eql({
      name: {
        first: 'Jill',
        last: 'Smith',
      },
    })

    value.should.not.equal(last)
  })

  it('should pass updated paths', function() {
    var paths,
      change = sinon.spy((_, p) => (paths = p)),
      wrapper = mount(
        <Form schema={schema} defaultValue={schema.default()} onChange={change}>
          <Form.Field
            name="name.first"
            className="field"
            mapFromValue={{
              'name.first': v => v.first,
              'name.last': v => v.last,
            }}
          />
        </Form>
      )

    let value = { first: 'Jill', last: 'smith' }

    wrapper
      .find('.field')
      .first()
      .simulate('change', { target: { value } })

    paths.should.eql(['name.first', 'name.last'])
  })

  it('should respect noValidate', () => {
    var change = sinon.spy(),
      wrapper = mount(
        <Form
          noValidate
          schema={schema}
          defaultValue={schema.default()}
          onValidate={change}
        >
          <Form.Field name="name.first" className="field" />
          <Form.Field name="name.last" className="field" />
        </Form>
      )

    wrapper
      .find('.field')
      .first()
      .simulate('change')

    change.should.not.have.been.called()

    wrapper
      .setProps({ noValidate: false })
      .find('.field')
      .first()
      .simulate('change')

    change.should.have.been.called()
  })

  it('should let native submits simulate onSubmit', function(done) {
    var spy = sinon.spy(() => done())
    var wrapper = mount(
      <Form onSubmit={spy} schema={schema} defaultValue={{}}>
        <Form.Field name="name" type="text" className="test" />
        <button type="submit">Submit</button>
      </Form>
    )

    wrapper
      .assertSingle('button')
      .simulate('submit')
  })

  it('should deduplicate form submissions', function(done) {
    var spy = sinon.spy()
    var wrapper = mount(
      <Form onSubmit={spy} schema={schema} defaultValue={{}}>
        <Form.Field name="name" type="text" className="test" />
        <LeakySubmit />
      </Form>
    )

    wrapper
      .assertSingle(LeakySubmit)
      .simulate('submit')

    setTimeout(() => {
      spy.should.have.been.calledOnce()
      done()
    }, 100)
  })

  it('should only report ValidationErrors', () => {
    var spy = sinon.spy()
    var wrapper = mount(
      <Form
        onSubmit={() => {
          throw 'foo!'
        }}
        onError={spy}
        schema={schema}
        defaultValue={{}}
      >
        <Form.Field name="name" type="text" className="test" />
        <LeakySubmit />
      </Form>
    )

    return wrapper
      .instance()
      .submit()
      .catch(err => {
        err.should.equal('foo!')
        spy.should.not.have.been.called()
      })
  })

  it('return hash of errors from a assertSingle error', () => {
    Form.toErrors(new yup.ValidationError('hello!', {}, 'path')).should.to.eql({
      path: [
        {
          message: 'hello!',
          values: undefined,
          type: undefined,
        },
      ],
    })
  })

  it('return hash of errors from aggregate error', () => {
    Form.toErrors(
      new yup.ValidationError([
        new yup.ValidationError('foo', null, 'bar'),
        new yup.ValidationError('bar', null, 'foo'),
      ])
    ).should.to.eql({
      foo: [{ message: 'bar', values: undefined, type: undefined }],
      bar: [{ message: 'foo', values: undefined, type: undefined }],
    })
  })

  describe('Field validation', () => {
    let schema

    beforeEach(() => {
      schema = yup.object({
        name: yup.object({
          meta: yup.object(),
          first: yup.string(),
          last: yup.string(),
        }),
      })
    })

    it('remove errors for branches', done => {
      let spy = errors => {
        errors.should.not.have.key('name.first')
        done()
      }

      mount(
        <Form
          onError={spy}
          schema={schema}
          errors={{ 'name.first': ['invalid'] }}
          defaultValue={{}}
        >
          <Form.Field name="name" />
          <Form.Field name="name.first" />
        </Form>
      )
        .find('input[name="name"]')
        .simulate('change')
    })

    it('should deduplicate validation paths', () => {
      let paths = []

      return errorManager(path => {
        paths.push(path)
      })
        .collect(['name', 'name.meta', 'name.first'])
        .then(() => {
          paths.should.eql(['name'])
        })
    })

    it('should remove paths', () => {
      let errors = {
        name: ['invalid'],
        'name.meta': ['invalid'],
        'name.first': ['invalid'],
        id: ['invalid'],
      }

      return errorManager(() => {})
        .collect('name', errors)
        .then(errors => {
          errors.should.eql({
            id: ['invalid'],
          })
        })
    })

    it('should return same object when unchanged', () => {
      let errors = {
        name: ['invalid'],
        'name.meta': ['invalid'],
        'name.first': ['invalid'],
        id: ['invalid'],
      }

      return errorManager(() => {})
        .collect('foo', errors)
        .then(newErrors => {
          errors.should.equal(newErrors)
        })
    })
  })
})
