import React from 'react'
import { Link } from 'gatsby'

import Logo from './Logo'
import styled from 'astroturf'

const HeroLink = styled(Link, { allowAs: true })`
  color: white;

  &:hover,
  &:active,
  &:focus {
    color: darken(white, 5%);
  }
`

const propTypes = {}

function SplashPageLayout(props) {
  return (
    <div>
      <main>
        <div
          className="jumbotron jumbotron-fluid text-white"
          style={{ backgroundColor: '#2f2f2f' }}
        >
          <div className="container">
            <h1>
              React&nbsp;
              <Logo />
              &nbsp;Formal
            </h1>
            <p>Classy HTML form management</p>
            <div>
              <HeroLink to="/api/Form" className="pr-2">
                Documentation
              </HeroLink>
              <HeroLink as="a" href="https://github.com/jquense/react-formal">
                Github
              </HeroLink>
            </div>
          </div>
        </div>
        <div className="container text-center headlines d-flex">
          <div className="px-4" style={{ maxWidth: '33%' }}>
            <h2>Strongly Typed</h2>
            <p>
              Schema based forms to handle all the frustrating parsing and
              serializing of strings to objects automatically.
            </p>
          </div>
          <div className="px-4" style={{ maxWidth: '33%' }}>
            <h2>Minimal Wiring</h2>
            <p>
              Requires about as much boilerplate as a single input. No managing
              tons of values and onChange handlers.
            </p>
          </div>
          <div className="px-4" style={{ maxWidth: '33%' }}>
            <h2>Extreme Flexibility</h2>
            <p>
              You have complete control how each field renders. Use any
              components you want!
            </p>
          </div>
        </div>
        <div className="container">{props.children}</div>
      </main>
    </div>
  )
}

SplashPageLayout.propTypes = propTypes

export default SplashPageLayout
