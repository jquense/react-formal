import React from 'react'
import { Link } from 'gatsby'
import styled from 'astroturf'

const NavLink = styled(Link)`
  @import '../styles/theme.scss';

  composes: nav-link from global;

  color: $subtle;

  &:hover,
  &:active,
  &:focus {
    color: $darker;
  }
`

const propTypes = {}

function PageLayout(props) {
  return (
    <div>
      <nav
        className="navbar navbar-dark navbar-expand  navbar-static-top"
        style={{ marginBottom: 0, backgroundColor: '#2f2f2f' }}
      >
        <div className="container">
          <Link to="/" className="navbar-brand">
            React&nbsp;
            <img src="/bow-tie.svg" style={{ width: 30, marginTop: -5 }} />
            &nbsp;Formal
          </Link>

          <ul className="navbar-nav ml-auto">
            <Link to="/api/Form" className="nav-link">
              Documentation
            </Link>
            <a
              className="nav-link"
              href="https://github.com/jquense/react-formal"
            >
              Github
            </a>
          </ul>
        </div>
      </nav>
      <div className="container d-flex">
        <aside>
          <nav
            className="position-sticky side-nav"
            style={{ top: 0, minWidth: 200 }}
          >
            <div className="nav flex-column">
              <div className="side-heading">API</div>

              <NavLink to="/api/Form">Form</NavLink>
              <NavLink to="/api/NestedForm">NestedForm</NavLink>

              <NavLink to="/api/Field">Form.Field</NavLink>
              <NavLink to="/api/FieldArray">Form.FieldArray</NavLink>

              <NavLink to="/api/Message">Form.Message</NavLink>

              <NavLink to="/api/Summary">Form.Summary</NavLink>

              <NavLink to="/api/FormSubmit">Form.Submit</NavLink>

              {/* <Link to="/api/Yup">
                  Schema
                </Link> */}
            </div>
          </nav>
        </aside>
        <main className="col-sm-9 col-md-10 doc-page">{props.children}</main>
      </div>
    </div>
  )
}

PageLayout.propTypes = propTypes

export default PageLayout
