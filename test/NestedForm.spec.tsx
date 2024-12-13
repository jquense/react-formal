import React from 'react';
import * as yup from 'yup';
import { Form } from '../src';
import NestedForm from '../src/NestedForm';
import { describe, it, vi, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

describe('NestedForm', () => {
  let schema = yup.object({
    name: yup.object({
      first: yup.string().default(''),
      last: yup.string().default(''),
    }),
  });

  it('should work', () => {
    let value, last;
    let change = vi.fn((v) => (value = v));

    let { getAllByRole } = render(
      <Form
        schema={schema}
        defaultValue={schema.getDefault()}
        onChange={change}
      >
        <div>
          <NestedForm as="div" name="name">
            <Form.Field name="first" className="field" />
            <Form.Field name="last" className="field" />
          </NestedForm>
        </div>
      </Form>,
    );

    const [firstInput, lastInput] = getAllByRole('textbox');

    fireEvent.change(firstInput, { target: { value: 'Jill' } });

    expect(change).toHaveBeenCalledTimes(1);

    expect(value).toEqual({
      name: {
        first: 'Jill',
        last: '',
      },
    });

    last = value;
    fireEvent.change(lastInput, { target: { value: 'Smith' } });

    expect(value).toEqual({
      name: {
        first: 'Jill',
        last: 'Smith',
      },
    });

    expect(value).not.toBe(last);
  });
});
