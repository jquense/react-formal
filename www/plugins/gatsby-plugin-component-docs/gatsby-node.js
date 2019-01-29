const path = require('path')
const { promises: fs } = require('fs')
const keyBy = require('lodash/keyBy')
const componentWithMDXScope = require('gatsby-mdx/component-with-mdx-scope')

const getName = p => path.basename(p, path.extname(p))

const query = /* GraphQL */ `
  {
    allMdx {
      edges {
        node {
          id
          parent {
            ... on File {
              name
              sourceInstanceName
              absolutePath
            }
          }
          code {
            body
            scope
          }
        }
      }
    }
  }
`

exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { components, template } = pluginOptions

  const { data, errors } = await graphql(query)

  if (errors) throw errors

  const nodesByName = keyBy(
    data.allMdx.edges.filter(e => e.node.parent).map(e => e.node),
    n => n.parent.name
  )

  for (const component of components) {
    const name = getName(component)
    const node = nodesByName[name]

    actions.createPage({
      path: `/api/${name}`,
      component: node
        ? componentWithMDXScope(
            template,
            node ? [node.code.scope, ...components] : components
          )
        : template,
      context: {
        nodeId: node && node.id,
        displayName: name,
      },
    })
  }
}

exports.onCreateWebpackConfig = async ({ plugins, actions }, pluginOptions) => {
  const { components, scope } = pluginOptions
  const scopePath = path.resolve('.cache/component-docs-scope.js')

  await fs.writeFile(
    scopePath,
    `
var d = i => i.default || i;
module.exports = {
  ${components
    .map(c => [getName(c), c])
    .concat(Object.entries(scope))
    .map(([key, value]) => `${key}: d(require('${value}'))`)
    .join(',\n  ')}
}
    `.trim()
  )

  actions.setWebpackConfig({
    plugins: [
      plugins.provide({
        __SCOPE__: scopePath,
      }),
    ],
  })
}
