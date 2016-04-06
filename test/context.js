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
})
