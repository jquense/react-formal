import styled from 'astroturf'
import { Link } from 'gatsby'
import React from 'react'
import Logo from './Logo'

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
        <div className="px-4 py-3 text-white bg-primary">
          <div className="mx-auto container py-16">
            <h1 className="m-0">
              React&nbsp;
              <Logo />
              &nbsp;Formal
            </h1>
            <p>Classy HTML form management</p>
            <div>
              <Link
                to="/api/Form"
                className="pr-2 text-white hover:text-gray-300"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/jquense/react-formal"
                className="text-white hover:text-gray-300"
              >
                Github
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto container text-center headlines flex">
          <div className="px-4 w-1/3 mb-0 flex flex-col">
            <h2>Minimal</h2>
            <p className="flex-1">
              Requires about as much boilerplate as a single input. No managing
              tons of values and onChange handlers.
            </p>
          </div>
          <div className="px-4 w-1/3  flex flex-col">
            <h2>Typed</h2>
            <p className="flex-1">
              Schema based forms to handle all the frustrating parsing and
              serializing of strings to objects automatically.
            </p>
          </div>

          <div className="px-4 w-1/3 flex flex-col">
            <h2>Flexible</h2>
            <p className="flex-1">
              You have complete control how each field renders. Use any
              components you want!
            </p>
          </div>
        </div>
        <div className="mx-auto container">{props.children}</div>
      </main>
    </div>
  )
}

SplashPageLayout.propTypes = propTypes

export default SplashPageLayout
