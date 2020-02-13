import React from 'react'
import { CodeBlock, LiveCode, useScope } from '@docpocalypse/gatsby-theme'
import { toText } from '@docpocalypse/gatsby-theme/src/components/Pre.tsx'
import styles from '../styles/prism.module.css'

const Pre = props => {
  const scope = useScope()
  const {
    children,
    originalType: _1,
    metastring: _2,
    mdxType: _3,
    parentName: _4,
    ...codeProps
  } = props.children.props

  return codeProps.editable ? (
    <LiveCode code={toText(children)} {...codeProps} scope={scope} />
  ) : (
    <CodeBlock
      {...codeProps}
      className={codeProps.className + ' f2 ' + styles.prism}
    >
      {toText(children)}
    </CodeBlock>
  )
}

export default Pre
