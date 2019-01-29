const { MDXProvider } = require('@mdx-js/tag')
const React = require('react')

const Playground = require('./components/Playground').default
const styles = require('./styles/prism.module.scss')
const { highlight, languages } = require('prismjs/components/prism-core')
require('prismjs/components/prism-clike')
require('prismjs/components/prism-javascript')
require('prismjs/components/prism-typescript')
require('prismjs/components/prism-markup')
require('prismjs/components/prism-jsx')

const prism = (code, language = 'jsx') => highlight(code, languages[language])

const components = {
  wrapper: props => <React.Fragment {...props} />,
  pre: props => {
    const { children, props: codeProps } = props.children.props
    let settings = {}
    try {
      settings = JSON.parse(codeProps.metaString) || {}
    } catch (err) {
      if (codeProps.metaString === 'editable') settings.editable = true
      // ignore
    }

    return settings.editable ? (
      <Playground code={children} {...codeProps} {...settings} />
    ) : (
      <pre {...props} className={styles.prism}>
        <code
          dangerouslySetInnerHTML={{
            __html: prism(
              props.children.props.children,
              props.className && props.className.slice(10)
            ),
          }}
        />
      </pre>
    )
  },
}

// eslint-disable-next-line react/prop-types
module.exports = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)
