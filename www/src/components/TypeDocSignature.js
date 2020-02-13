/* eslint-disable react/no-array-index-key */
import styled from 'astroturf'
import { graphql } from 'gatsby'
import React from 'react'
import { highlight } from '@docpocalypse/code-live'
import { Heading } from '@docpocalypse/gatsby-theme'

const Wrapper = styled('span')`
  &.block {
    display: block;
    margin-top: 20px;
  }
  &:before,
  &:after {
    color: #969584;
  }
  &:before {
    content: '{ ';
  }
  &:after {
    content: ' }';
  }
`

const TypeComponent = ({ children }) => (
  <span className="token builtin">{children}</span>
)

const typeExpression = type => {
  if (type.type === `RecordType`) {
    return 'object'
  }
  if (type.type === `NameExpression`) {
    return type.name
  }
  if (type.type === `NullLiteral`) {
    return 'null'
  }
  if (type.type === `UndefinedLiteral`) {
    return 'undefined'
  }
  if (type.type === `UnionType`) {
    return type.elements.map(typeExpression).join(' | ')
  }
  // tuples [number, string]
  if (type.type === `ArrayType`) {
    return `[${type.elements.map(typeExpression).join(', ')}]`
  }

  if (type.type === `TypeApplication` && type.expression) {
    if (type.expression.name === `Array`) {
      return `${typeExpression(type.applications[0])}[]`
    }
    return `${typeExpression(type.expression)}<${typeExpression(
      type.applications[0],
    )}>`
  }

  return ''
}

function TypeExpression({ type }) {
  const str = typeExpression(type)
  return (
    <span dangerouslySetInnerHTML={{ __html: highlight(str, 'typescript') }} />
  )
}

function FunctionSignature({ definition, block, ignoreParams }) {
  const params = definition.params
    ? definition.params
        .filter(param => !ignoreParams.includes(param.name))
        .map(param => {
          const type =
            param.type &&
            `${param.optional ? '?' : ''}: ${typeExpression(param.type)}`
          return `${param.name}${type || ''}`
        })
    : []

  const returns =
    definition.returns && definition.returns.length
      ? typeExpression(definition.returns[0].type)
      : 'void'

  return (
    <Wrapper
      block={block}
      dangerouslySetInnerHTML={{
        __html: highlight(`(${params.join(', ')}) => ${returns}`, 'typescript'),
      }}
    />
  )
}

const isFunctionDef = (definition, recursive = true) =>
  (definition.params && definition.params.length > 0) ||
  (definition.returns && definition.returns.length > 0) ||
  (recursive &&
    definition.type &&
    definition.type.typeDef &&
    isFunctionDef(definition.type.typeDef, false))

function SignatureElement({
  definition,
  ignoreParams = [],
  fallbackToName = false,
  block = false,
}) {
  if (isFunctionDef(definition, false)) {
    return (
      <FunctionSignature
        block={block}
        definition={definition}
        ignoreParams={ignoreParams}
      />
    )
  }

  if (definition.type && definition.type.typeDef) {
    return (
      <SignatureElement
        definition={definition.type.typeDef}
        fallbackToName
        block={block}
      />
    )
  }

  if (definition.type) {
    return (
      <Wrapper block={block}>
        <TypeExpression type={definition.type} />
      </Wrapper>
    )
  }

  if (fallbackToName && definition.name) {
    return (
      <Wrapper block={block}>
        <TypeComponent>{definition.name}</TypeComponent>
      </Wrapper>
    )
  }

  return null
}

const SignatureBlock = ({ definition, level = 1 }) => (
  <>
    <Heading level={level}>Signature</Heading>
    <SignatureElement definition={definition} />
  </>
)

export {
  isFunctionDef,
  SignatureElement,
  SignatureBlock,
  TypeComponent,
  Wrapper as SignatureWrapper,
}

export const fragment = graphql`
  fragment
  fragment Typedoc_signature on TypedocNode {
    signatures {
      ...
    }
  }
`
