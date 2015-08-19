var React = require('react/addons')
  , yup = require('yup')
  , inputs = require('../src/inputs')
  , Form = require('../src');

var $ = require('react-testutil-query')

describe('Field', ()=> {
  var schema = yup.object({
    name: yup.string().default('')
  })

  class TestInput extends React.Component {
    render(){
      return <input {...this.props} onChange={ e => this.props.onChange(e, 'hi')}/>
    }
  }



  it('should pass props to inner type', function(){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={TestInput} className='test'/>
      </Form>)

    var input = inst.single(TestInput)[0]

    input.props.className.should.equal('test')
  })

  it('should fall back to using schema types', function(){
    var schema = yup.object({
      string: yup.string(),
      number: yup.number(),
      date:   yup.date(),
      bool:   yup.bool(),
      array:  yup.array().of(yup.string())
    })

    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='string'/>
        <Form.Field name='number'/>
        <Form.Field name='date'/>
        <Form.Field name='bool'/>
        <Form.Field name='array'/>
      </Form>)

    inst.single(inputs.Input)
    inst.single(inputs.Number)
    inst.single(inputs.Date)
    inst.single(inputs.Bool)
    inst.single(inputs.Select)
  })

  it('should use type override', function(){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name'/>
        <Form.Field name='name' type='textarea'/>
        <Form.Field name='name' type={TestInput}/>
      </Form>)

    inst.single(TestInput)
    inst.find(inputs.Input).length.should.equal(2)
  })

  it('should fire onChange', function(done){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={TestInput} onChange={()=> done()}/>
      </Form>)

    inst.single('input').trigger('change')
  })

  it('maps value from string', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name' type={TestInput} mapValue='value' />
      </Form>)

    inst.single('input').trigger('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('maps value from function', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name' type={TestInput} mapValue={e => e.value } />
      </Form>)

    inst.single('input').trigger('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('maps values from hash', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name'
          type={TestInput}
          mapValue={{
            name: e => e.value,
            text: 'text'
          }}
        />
      </Form>)

    inst.single('input').trigger('change', { value: 'john', text: 'hi' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john', text: 'hi' })
  })

  it('should pass all args to mapValue', function(done){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name'
          type={TestInput}
          mapValue={(...args)=> {
            args.length.should.equal(2)
            args[1].should.equal('hi')
            done()
          }}
        />
      </Form>)

    inst.single('input').trigger('change')
  })

  it.only('should expose input instance', function() {
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={TestInput}/>
      </Form>)

    ;(inst.single(Form.Field)[0].inputInstance() instanceof TestInput).should.be.true
  })
})