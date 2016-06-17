
chai.use(require('chai-as-promised'))
chai.should();
global.expect = chai.expect;

var testsContext = require.context("./test", true);

testsContext.keys().forEach(testsContext);
