var React = require('react/addons')
  , yup = require('yup')
  , Form = require('../src');

var $ = require('react-testutil-query')

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
      , inst = $(
          <Form schema={schema} defaultValue={schema.default()} onChange={change}>
            <Form.Field name='name.first' className='field'/>
            <Form.Field name='name.last' className='field'/>
          </Form>
        )

    inst.first('.field').trigger('change', { target: { value: 'Jill' } })

    change.should.have.been.calledOnce

    value.should.eql({ 
      name: { 
        first: 'Jill', last: ''
      } 
    })

    last = value

    inst.last('.field').trigger('change', { target: { value: 'Smith' } })

    value.should.eql({ 
      name: { 
        first: 'Jill', last: 'Smith'
      } 
    })

    value.should.not.equal(last)
  })

  it('should respect noValidate', done => {
    var value, last
      , change = sinon.spy()
      , inst = $(
          <Form noValidate schema={schema} defaultValue={schema.default()} onValidate={change}>
            <Form.Field name='name.first' className='field'/>
            <Form.Field name='name.last' className='field'/>
          </Form>
        )

      inst.first('.field').trigger('change')

      change.should.not.have.been.called

      inst[0].setProps({ noValidate: false }, () => {

        inst.first('.field').trigger('change')

        change.should.have.been.called
        done()
      })
  })
})