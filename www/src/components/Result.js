import React from 'react';
import { CodeBlock } from '@docpocalypse/code-live';
import { syntaxTheme } from '@docpocalypse/gatsby-theme';

// eslint-disable-next-line import/no-unresolved
import { useErrors, useFormValues } from 'react-formal';
import { css } from 'astroturf';

const propTypes = {};

function Result({ value, showErrors, ...rest }) {
  const formValue = useFormValues(m => m);
  const errors = useErrors();

  const showValue = showErrors
    ? errors
    : value === undefined
    ? formValue
    : value;

  return showValue ? (
    <pre
      {...rest}
      style={{ ...syntaxTheme?.plain, backgroundColor: undefined }}
      css={css`
        composes: px-3 pb-3 mt-4 rounded relative text-sm bg-subtle-on-dark flex-1 from global;

        white-space: pre;
        overflow-x: auto;

        &::before {
          content: ${showErrors ? '"form errors"' : '"form value"'};
          display: inline-block;
          font-variant: small-caps;
          color: theme(colors.gray.600);
          padding: 8px 0;
        }
      `}
    >
      <CodeBlock
        theme={syntaxTheme}
        language="json"
        code={JSON.stringify(showValue, null, 2)}
      />
    </pre>
  ) : null;
}

Result.propTypes = propTypes;

export default Result;
