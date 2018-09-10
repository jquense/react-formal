import globalize from 'globalize'
import PropTypes from 'prop-types'
import React from 'react'
import localizer from 'react-widgets-globalize'

import 'bootstrap/dist/css/bootstrap.css'
import 'react-widgets/lib/less/react-widgets.less'
import '../css/one-light.less'
import '../css/style.less'

import ApiLayout from './api'
import DefaultLayout from './default'

localizer(globalize)

const propTypes = {
  location: PropTypes.object.isRequired,
}

function Layout(props) {
  if (props.location.pathname.startsWith('/api')) {
    return <ApiLayout {...props} />
  }
  return <DefaultLayout {...props} />
}

Layout.propTypes = propTypes

export default DefaultLayout
