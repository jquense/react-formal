// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: Form, ...rest } = require('./index.ts');

module.exports = Object.assign(Form, rest);
