var React = require('react')
  , yup = require('yup')
  , Form = require('../src');

var tsp = require('teaspoon')


let LeakySubmit = (props, context) => (
  <button type='submit' onClick={context.reactFormalContext.onSubmit}>
    Submit
  </button>
)

LeakySubmit.contextTypes = {
  reactFormalContext: React.PropTypes.object
}

describe('Form', ()=> {
  var schema = yup.object({
    name: yup.object({
      first: yup.string().default(''),
      last:  yup.string().default('')
    })
  })

  it('should update the form value', function(){
    var value, last
      , change = sinon.spy(v => value = v)
      , inst = tsp(
          <Form schema={schema} defaultValue={schema.default()} onChange={change}>
            <Form.Field name='name.first' className='field'/>
            <Form.Field name='name.last' className='field'/>
          </Form>
        ).render()

    inst.first('.field').trigger('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce

    value.should.eql({
      name: {
        first: 'Jill', last: ''
      }
    })

    last = value

    inst
      .last('.field')
      .trigger('change', { target: { value: 'Smith' } })

    value.should.eql({
      name: {
        first: 'Jill', last: 'Smith'
      }
    })

    value.should.not.equal(last)
  })

  it('should pass updated paths', function(){
    var paths
      , change = sinon.spy((_, p) => paths = p)
      , inst = tsp(
          <Form schema={schema} defaultValue={schema.default()} onChange={change}>
            <Form.Field
              name='name.first'
              className='field'
              mapValue={{
                'name.first': v => v.first,
                'name.last': v => v.last
              }}
            />
          </Form>
        ).render()

    let value = { first: 'Jill', last: 'smith' };

    inst
      .first('.field')
      .trigger('change', { target: { value } })

    paths.should.eql(['name.first', 'name.last'])
  })

  it('should respect noValidate', () => {
    var change = sinon.spy()
      , inst = tsp(
          <Form noValidate schema={schema} defaultValue={schema.default()} onValidate={change}>
            <Form.Field name='name.first' className='field'/>
            <Form.Field name='name.last' className='field'/>
          </Form>
        ).render()

      inst.first('.field').trigger('change')

      change.should.not.have.been.called

      inst
        .props({ noValidate: false })
        .first('.field')
        .trigger('change')

      change.should.have.been.called
  })

  it('should let native submits trigger onSubmit', function (done) {
    var spy = sinon.spy(() => done())
    var inst = tsp(
      <Form
        onSubmit={spy}
        schema={schema}
        defaultValue={{}}
      >
        <Form.Field name='name' type='text' className='test'/>
        <button type='submit'>Submit</button>
      </Form>
    )

    inst
      .render()
      .single('button')
      .dom()
      .click()
  })

  it('should deduplicate form submissions', function (done) {
    var spy = sinon.spy()
    var inst = tsp(
      <Form
        onSubmit={spy}
        schema={schema}
        defaultValue={{}}
      >
        <Form.Field name='name' type='text' className='test'/>
        <LeakySubmit />
      </Form>
    ).render()

    inst
      .single(LeakySubmit)
      .dom()
      .click()

    setTimeout(() => {
      spy.should.have.been.calledOnce
      done()
    }, 100)
  })

  it('should only report ValidationErrors', () => {
    var spy = sinon.spy()
    var inst = tsp(
      <Form
        onSubmit={()=> { throw 'foo!' }}
        onError={spy}
        schema={schema}
        defaultValue={{}}
      >
        <Form.Field name='name' type='text' className='test'/>
        <LeakySubmit />
      </Form>
    ).render()

    return inst.unwrap().submit().catch(err => {
      err.should.equal('foo!');
      spy.should.not.have.been.called;
    })
  })

  it('return hash of errors from a single error', () => {
    Form.toErrors(new yup.ValidationError('hello!', {}, 'path'))
      .should.to.eql({
        'path': [{
          message: 'hello!',
          values: undefined,
          type: undefined
        }]
      });
  })

  it('return hash of errors from aggregate error', () => {
    Form.toErrors(new yup.ValidationError([
      new yup.ValidationError('foo', null, 'bar'),
      new yup.ValidationError('bar', null, 'foo')
    ]))
      .should.to.eql({
        'foo': [{ message: 'bar', values: undefined, type: undefined }],
        'bar': [{ message: 'foo', values: undefined, type: undefined }]
      });
  })
})
