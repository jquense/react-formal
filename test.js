
chai.use(require('chai-as-promised'))
chai.should();

var testsContext = require.context("./test", true);

testsContext.keys().forEach(testsContext);
