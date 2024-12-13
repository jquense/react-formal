import React, { useImperativeHandle } from 'react';
import { array, object, string } from 'yup';
import { describe, it, vi, expect } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';

import { Form, useFieldArray } from '../src';

describe('FieldArray', () => {
  let schema = object({
    colors: array()
      .of(
        object({
          name: string().required(),
          hexCode: string().required(),
        }),
      )
      .default(() => [{ name: 'red', hexCode: '#ff0000' }]),
  });

  const ColorList = React.forwardRef(({ name }: any, ref) => {
    const [values, arrayHelpers] = useFieldArray(name);

    useImperativeHandle(
      ref,
      () => ({
        remove: (index) => {
          arrayHelpers.remove(values[index]);
        },
      }),
      [arrayHelpers, values],
    );

    return (
      <ul>
        {values.map((value, idx) => (
          <li key={`${value.hexCode}-${value.name}`}>
            <Form.Field name={`${name}[${idx}].name`} />
            <Form.Field name={`${name}[${idx}].hexCode`} />
          </li>
        ))}
      </ul>
    );
  });

  it('should render forms correctly', () => {
    const { getAllByRole } = render(
      <Form
        schema={schema}
        defaultValue={schema.getDefault()}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <Form.FieldArray name="colors">
          {(values) => (
            <ul>
              {values.map((value, idx) => (
                <li key={idx}>
                  <Form.Field
                    name={`colors[${idx}].name`}
                    errorClass="invalid"
                  />
                  <Form.Field name={`colors[${idx}].hexCode`} />
                </li>
              ))}
            </ul>
          )}
        </Form.FieldArray>
      </Form>,
    );

    expect(getAllByRole('textbox')[0].className).toEqual(' invalid');
  });

  it('should update the form value correctly', async () => {
    let value, last;
    let changeSpy = vi.fn((v) => (value = v));

    const { getAllByRole } = render(
      <Form
        schema={schema}
        defaultValue={schema.getDefault()}
        onChange={changeSpy}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <Form.FieldArray name="colors">
          {(values) => (
            <ul>
              {values.map((value, idx) => (
                <li key={idx}>
                  <Form.Field name={`colors[${idx}].name`} className="field" />
                  <Form.Field
                    name={`colors[${idx}].hexCode`}
                    className="field2"
                  />
                </li>
              ))}
            </ul>
          )}
        </Form.FieldArray>
      </Form>,
    );

    let inputs = getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: 'beige' } });

    expect(changeSpy).toHaveBeenCalledTimes(1);

    expect(value).toEqual({
      colors: [
        {
          name: 'beige',
          hexCode: '#ff0000',
        },
      ],
    });

    last = value;

    fireEvent.change(inputs[1], { target: { value: 'LULZ' } });

    expect(value).toEqual({
      colors: [
        {
          name: 'beige',
          hexCode: 'LULZ',
        },
      ],
    });

    expect(value).not.toBe(last);
  });

  it('should handle removing array items', async () => {
    let value;
    let changeSpy = vi.fn((v) => (value = v));
    let defaultValue = {
      colors: [
        { name: 'red', hexCode: '#ff0000' },
        { name: 'other red', hexCode: '#ff0000' },
      ],
    };
    let ref = React.createRef<any>();
    let { getByRole } = render(
      <Form
        schema={schema}
        onChange={changeSpy}
        defaultValue={defaultValue}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <ColorList name="colors" ref={ref} />
      </Form>,
    );

    let list = getByRole('list');

    expect(list.children).toHaveLength(2);

    act(() => {
      ref.current.remove(1);
    });

    expect(value).toEqual({
      colors: [
        {
          name: 'red',
          hexCode: '#ff0000',
        },
      ],
    });
  });

  it('should shift errors for removed fields', async () => {
    let value, errors;
    let errorSpy = vi.fn((v) => (errors = v));
    let changeSpy = vi.fn((v) => (value = v));
    let defaultValue = {
      colors: [
        { name: '', hexCode: '#ff0000' },
        { name: 'other red', hexCode: '#ff0000' },
      ],
    };
    const ref = React.createRef<any>();
    const ref2 = React.createRef<any>();
    let { getByRole } = render(
      <div>
        <Form
          ref={ref}
          schema={schema}
          onChange={changeSpy}
          onError={errorSpy}
          defaultValue={defaultValue}
        >
          <ColorList name="colors" ref={ref2} />
        </Form>
      </div>,
    );

    let list = getByRole('list');

    expect(list.children).toHaveLength(2);

    await act(() => ref.current.submit());

    // First color has an error
    expect(errors['colors[0].name']).toBeDefined();

    act(() => {
      // remove the first color
      ref2.current.remove(0);
    });
    // The error for the first color should be gone
    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errors['colors[0].name']).not.toBeDefined();

    expect(value).toEqual({
      colors: [{ name: 'other red', hexCode: '#ff0000' }],
    });
  });
});
