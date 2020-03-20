const path = require('path');

const src = path.resolve(__dirname, '../src');

module.exports = {
  pathPrefix: '/react-formal',
  siteMetadata: {
    title: 'documentation',
    author: 'Jason Quense',
  },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-astroturf',
      options: { enableCssProp: true },
    },
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: 'Abril Fatface',
              subsets: ['latin'],
              display: 'swap',
            },
            {
              family: 'Open+Sans',
              subsets: ['latin'],
              display: 'swap',
            },
          ],
        },
      },
    },
    {
      resolve: '@docpocalypse/gatsby-theme',
      options: {
        sources: [src],

        theming: 'full',
        propsLayout: 'list',
        tailwindConfig: require.resolve('./tailwind.config'),

        getImportName(docNode) {
          return `import { ${docNode.name} } from '${docNode.packageName}'`;
        },
      },
    },
    // {
    //   resolve: 'gatsby-plugin-typedoc',
    //   options: {
    //     projects: [src],
    //   },
    // },
  ],
};
