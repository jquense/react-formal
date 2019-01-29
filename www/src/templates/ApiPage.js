import { graphql } from 'gatsby'
import sortBy from 'lodash/sortBy'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import React from 'react'
import { MDXTag } from '@mdx-js/tag'

import PageLayout from '../components/PageLayout'
import '../styles/prism.module.scss'

function cleanDocletValue(str) {
  return str
    .trim()
    .replace(/^\{/, '')
    .replace(/\}$/, '')
}
function getDisplayTypeName(typeName) {
  if (typeName === 'func') return 'function'
  if (typeName === 'bool') return 'boolean'

  return typeName
}

function renderEnum(enumType) {
  const enumValues = enumType.value || []

  const renderedEnumValues = []
  enumValues.forEach(({ value }, i) => {
    if (i > 0) {
      renderedEnumValues.push(<span key={`${i}c`}> | </span>)
    }

    renderedEnumValues.push(<code key={i}>{value}</code>)
  })

  return <span>{renderedEnumValues}</span>
}

function renderType(prop) {
  let type = prop.type || {}
  let name = getDisplayTypeName(type.name)
  let doclets = prop.doclets || {}

  switch (name) {
    case 'object':
      return name
    case 'union':
      return type.value.reduce((current, val, i, list) => {
        let item = renderType({ type: val })
        if (React.isValidElement(item)) {
          item = React.cloneElement(item, { key: i })
        }
        current = current.concat(item)

        return i === list.length - 1 ? current : current.concat(' | ')
      }, [])
    case 'array': {
      let child = renderType({ type: type.value })

      return (
        <span>
          {'array<'}
          {child}
          {'>'}
        </span>
      )
    }
    case 'enum':
      return renderEnum(type)
    case 'custom':
      return cleanDocletValue(doclets.type || type.raw)
    default:
      return name
  }
}

const propTypes = {}

function ComponentPageTemplate({ data, pageContext }) {
  const { nodeId, displayName } = pageContext
  const { description, props } = data.metadata

  return (
    <PageLayout>
      <h1 className="mt-5">{displayName}</h1>

      {description && description.childMdx && (
        <div className="lead">
          <MDXRenderer scope={{ React, MDXTag }}>
            {description.childMdx.code.body}
          </MDXRenderer>
        </div>
      )}
      {nodeId && <MDXRenderer>{data.mdx.code.body}</MDXRenderer>}

      <h2>API</h2>
      {sortBy(props, 'name')
        .filter(p => !p.doclets.private)
        .map(prop => (
          <>
            <h3 className="mt-5 text-monospace">
              {prop.name} {prop.required && <strong>required</strong>}
            </h3>
            {prop.description && prop.description.childMdx && (
              <MDXRenderer scope={{ React, MDXTag }}>
                {prop.description.childMdx.code.body}
              </MDXRenderer>
            )}
            <div>
              <strong>type:</strong>{' '}
              <span className="text-monospace">{renderType(prop)}</span>
            </div>
            {prop.defaultValue && prop.defaultValue.value && (
              <>
                <em>default</em>:{' '}
                <code>{prop.defaultValue && prop.defaultValue.value}</code>
              </>
            )}
          </>
        ))}
    </PageLayout>
  )
}

ComponentPageTemplate.propTypes = propTypes

export default ComponentPageTemplate

export const pageQuery = graphql`
  fragment Description_mdx on ComponentDescription {
    childMdx {
      code {
        body
      }
    }
  }
  fragment PropsTable_metadata on ComponentMetadata {
    composes
    displayName
    description {
      ...Description_mdx
    }
    props {
      name
      doclets
      defaultValue {
        value
        computed
      }
      description {
        ...Description_mdx
      }
      required
      type {
        name
        value
        raw
      }
    }
  }

  query($displayName: String!, $nodeId: String) {
    mdx(id: { eq: $nodeId }) {
      code {
        body
      }
    }
    metadata: componentMetadata(displayName: { eq: $displayName }) {
      displayName
      doclets
      composes
      parent {
        ... on File {
          sourceInstanceName
        }
      }
      ...PropsTable_metadata
    }
  }
`
