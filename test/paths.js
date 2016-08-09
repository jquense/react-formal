var paths = require('../src/util/paths')

describe('PATH utils', ()=>{

  it('should clean part', ()=>{
    paths.clean("'hi'").should.equal('hi')
    paths.clean('hi').should.equal('hi')
    paths.clean('"hi"').should.equal('hi')
    paths.clean('hi').should.equal('hi')
  })

  it('should check if paths contains', ()=>{

    paths.inPath('a', 'a.b').should.equal(true)
    paths.inPath('a', 'b.a').should.equal(false)

    paths.inPath('a[0]', 'a[0].b').should.equal(true)
    paths.inPath('a.b', 'a.c').should.equal(false)
    paths.inPath('a.b.c', 'a.b.c.d').should.equal(true)
    paths.inPath('a.b.c.d', 'a.b.c').should.equal(false)

    paths.inPath('a["b"].c', 'a.b["c"].d').should.equal(true)
  })

  it('should reduce array of paths', ()=>{

    paths.reduce(['a', 'a.b']).should.eql(['a'])
    paths.reduce(['a.b', 'a']).should.eql(['a'])

    paths.reduce(['a.b.c', 'a.b', 'a.c']).should.eql(['a.b', 'a.c'])
  })

  it('should trim paths', ()=>{
    let errors = {
      'name': ['invalid'],
      'name.first': ['invalid'],
      'id': ['invalid']
    }

    paths.trim('name', errors).should.not.equal(errors)
    paths.trim('name', errors).should.eql({
      'id': ['invalid']
    })
  })

  it('should return same object when unchanged', ()=>{
    let errors = {
      'name': ['invalid'],
      'name.first': ['invalid'],
      'id': ['invalid']
    }
    paths.trim('foo', errors).should.equal(errors)
  })
})
