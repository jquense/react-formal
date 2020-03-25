import React from 'react';
import ComponentImport from '@docpocalypse/gatsby-theme/src/components/ComponentImport';

const staticProps = [
  'Field',
  'FieldArray',
  'Submit',
  'Message',
  'Summary',
  'Summary',
];
function StyledComponentImport(props) {
  const { docNode } = props;
  let importName = `import { ${docNode.name} } from 'react-formal';`;
  let subtitle;

  if (staticProps.includes(docNode.name)) {
    importName = `import Form from 'react-formal';`;
    subtitle = (
      <ComponentImport
        {...props}
        importName={`const ${docNode.name} = Form.${docNode.name}`}
        className="mt-2 block"
      />
    );
  }

  return (
    <div className="mb-6">
      <ComponentImport {...props} importName={importName} className="block" />
      {subtitle}
    </div>
  );
}

export default StyledComponentImport;
