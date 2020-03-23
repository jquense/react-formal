import React from 'react';
import Form, { statics } from 'react-formal';
import Result from './Result';

function FormWithErrors({ children, ...props }) {
  return (
    <Form {...props} className="lg:flex">
      <div className="lg:flex-2">{children}</div>
      <Result className="lg:ml-4 lg:mt-0" showErrors />
    </Form>
  );
}

export default Object.assign(FormWithErrors, statics);
