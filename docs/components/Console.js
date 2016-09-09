import React from 'react';
import Playground from '@monastic.panic/component-playground';


export default function AppConsole({ scope, babelConfig, ...props}) {
  return (
    <Playground
      {...props}
      style={{ display: 'flex' }}
    >
      <Playground.Editor style={{ flex: 2 }} />
      <Playground.Console
        scope={scope} 
        babelConfig={babelConfig}
        style={{ flex: 1 }}
      />
    </Playground>
  )
}
