// global.requestAnimationFrame = cb => setTimeout(cb, 0);
const { configure, ShallowWrapper, ReactWrapper } = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

configure({ adapter: new Adapter() });

function assertLength(length) {
  return function $assertLength(selector) {
    let result = this.find(selector);
    expect(result).toHaveLength(length);
    return result;
  };
}
ReactWrapper.prototype.print = function print() {
  console.log(this.debug());
  return this;
};

ReactWrapper.prototype.assertSingle = assertLength(1);
ShallowWrapper.prototype.assertSingle = assertLength(1);

ReactWrapper.prototype.assertNone = assertLength(0);
ShallowWrapper.prototype.assertNone = assertLength(0);
