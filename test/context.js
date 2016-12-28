var React = require('react')
  , yup = require('yup')
  , Form = require('../src');

var tsp = require('teaspoon')

describe('Form Context', ()=> {
  var schema = yup.object({
    name: yup.string().default('')
  })

  it('should trigger an onSubmit in the Form', function(done) {
    var inst = tsp(
        <Form
          onSubmit={sinon.spy(() => done())}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name='name' type='text' className='test'/>
          <Form.Button type='submit' />
        </Form>
    )

    inst
      .render()
      .find(Form.Button)
      .trigger('click')
  })

  it('should trigger an onSubmit from outside the form', function(done) {
    var inst = tsp(
      <Form.Context>
        <Form
          onSubmit={sinon.spy(() => done())}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name='name' type='text' className='test'/>
        </Form>
        <Form.Button type='submit' />
      </Form.Context>
    )

    inst
      .render()
      .find(Form.Button)
      .trigger('click')
  })

  it('should trigger an onSubmit in correct Form', function(done) {
    var inst = tsp(
      <Form.Context>
        <Form
          formKey="foo"
          onSubmit={sinon.spy(() => setTimeout(() => done()))}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name='name' type='text' className='test'/>
        </Form>
        <Form
          onSubmit={sinon.spy(() => done(new Error('submitted wrong form!')) )}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name='name' type='text' className='test'/>
        </Form>

        <Form.Button type='submit' formKey="foo" />
      </Form.Context>
    )

    inst
      .render()
      .find(Form.Button)
      .trigger('click')
  })

  it('should track multiple forms per context', function(done) {
    let count = 0;
    let spy = sinon.spy(() => {
      if (++count == 2) done();
    })

    var inst = tsp(
      <Form.Context>
        <Form
          formKey="foo"
          onSubmit={spy}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name='name' type='text' className='test'/>
        </Form>
        <Form
          formKey="bar"
          onSubmit={spy}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name='name' type='text' className='test'/>
        </Form>
        <Form.Button type='submit' formKey="foo" />
        <Form.Button type='submit' formKey="bar" />
      </Form.Context>
    )

    inst
      .render()
      .find(Form.Button)
      .trigger('click')
  })

  it('should not submit to different channels', function(done) {
    var inst = tsp(
      <Form.Context>
        <Form
          formKey="foo"
          onSubmit={sinon.spy(() => { throw new Error()})}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name='name' type='text' className='test'/>
        </Form>
        <Form.Button type='submit' formKey="bar" />
      </Form.Context>
    )

    inst
      .render()
      .find(Form.Button)
      .trigger('click')

    setTimeout(() => done(), 10)
  })

  it('should not allow submit past form', (done) => {
    var inst = tsp(
      <Form.Context>
        <Form
          schema={schema}
          defaultValue={{}}
        >
          <Form.Button type='submit' formKey="bar" />
          <Form.Field name='name' type='text' className='test'/>
        </Form>
      </Form.Context>
    )

    try {
      inst
        .render()
        .find(Form.Button)
        .trigger('click')
    } catch (err) {
      err.message.should.equal('Cannot trigger a submit for a Form from within a different form')
      done()
    }
  })
})
