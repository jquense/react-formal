const path = require('path')

const src = path.resolve(__dirname, '../src')

module.exports = {
  siteMetadata: {
    title: 'documentation',
    author: 'Jason Quense',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-astroturf',
      options: { enableCssProp: true },
    },

    {
      resolve: '@docpocalypse/gatsby-theme',
      options: {
        sources: [src],

        theming: 'full',
        tailwindConfig: require.resolve('./tailwind.config'),

        getImportName(docNode) {
          return `import { ${docNode.name} } from '${docNode.packageName}'`
        },
      },
    },
    {
      resolve: 'gatsby-plugin-typedoc',
      options: {
        projects: [src],
      },
    },
  ],
}
