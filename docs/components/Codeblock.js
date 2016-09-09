import React from 'react';
import Playground from '@monastic.panic/component-playground';

export default function Codeblock(props) {
  return (
    <Playground.Editor
      {...props}
      className='static-codeblock'
      mode="text/jsx"
      readOnly='nocursor'
    />
  )
}
