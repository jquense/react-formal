import { graphql } from 'gatsby'
import React from 'react'
import { Heading } from '@docpocalypse/gatsby-theme'
import DocBlock from './TypeDocBlock'

export default function DocReturns({ definition, level }) {
  if (definition.returns && definition.returns.length > 0) {
    return (
      <div>
        <Heading level={level}>Return value</Heading>
        <DocBlock definition={definition.returns[0]} level={level + 1} />
      </div>
    )
  }
  if (definition.type && definition.type.typeDef) {
    return <DocReturns definition={definition.type.typeDef} level={level} />
  }
  return null
}

export const fragment = graphql`
  fragment DocumentationReturnsFragment on DocumentationJs {
    returns {
      ...DocumentationDescriptionFragment
      ...DocumentationTypeFragment
    }
  }
`
