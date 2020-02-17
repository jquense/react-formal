import styled from 'astroturf'
import cn from 'classnames'
import { Link } from 'gatsby'
import React, { useState } from 'react'
import { Navbar } from '@docpocalypse/gatsby-theme'
import useGlobalListener from '@restart/hooks/useGlobalListener'
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
  const [stuck, setStuck] = useState(false)

  useGlobalListener(
    'scroll',
    () => {
      setStuck(window.scrollY !== 0)
    },
    { passive: true },
  )

  return (
    <div>
      <Navbar
        css="transition: background-color 300ms; position: fixed;"
        bg={!stuck ? 'bg-transparent' : 'bg-primary'}
      />
      <main>
        <div className="px-4 text-white bg-primary relative">
          <svg
            viewBox="0 0 700 400"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute block"
            css="height: 100%; left: 50%; transform: translateX(-50%);"
          >
            <path
              d="M349.884 874.72L-.003.006h699.772L349.884 874.72z"
              fill="#fff"
              fillOpacity=".07"
            />
          </svg>
          <div className="mt-navbar" />
          <div className="mx-auto container py-24 flex items-center flex-col z-10 ">
            <h1 className="m-0 flex text-6xl mb-5 z-10 w-full">
              <span className="flex-1 text-right">React</span>
              <Logo className="mx-4" />
              <span className="flex-1">Formal</span>
            </h1>
            <p className="text-2xl">Classy HTML form management</p>
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
        <div className="mx-auto container text-center headlines grid-flow-row grid md:grid-cols-3 w-128 md:w-auto gap-8 py-12">
          <div className="mb-0 flex flex-col">
            <h2>Minimal</h2>
            <p className="flex-1">
              Requires about as much boilerplate as a single input. No managing
              tons of values and onChange handlers.
            </p>
          </div>
          <div className=" flex flex-col">
            <h2>Typed</h2>
            <p className="flex-1">
              Schema based forms to handle all the frustrating parsing and
              serializing of strings to objects automatically.
            </p>
          </div>

          <div className="flex flex-col">
            <h2>Flexible</h2>
            <p className="flex-1">
              You have complete control how each field renders. Use any
              components you want!
            </p>
          </div>
        </div>
        <div className="mx-auto container">{props.children}</div>
      </main>
      <footer className="mx-auto text-xs  container text-gray-500">
        bowtie icon by Nicole Hammonds from the Noun Project
      </footer>
    </div>
  )
}

SplashPageLayout.propTypes = propTypes

export default SplashPageLayout
