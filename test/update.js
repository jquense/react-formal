var assert = require('chai').assert
var update = require('../src/util/update')


describe('immutable setter', ()=>{
  
  it('should create different objects', ()=>{
    var objA = { foo: [ { bar: { quuz: 10 } } ], baz: { quuz: 10 } }
    var objB = update(objA, 'foo[0].bar.quuz', 5)

    assert(objA !== objB)
    assert(objA.baz === objB.baz)
    assert(objA.foo !== objB.foo)
    assert(objA.foo[0] !== objB.foo[0])
    assert(objA.foo[0].bar !== objB.foo[0].bar )
    assert(objA.foo[0].bar.quuz !== objB.foo[0].bar.quuz )

    assert(objB.foo[0].bar.quuz === 5)
  })

  it('should safely set missing branches', ()=>{
    var objA = { baz: { quuz: 10 } }
    var objB = update(objA, 'foo[0].bar.quuz', 5)

    assert(objA !== objB)
    assert(objA.baz === objB.baz)

    assert(objA.foo === undefined)
    assert.deepEqual(objB.foo,  [ { bar: { quuz: 5 } } ])
  })

  it.only('should work when input is undefined', ()=>{
    var obj = update(void 0, 'foo[0].bar.quuz', 5)

    assert.deepEqual(obj,  { foo: [ { bar: { quuz: 5 } } ] })
  })
})

