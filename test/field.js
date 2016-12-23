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
      return (
        <input
          value={this.props.value || ''}
          onChange={e => this.props.onChange(e, 'hi')}
        />
      )
    }
  }

  it('should pass props to inner type', function(){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' type={TestInput} className='test'/>
      </Form>)

    var input = inst.render().single(TestInput)[0]

    input.props.className.should.include('test') // test invalid-field
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

  it('ensures values are never undefined', function(){
    var inst = $(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name='name' />
      </Form>).render()

    expect(
      inst
        .single('Input')
        .props('value')
    )
    .to.equal(null)
  })

  it('maps value from string', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name' type={TestInput} mapFromValue='value' />
      </Form>).render()

    inst
      .single('input')
      .trigger('change', { value: 'john' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john' })
  })

  it('maps value from function', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name' type={TestInput} mapFromValue={e => e.value} />
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
          mapToValue={spy}
          mapFromValue={{
            other: e => e.value
          }}
        />
      </Form>).render()

    spy.should.have.been.and.calledWith({})

    inst.single('input').trigger('change', { value: 'john' })

    spy.should.have.been.and.calledWith({ other: 'john' })

  })

  it('gets value from map accessor', function() {
    $(
      <Form
        schema={schema}
        defaultValue={{ name: 'foo', lastName: 'bar'}}
      >
        <Form.Field
          name='name'
          type={TestInput}
          mapToValue={{
            first: 'name',
            last: 'lastName'
          }}
        />
      </Form>
    )
    .render()
    .single(TestInput)
    .props('value').should.eql({
      first: 'foo',
      last: 'bar'
    })
  })

  it('gets value from map accessor functions', function() {
    $(
      <Form
        schema={schema}
        defaultValue={{ name: 'foo', lastName: 'bar'}}
      >
        <Form.Field
          name='name'
          type={TestInput}
          mapToValue={{
            first: v => v.name,
            last: v => v.lastName,
          }}
        />
      </Form>
    )
    .render()
    .single(TestInput)
    .props('value').should.eql({
      first: 'foo',
      last: 'bar'
    })
  })

  it('maps values from hash', function(){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name'
          type={TestInput}
          mapFromValue={{
            name: e => e.value,
            text: 'text'
          }}
        />
      </Form>).render()

    inst.single('input').trigger('change', { value: 'john', text: 'hi' })

    spy.should.have.been.calledOnce.and.calledWith({ name: 'john', text: 'hi' })
  })

  it('should pass all args to mapFromValue', function(done){
    var spy = sinon.spy()
    var inst = $(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name='name'
          type={TestInput}
          mapFromValue={(...args)=> {
            args.length.should.equal(2)
            args[1].should.equal('hi')
            done()
          }}
        />
      </Form>).render()

    inst.single('input').trigger('change')
  })

  describe('meta', () => {
    it('should pass meta to form', () => {
      let Input = ({ meta }) => {
        meta.should.have.property('invalid').that.equals(true);
        meta.should.have.property('valid').that.equals(false);
        meta.should.have.property('errors').that.eqls({
          name: 'foo'
        });

        return null
      }

      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name': 'foo' }}
        >
          <Form.Field name='name' type={Input} />
        </Form>
      )
      .render()
    })

    it('should field onError should remove existing errors', () => {
      let errorSpy = sinon.spy()
      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name': 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name='name' type={TestInput} />
        </Form>
      )
      .render()
      .find(TestInput)
      .props().meta.onError({})

      errorSpy.should.have.been.calledOnce
        .and.calledWith({ bar: 'baz' })
    })

    it('should field onError should update field errors', () => {
      let errorSpy = sinon.spy()
      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name': 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name='name' type={TestInput} />
        </Form>
      )
      .render()
      .find(TestInput)
      .props().meta.onError({ 'name': 'foo', 'name.first': 'baz' })

      errorSpy.should.have.been.calledOnce
        .and.calledWith({
          'name': 'foo',
          'name.first': 'baz',
          bar: 'baz'
        })
    })

    it('should field onError should replace field errors', () => {
      let errorSpy = sinon.spy()
      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name': 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name='name' type={TestInput} />
        </Form>
      )
      .render()
      .find(TestInput)
      .props().meta.onError({ 'name.first': 'baz' })

      errorSpy.should.have.been.calledOnce
        .and.calledWith({
          'name.first': 'baz',
          bar: 'baz'
        })
    })
  })

  describe('inclusive active matching', () => {

    it('should count path matches', function() {
      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name': 'foo' }}
        >
          <Form.Field
            name='name'
            errorClass="invalid"
          />
        </Form>
      )
      .render()
      .single('input.invalid')
    })

    it('should use inclusive active checking', function() {
      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field
            name='name'
            errorClass="invalid"
          />
        </Form>
      )
      .render()
      .single('input.invalid')
    })

    it('should respect `exclusive`', function() {
      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field
            exclusive
            name='name'
            errorClass="invalid"
          />
        </Form>
      )
      .render()
      .none('input.invalid')
    })

    it('should respect `exclusive` and still have errors', () => {
      $(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name': 'foo' }}
        >
          <Form.Field
            exclusive
            name='name'
            errorClass="invalid"
          />
        </Form>
      )
      .render()
      .single('input.invalid')
    })
  })

  xdescribe('form fields', () => {
    it('should inject onError', () => {
      $(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field name='name' />
        </Form>
      )
      .render()
      .find('input')
      .props('onError').should.be.a('function');
    })

    // skip for now since name is still required.
    xit('should not inject onError for nameless fields', () => {
      $(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field />
        </Form>
      )
      .render()
      .find('input')
      .props('onError').should.be.a('function');
    })

    it('should propagate onError to form', () => {
      let spy = sinon.spy();

      $(
        <Form schema={schema} defaultValue={{}} onError={spy}>
          <Form.Field name='name' />
        </Form>
      )
      .render()
      .find('input')
      .props('onError')({ foo: 'bar' });

      spy.should.have.been.calledOnce.and.calledWith({
        'name.foo': 'bar'
      });

    });

    it('should properly prefix nested errors', () => {
      let onError = $(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field name='name' />
        </Form>
      )
      .render()
      .find('input')
      .props('onError');

      onError({ foo: 'bar' }).should.eql({ 'name.foo': 'bar' })
      onError({ '[1].foo': 'bar' }).should.eql({ 'name[1].foo': 'bar' })
      onError({ '[1].baz.foo': 'bar' }).should.eql({ 'name[1].baz.foo': 'bar' })
    });
  });

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
