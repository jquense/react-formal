/* eslint-disable import/no-cycle */

import styled, { css } from 'astroturf'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import { Heading } from '@docpocalypse/gatsby-theme'
import Params from './TypeDocParams'
import ReturnBlock from './TypeDocReturns'
import { SignatureElement } from './TypeDocSignature'

const Optional = styled(`span`)`
  &:before {
    content: ' (optional)';
    color: #4084a1;
    font-weight: 400;
  }
`

const Description = ({ definition }) => {
  const description =
    definition.description || (definition.type && definition.type.typeDef)

  if (description) {
    return (
      <div
        css={css`
          margin-top: 0.5em;

          & p {
            margin: 0;
          }
        `}
      >
        <MDXRenderer>{description.childMdx.body}</MDXRenderer>
      </div>
    )
  }

  return null
}

const TypeDocBlock = ({
  definition,
  level = 2,
  title = null,
  showSignature = true,
  ignoreParams = [],
}) => {
  if (!definition) return null
  let titleElement = title || definition.name

  if (typeof titleElement === 'string' && titleElement.match(/\$\d+$/g)) {
    titleElement = 'destructured object'
    // eslint-disable-next-line no-param-reassign
    showSignature = false
  } else if (titleElement) {
    titleElement = <code>{titleElement}</code>
  }
  const nextLevel = level + 1

  return (
    <div>
      <Heading
        level={level}
        css={css`
          font-size: inherit;
          margin: 0;
        `}
      >
        <div
          css={css`
            @apply inline-block mr-3;
          `}
        >
          {titleElement}
          {showSignature && (
            <>
              {' '}
              <SignatureElement
                definition={definition}
                ignoreParams={ignoreParams}
              />
            </>
          )}
        </div>
        {definition.optional && <Optional />}
      </Heading>

      <Description definition={definition} />
      <Params
        definition={definition}
        level={nextLevel}
        ignoreParams={ignoreParams}
      />
      <ReturnBlock definition={definition} level={nextLevel} />
    </div>
  )
}

export default TypeDocBlock

export const fragment = graphql`
  fragment DocumentationDescriptionFragment on DocumentationJs {
    name
    description {
      childMdx {
        body
      }
    }
  }
  fragment DocumentationFragment on DocumentationJs {
    kind
    ...DocumentationDescriptionFragment
    ...DocumentationExampleFragment
    ...DocumentationParamsFragment
    ...DocumentationReturnsFragment
  }
`
