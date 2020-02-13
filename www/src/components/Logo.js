import React from 'react'
import url from '../bow-tie.svg'

const propTypes = {}

function Logo(props) {
  return (
    <img
      src={url}
      className="inline-block"
      style={{ width: 75, marginTop: -5 }}
      {...props}
    />
  )
}

Logo.propTypes = propTypes

export default Logo
