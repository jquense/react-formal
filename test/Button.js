var React = require('react')
  , yup = require('yup')
  , Form = require('../src');

var tsp = require('teaspoon')

describe('Form Button', ()=> {

  it('should passthrough props', () => {
    tsp(<Form.Button className='foo' />)
      .render()
      .single('.foo:dom')
  })

  it('should chain events', () => {
    let spy = sinon.spy();

    tsp(<Form.Button onClick={spy} />)
      .render()
      .trigger('click')

    spy.should.have.been.calledOnce
  })
})
