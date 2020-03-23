import React from 'react';
import { css } from 'astroturf';

function Callout(props) {
  return (
    <aside
      {...props}
      css={css`
        position: relative;
        padding: theme(padding.4);

        &::before {
          content: '';
          position: relative;
          top: 0;
          bottom: 0;
          left: 0;
          width: theme(spacing.2);
          background-color: theme(colors.info);
        }
      `}
    />
  );
}

export default Callout;
