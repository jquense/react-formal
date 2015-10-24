var paths = require('../src/util/paths')
var assert = chai.assert

describe('PATH utils', ()=>{

  it('should clean part', ()=>{
    paths.clean("'hi'").should.equal("hi")
    paths.clean("hi").should.equal("hi")
    paths.clean('"hi"').should.equal("hi")
    paths.clean('hi').should.equal("hi")
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
})
