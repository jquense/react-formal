import { css } from 'astroturf';
import React, { useMemo } from 'react';
import {
  LinkedHeading,
  MDXProvider,
  PropDescription,
  Pre,
} from '@docpocalypse/gatsby-theme';
import renderProps from '@docpocalypse/props-table';
// import Pre from '../../../components/Pre'

const propTypes = {};

const tokenMap = css`
  .union {
    & > *:not(:last-child)::after {
      content: ' | ';
    }
  }
`;

function PropsTable({ metadata }) {
  const { name } = metadata;
  const props = renderProps(metadata.props || [], { tokenMap });
  const components = useMemo(
    () => ({
      pre: props => <Pre {...props} name={name} />,
    }),
    [name],
  );

  return (
    <>
      {props.map(prop => (
        <React.Fragment key={prop.name}>
          <LinkedHeading
            h={3}
            id={prop.name}
            css="margin-top: theme(spacing.8) !important"
          >
            <div className="inline-flex tracking-wider items-center">
              <span>{prop.name}</span>
              {prop.propData.required && (
                <strong className="rounded bg-accent text-white text-xs font-default ml-2 px-2">
                  required
                </strong>
              )}
            </div>
          </LinkedHeading>

          <MDXProvider components={components}>
            <PropDescription
              mdx={prop.propData.description.mdx}
              html={prop.description}
            />
          </MDXProvider>
          <div className="mb-3 text-sm">
            <div>
              <strong>type:</strong>
              <span className="ml-1 font-mono text-info-dark">{prop.type}</span>
            </div>
            {prop.defaultValue && (
              <div className="mt-1">
                <strong>default:</strong>
                <code className="ml-1 text-info-dark font-mono">
                  {prop.defaultValue}
                </code>
              </div>
            )}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}

PropsTable.propTypes = propTypes;

export default PropsTable;
