import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import createSlot from 'react-tackle-box/Slot'
import * as yup from 'yup'
import Form from '../src'
import { FormActionsContext } from '../src/Contexts'
import errorManager from '../src/errorManager'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

let LeakySubmit = () => (
  <FormActionsContext.Consumer>
    {({ onSubmit }) => (
      <button type="submit" onClick={onSubmit}>
        Submit
      </button>
    )}
  </FormActionsContext.Consumer>
)

describe('Form', () => {
  let attachTo
  let schema = yup.object({
    name: yup.object({
      first: yup.string().default(''),
      last: yup.string().default(''),
    }),
  })

  beforeEach(() => {
    attachTo = document.createElement('div')
    document.body.appendChild(attachTo)
  })

  afterEach(() => {
    document.body.removeChild(attachTo)
  })

  it('should expose setter', () => {
    Form.setter('foo', {}, 5).should.eql({ foo: 5 })
  })

  it('should expose setter', () => {
    Form.getter('foo', { foo: 5 }).should.equal(5)
  })

  it('should pass errors', () => {
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
    let paths,
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

  xit('should respect noValidate', () => {
    let change = sinon.spy(),
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

  it('should let native submits simulate onSubmit', async () => {
    let spy = sinon.spy()

    let wrapper = mount(
      <Form onSubmit={spy} schema={schema} defaultValue={{}}>
        <Form.Field name="name" type="text" className="test" />
        <button type="submit">Submit</button>
      </Form>
    )

    await act(() => {
      wrapper.assertSingle('button').simulate('submit')

      return wait()
    })

    expect(spy).to.have.been.calledOnce()
  })

  it('should deduplicate form submissions', async () => {
    let spy = sinon.spy()
    let wrapper = mount(
      <Form onSubmit={spy} schema={schema} defaultValue={{}}>
        <Form.Field name="name" type="text" className="test" />
        <Form.Submit type="submit" />
      </Form>,
      { attachTo }
    )

    await act(() => {
      wrapper
        .assertSingle('button')
        .getDOMNode()
        .click()
      return wait()
    })

    spy.should.have.been.calledOnce()
  })

  it("doesn't call submitForm on error", async () => {
    let onInvalidSubmit = sinon.spy()
    let submitForm = sinon.spy(() => Promise.resolve())

    let wrapper = mount(
      <Form
        submitForm={submitForm}
        onInvalidSubmit={onInvalidSubmit}
        schema={schema.shape({
          foo: yup.string().required(),
        })}
        defaultValue={{}}
      >
        <Form.Field name="name" type="text" className="test" />
        <Form.Submit type="submit" />
      </Form>
    )

    await act(() => {
      wrapper.assertSingle('FormSubmit').simulate('click')
      return wait(100)
    })

    onInvalidSubmit.should.have.been.calledOnce()
    submitForm.should.not.have.been.called()
  })

  it('calls submitForm on success', async () => {
    let onSubmit = sinon.spy()
    let submitForm = sinon.spy(() => Promise.resolve())

    let wrapper = mount(
      <Form
        onSubmit={onSubmit}
        submitForm={submitForm}
        schema={schema}
        defaultValue={{}}
      >
        <Form.Field name="name" type="text" className="test" />
        <Form.Submit type="submit" />
      </Form>
    )

    await act(() => {
      wrapper.assertSingle('FormSubmit').simulate('click')
      return wait()
    })

    onSubmit.should.have.been.calledOnce()
    submitForm.should.have.been.calledOnce()
    submitForm.should.have.been.calledAfter(onSubmit)
  })

  it('submits through a Slot', async () => {
    let onSubmit = sinon.spy()
    let submitForm = sinon.spy(() => Promise.resolve())

    let Slot = createSlot()

    let wrapper = mount(
      <div>
        <Form
          onSubmit={onSubmit}
          submitForm={submitForm}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name="name" type="text" className="test" />
          <Slot.Entry waitForOutlet>
            <Form.Submit type="submit" />
          </Slot.Entry>
        </Form>

        <Slot.Outlet />
      </div>
    )

    await act(() => {
      wrapper.assertSingle('FormSubmit').simulate('click')
      return wait()
    })

    onSubmit.should.have.been.calledOnce()
    submitForm.should.have.been.calledOnce()
    submitForm.should.have.been.calledAfter(onSubmit)
  })

  it('does not submit while already submitting', async () => {
    let ref = React.createRef()
    let onSubmit = sinon.spy()
    let submitForm = sinon.spy(() => new Promise(r => setTimeout(r, 5)))

    let wrapper = mount(
      <div>
        <Form
          ref={ref}
          onSubmit={onSubmit}
          submitForm={submitForm}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name="name" type="text" className="test" />
          <Form.Submit type="submit" />
        </Form>
      </div>
    )

    await act(async () => {
      wrapper
        .assertSingle('FormSubmit')
        .simulate('click')
        .simulate('click')

      await ref.current.submit()
    })

    onSubmit.should.have.been.calledOnce()
    submitForm.should.have.been.calledOnce()
  })

  it('should only report ValidationErrors', () => {
    let ref = React.createRef()

    let spy = sinon.spy()
    mount(
      <div>
        <Form
          ref={ref}
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
      </div>
    )

    return act(async () => {
      await ref.current.submit().catch(err => {
        err.should.equal('foo!')
        spy.should.not.have.been.called()
      })
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

    it('remove errors for branches', async () => {
      let spy = sinon.spy(errors => {
        errors.should.not.have.key('name.first')
      })

      await act(() => {
        mount(
          <Form
            delay={0}
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

        return wait(10)
      })

      expect(spy).to.have.been.calledOnce()
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
