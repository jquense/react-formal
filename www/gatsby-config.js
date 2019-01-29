const path = require('path')
const { root } = require('./constants')

const config = {
  template: require.resolve('./src/templates/ApiPage.js'),

  components: require('./src/components.json').map(name =>
    require.resolve(`${root}/src/${name}.js`)
  ),

  scope: {
    _: 'lodash',
    Bootstrap: 'react-bootstrap',
    yup: 'yup',
  },
}

module.exports = {
  pathPrefix: '/react-formal',
  siteMetadata: {
    title: '',
    author: 'Jason Quense',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${root}/src`,
        name: 'source',
      },
    },
    {
      resolve: 'gatsby-plugin-component-docs',
      options: config,
    },
    {
      resolve: 'gatsby-mdx',
      options: {
        defaultLayout: path.resolve(__dirname, 'src/components/PageLayout'),
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {},
          },
        ],
      },
    },
    'gatsby-transformer-react-docgen',
    {
      resolve: 'gatsby-transformer-remark',
      options: { plugins: ['gatsby-remark-prismjs'] },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-astroturf',
      options: { extension: '.module.scss' },
    },
  ],
}
