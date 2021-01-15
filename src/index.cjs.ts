// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: Form, ...rest } = require('./index');

module.exports = Object.assign(Form, rest);
