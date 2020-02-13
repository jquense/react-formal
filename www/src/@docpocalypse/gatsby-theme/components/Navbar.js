import { Link } from 'gatsby'
import React from 'react'
import Logo from '../../../components/Logo'

function Navbar() {
  return (
    <div
      css="height: theme('navbar.height');"
      className="sticky z-40 top-0 bg-primary text-white px-6 text-xl flex items-center font-medium h-navbar"
    >
      <Link to="/" className="inline-flex items-center">
        React&nbsp;
        <Logo style={{ width: 40 }} />
        &nbsp;Formal
      </Link>

      <nav className="ml-auto">
        <Link to="/api/Form" className="px-2 mr-3 hover:text-subtle-on-dark">
          Documentation
        </Link>
        <a
          className="px-2 -mr-2 hover:text-subtle-on-dark"
          href="https://github.com/jquense/react-formal"
        >
          Github
        </a>
      </nav>
    </div>
  )
}

export default Navbar
