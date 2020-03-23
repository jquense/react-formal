import { mount } from 'enzyme';
import React, { useImperativeHandle } from 'react';
import { act } from 'react-dom/test-utils';
import { array, object, string } from 'yup';
import Form, { useFieldArray } from '../src';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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

  const ColorList = React.forwardRef(({ name }, ref) => {
    const [values, arrayHelpers] = useFieldArray(name);

    useImperativeHandle(
      ref,
      () => ({
        remove: index => {
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
    mount(
      <Form
        schema={schema}
        defaultValue={schema.default()}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <Form.FieldArray name="colors">
          {values => (
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
    ).assertSingle('input.invalid');
  });

  it('should update the form value correctly', async () => {
    let value, last;
    let changeSpy = jest.fn(v => (value = v));

    let wrapper = mount(
      <Form
        schema={schema}
        defaultValue={schema.default()}
        onChange={changeSpy}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <Form.FieldArray name="colors">
          {values => (
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

    await act(() => {
      wrapper
        .find('.field')
        .first()
        .simulate('change', { target: { value: 'beige' } });

      return wait();
    });

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
    await act(() => {
      wrapper
        .find('.field2')
        .last()
        .simulate('change', { target: { value: 'LULZ' } });
      return wait();
    });
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
    let changeSpy = jest.fn(v => (value = v));
    let defaultValue = {
      colors: [
        { name: 'red', hexCode: '#ff0000' },
        { name: 'other red', hexCode: '#ff0000' },
      ],
    };
    let ref = React.createRef();
    let wrapper = mount(
      <Form
        schema={schema}
        onChange={changeSpy}
        defaultValue={defaultValue}
        defaultErrors={{ 'colors[0].name': 'foo' }}
      >
        <ColorList name="colors" ref={ref} />
      </Form>,
    );

    let list = wrapper.find('ul');

    expect(list.find('li')).toHaveLength(2);

    await act(() => {
      ref.current.remove(1);

      return wait();
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
    let errorSpy = jest.fn(v => (errors = v));
    let changeSpy = jest.fn(v => (value = v));
    let defaultValue = {
      colors: [
        { name: '', hexCode: '#ff0000' },
        { name: 'other red', hexCode: '#ff0000' },
      ],
    };
    const ref = React.createRef();
    const ref2 = React.createRef();
    let wrapper = mount(
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

    expect(wrapper.find('ul > li')).toHaveLength(2);

    await act(() => ref.current.submit());

    // First color has an error
    expect(errors['colors[0].name']).toBeDefined();

    await act(() => {
      // remove the first color
      ref2.current.remove(0);
      return wait();
    });
    // The error for the first color should be gone
    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errors['colors[0].name']).not.toBeDefined();

    expect(value).toEqual({
      colors: [{ name: 'other red', hexCode: '#ff0000' }],
    });
  });
});
