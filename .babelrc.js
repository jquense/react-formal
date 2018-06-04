module.exports = api => ({
  presets: [
    [
      'jason',
      {
        runtime: false,
        modules: api.env() === 'esm' ? false : 'commonjs',
      },
    ],
  ],
})
