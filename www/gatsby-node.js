const path = require('path')
const slug = require('slug')

const GraphQLJSON = require('graphql-type-json')

exports.exports.onCreateWebpackConfig = ({ plugins, loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /src\/examples\//,
          use: [loaders.raw()],
        },
      ],
    },
    resolve: {
      symlinks: false,
      alias: {
        react$: require.resolve('react'),
        'react-dom$': require.resolve('react-dom'),
        'react-dom/server$': require.resolve('react-dom/server'),
        'react-formal$': path.resolve(__dirname, '../src/index.js'),
        'react-formal/lib': path.resolve(__dirname, '../src'),
      },
    },
    plugins: [
      // See https://github.com/FormidableLabs/react-live/issues/5
      plugins.ignore(/^(xor|props)$/),
    ],
  })
}

exports.onCreatePage = ({ page }) => {
  if (page.path.startsWith('/api')) {
    page.layout = 'api'
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          allComponentMetadata(limit: 1000) {
            edges {
              node {
                displayName
                doclets
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          reject(new Error(result.errors))
          return
        }

        const componentTemplate = path.resolve(`src/templates/component.js`)
        const publicComponents = result.data.allComponentMetadata.edges
          .filter(({ node }) => node.doclets.public)
          .map(e => e.node.displayName)

        publicComponents.forEach(displayName => {
          createPage({
            path: `/api/${slug(displayName)}/`,
            component: componentTemplate,
            context: {
              displayName,
              publicComponents,
            },
          })
        })
      })
    )
  })
}

GraphQLJSON.name = 'JSON_2'

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name === 'ComponentProp' || type.name === 'ComponentMetadata')
    return {
      doclets: {
        type: GraphQLJSON,
      },
    }

  return {}
}
