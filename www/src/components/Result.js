import React from 'react';
import { CodeBlock } from '@docpocalypse/code-live';
import { syntaxTheme } from '@docpocalypse/gatsby-theme';

// eslint-disable-next-line import/no-unresolved
import { useFormValues } from 'react-formal';
import { css } from 'astroturf';

const propTypes = {};

function Result({ value }) {
  const formValue = useFormValues(m => m);
  return value ?? formValue ?? '' ? (
    <pre
      style={{ ...syntaxTheme?.plain, backgroundColor: undefined }}
      css={css`
        composes: px-3 pb-3 mt-4 rounded relative text-sm bg-subtle-on-dark from global;

        &::before {
          content: 'form value ';
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
        code={JSON.stringify(value ?? formValue ?? '', null, 2)}
      />
    </pre>
  ) : null;
}

Result.propTypes = propTypes;

export default Result;
