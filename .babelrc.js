module.exports = {
  presets: [
    [
      'jason',
      {
        runtime: false,
        modules: process.env.BABEL_ENV === 'esm' ? false : 'commonjs',
      },
    ],
  ],
}
