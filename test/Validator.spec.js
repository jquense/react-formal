import Validator from '../src/Validator'

describe('validator', () => {
  var validator

  it('should use passed in validation function', () => {
    var spy,
      context = {},
      validator = new Validator((spy = sinon.spy()))

    return validator
      .validate('field', context)
      .should.be.fulfilled.then(valid => {
        spy.should.have.been.calledWithExactly('field', context)
      })
  })

  it('should use passed in validation function', () => {
    var spy,
      context = {},
      validator = new Validator((spy = sinon.spy()))

    return validator
      .validate('field', context)
      .should.be.fulfilled.then(valid => {
        spy.should.have.been.calledWithExactly('field', context)
      })
  })

  it('should validate an array of fields', () => {
    var spy,
      validator = new Validator((spy = sinon.spy()))

    return validator
      .validate(['fieldA', 'fieldB'])
      .should.be.fulfilled.then(() => {
        spy.should.have.been.calledTwice
      })
  })

  it('should track errors', () => {
    var validator = new Validator(() => 'invalid')

    return validator
      .validate(['fieldA', 'fieldB'])
      .should.be.fulfilled.then(() => {
        validator.errors().should.have.keys('fieldA', 'fieldB')

        validator.errors().fieldA.length.should.equal(1)

        validator.errors().fieldA[0].should.equal('invalid')
        validator.errors().fieldB[0].should.equal('invalid')
      })
  })

  it('should remove errors', () => {
    var count = 0,
      validator = new Validator(field => (count++ ? undefined : 'invalid'))

    return validator.validate('fieldA').should.be.fulfilled.then(() => {
      validator.errors().should.have.key('fieldA')

      return validator.validate('fieldA').should.be.fulfilled.then(() => {
        validator.errors().should.not.have.key('fieldA')
      })
    })
  })
})
