global.requestAnimationFrame = cb => setTimeout(cb, 0)
const { configure, ShallowWrapper, ReactWrapper } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

global.chai = require('chai')
global.sinon = require('sinon')

global.chai.use(require('dirty-chai'))
global.chai.use(require('sinon-chai'))
global.chai.use(require('chai-as-promised'))
global.chai.should()

global.expect = global.chai.expect

configure({ adapter: new Adapter() })

function assertLength(length) {
  return function $assertLength(selector) {
    let result = this.find(selector)
    result.should.have.length(length)
    return result
  }
}
ReactWrapper.prototype.print = function print() {
  console.log(this.debug())
  return this
}

ReactWrapper.prototype.assertSingle = assertLength(1)
ShallowWrapper.prototype.assertSingle = assertLength(1)

ReactWrapper.prototype.assertNone = assertLength(0)
ShallowWrapper.prototype.assertNone = assertLength(0)

let mockConsole

// beforeAll(() => {
//   const baseError = console.error
//   mockConsole = jest.spyOn(console, 'error').mockImplementation((...args) => {
//     // if (args[0].includes('act')) return
//     baseError(...args)
//   })
// })

// afterAll(() => {
//   const len = mockConsole.mock.calls.length
//   mockConsole.mockRestore()

//   if (len) console.error(`${len} act() errors were fired`)
// })
