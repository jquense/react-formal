var React = require('react')
  , yup = require('yup')
  , inputs = require('../src/inputs')
  , Form = require('../src');

var $ = require('teaspoon')

describe('Field', ()=> {
  var schema = yup.object({
    name: yup.string().default(''),
    more: yup.object().when('name', {
      is: 'jason',
      then: yup.object({
        isCool: yup.bool()
      })
    })
  })


  class TestInput extends React.Component {
    render(){
      return <input {...this.props} onChange={e => this.props.onChange(e, 'hi')}/>
    }
  }

  it('should pass props to inner type', function(){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={TestInput} className='test'/>
      </Form>)

    var input = inst.render().single(TestInput)[0]

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
      .render()


    inst.single($.s`${inputs.Input}[name='string']`)

    inst.single(inputs.Number)
    inst.single(inputs.Bool)
    inst.single(inputs.Select)
    inst.single(inputs.Date)
  })

  it('should use schema metadata', function(){
    var schema = yup.object({
      string: yup.string().meta({
        reactFormalType: 'number'
      })
    })

    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='string'/>
      </Form>).render()

    inst.single(inputs.Number)
  })

  it('should use type override', function(){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name'/>
        <Form.Field name='name' type='textarea'/>
        <Form.Field name='name' type={TestInput}/>
      </Form>).render()

    inst.single(TestInput)
    inst.find(inputs.Input).length.should.equal(2)
  })

  it('should not warn about refs on stateless components', function(){
    sinon.spy(console, 'error');

    $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={()=> null}/>
      </Form>
    )
    .render()

    console.error.should.not.have.been.called
    console.error.restore();
  })

  it('should fire onChange', function(done){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={TestInput} onChange={()=> done()}/>
      </Form>).render()

    inst.single('input').trigger('change')
  })

  it('maps value from string', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name' type={TestInput} mapValue='value' />
      </Form>).render()

    inst.single('input').trigger('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('maps value from function', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name' type={TestInput} mapValue={e => e.value } />
      </Form>).render()

    inst.single('input').trigger('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('gets value from accessor', function(){
    var spy = sinon.spy(model => model.other)
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name='name'
          type={TestInput}
          valueAccessor={spy}
          mapValue={{
            other: e => e.value
          }}
        />
      </Form>).render()

    spy.should.have.been.and.calledWith({})

    inst.single('input').trigger('change', { value: 'john' })

    spy.should.have.been.and.calledWith({ other: 'john' })

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
      </Form>).render()

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
      </Form>).render()

    inst.single('input').trigger('change')
  })

  it('should expose input instance', function() {
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={TestInput}/>
      </Form>).render()

    ; (inst.single(Form.Field)[0].inputInstance() instanceof TestInput).should.be.true
  })

  it('should work with conditional schema', function() {
    let render = (name) => $(
      <Form schema={schema} defaultValue={{ ...schema.default(), name }}>
        <Form.Field name='more.isCool' />
      </Form>).render()

    ; (() => render('jason')).should.not.throw()
    ; (() => render('john')).should.throw()
  })
})
