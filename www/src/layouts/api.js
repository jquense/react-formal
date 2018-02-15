import PropTypes from 'prop-types'
import React from 'react'

import PropTypes from 'prop-types'
import Link from 'gatsby-link'

import Default from './index'

const propTypes = {
  location: PropTypes.object.isRequired,
}

function ApiLayout({ children, ...props }) {
  return (
    <Default {...props}>
      <div className="container">
        <aside className="col-sm-3 col-md-2">
          <nav className="side-nav">
            <ul className="nav">
              <li className="side-heading ">API</li>
              <li>
                <Link to="/api/form">Form</Link>
              </li>
              <li>
                <Link to="/api/field">Form.Field</Link>
              </li>
              <li>
                <Link to="/api/context">Form.Context</Link>
              </li>
              <li>
                <Link to="/api/message">Form.Message</Link>
              </li>
              <li>
                <Link to="/api/summary">Form.Summary</Link>
              </li>
              <li>
                <Link to="/api/button">Form.Button</Link>
              </li>
              <li>
                <Link to="/api/yup">Schema</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="col-sm-9 col-md-10 doc-page">{children()}</main>
      </div>
    </Default>
  )
}

ApiLayout.propTypes = propTypes

export default ApiLayout
