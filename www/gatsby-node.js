const path = require('path')
const { Kind } = require('gatsby-plugin-typedoc/types')

// exports.createResolvers = ({ createResolvers }) => {
//   createResolvers({
//     Docpocalypse: {
//       tsType: {
//         type: 'TypedocNode',
//         resolve: async (src, args, context) => {
//           const result =
//             src.type === 'hook'
//               ? await context.nodeModel.runQuery({
//                   type: 'TypedocNode',
//                   firstOnly: true,
//                   query: {
//                     filter: {
//                       kind: { eq: Kind.Function },
//                       name: { eq: src.name },
//                     },
//                   },
//                 })
//               : null

//           return result
//         },
//       },
//     },
//   })
// }

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelOptions({
    options: {
      babelrcRoots: true,
    },
  })
}

exports.onCreateWebpackConfig = function onCreateWebpackConfig({ actions }) {
  actions.setWebpackConfig({
    resolve: {
      symlinks: false,
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
        'react-formal': path.resolve('../src'),
      },
    },
  })
}
