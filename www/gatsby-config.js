const { root } = require('./constants')

const remarkPlugins = [
  'gatsby-remark-autolink-headers',
  'gatsby-remark-prismjs',
]

module.exports = {
  siteMetadata: {
    title: '',
    author: 'Jason Quense',
  },
  plugins: [
    {
      resolve: 'gatsby-mdx',
      options: {
        gatsbyRemarkPlugins: remarkPlugins,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: root,
        name: 'source',
      },
    },
    'gatsby-transformer-react-docgen',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: remarkPlugins,
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-css-literal-loader',
      options: { extension: '.module.scss' },
    },
  ],
}
