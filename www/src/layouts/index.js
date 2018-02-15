import Link from 'gatsby-link'
import globalize from 'globalize'
import PropTypes from 'prop-types'
import React from 'react'
import localizer from 'react-widgets-globalize'

import 'bootstrap/dist/css/bootstrap.css'
import 'react-widgets/lib/less/react-widgets.less'
import '../css/one-light.less'
import '../css/style.less'

localizer(globalize)

const propTypes = {
  location: PropTypes.object.isRequired,
}

function DefaultLayout({ children, location }) {
  return (
    <div>
      <nav
        className="navbar navbar-default navbar-static-top"
        style={{ marginBottom: 0 }}
      >
        <div className="container">
          {
            <span className="navbar-brand">
              <Link to="/getting-started">
                React&nbsp;<img
                  src="./bow-tie.svg"
                  style={{ width: 30, marginTop: -5 }}
                />&nbsp;Formal
              </Link>
            </span>
          }
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/api">Documentation</Link>
            </li>
            <li>
              <a href="https://github.com/jquense/react-formal">Github</a>
            </li>
          </ul>
        </div>
      </nav>

      {typeof children === 'function' ? children() : children}
    </div>
  )
}

DefaultLayout.propTypes = propTypes

export default DefaultLayout
