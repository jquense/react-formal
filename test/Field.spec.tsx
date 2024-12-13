import React from 'react';
import * as yup from 'yup';

import { describe, it, vi, expect } from 'vitest';

import { act, fireEvent, render } from '@testing-library/react';

import { Form, useField, UseFieldProps, FieldMeta } from '../src';

let mount = render;

describe('Field', () => {
  let schema = yup.object({
    name: yup.string().default(''),
    age: yup.number(),
    more: yup.object().when('name', {
      is: 'jason',
      then: yup.object({
        isCool: yup.bool(),
      }),
    }),
  });

  class TestInput extends React.Component<{
    value?: string;
    onChange: (evt: React.ChangeEvent, field: string) => void;
  }> {
    render() {
      return (
        <input
          {...this.props}
          value={this.props.value || ''}
          onChange={(e) => this.props.onChange(e, 'hi')}
        />
      );
    }
  }

  it('should pass props to inner type', () => {
    const { getByRole } = render(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" as={TestInput} className="test" />
      </Form>,
    );

    expect(getByRole('textbox').className).toEqual('test'); // test invalid-field
  });

  it('should pass props to inner type if field is invalid', () => {
    let { getByRole } = render(
      <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
        <Form.Field
          name="name"
          as={TestInput}
          className="test"
          errorClass="invalid"
        />
      </Form>,
    );

    expect(getByRole('textbox').className).toEqual('test invalid');
  });

  it('should provide an onChange handler even without validation', () => {
    const spy = vi.fn();
    let fieldProps: any = null;
    function Input(props) {
      fieldProps = props;
      return null;
    }

    render(
      <Form schema={schema} onValidate={spy} defaultValue={{}}>
        <Form.Field name="name" as={Input} validateOn={null} />
      </Form>,
    );

    expect(fieldProps!.onChange).toBeDefined();

    expect(spy).not.toBeCalled();
  });

  it('should fall back to using schema types', () => {
    let schema = yup.object({
      string: yup.string(),
      number: yup.number(),
      date: yup.date(),
      bool: yup.bool(),
    });

    let { container } = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="string" />
        <Form.Field name="number" />
        <Form.Field name="date" />
        <Form.Field name="bool" />
        <Form.Field as="select" name="string" />
        <Form.Field as="textarea" name="string" />

        <Form.Field name="bool">
          {(props) => {
            expect(props).toEqual({
              name: 'bool',
              value: undefined,
              onBlur: expect.any(Function),
              onChange: expect.any(Function),
            });
            return null;
          }}
        </Form.Field>
      </Form>,
    );

    expect(container.querySelector(`input[name='string']`)).toBeTruthy();
    expect(container.querySelector('input[type="number"]')).toBeTruthy();
    expect(container.querySelector('input[type="date"]')).toBeTruthy();

    expect(container.querySelector('input[type="checkbox"]')).toBeTruthy();
    expect(container.querySelector('select')).toBeTruthy();
    expect(container.querySelector('textarea')).toBeTruthy();
  });

  it('should use as override', () => {
    let { container } = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" as="select" />
        <Form.Field name="name" as="textarea" />
        <Form.Field name="name" as={TestInput} />
      </Form>,
    );
    expect(container.getElementsByTagName('input')).toBeTruthy();
    expect(container.getElementsByTagName('textarea')).toBeTruthy();
    expect(container.getElementsByTagName('select')).toBeTruthy();
  });

  it('should fire onChange', () => {
    const spy = vi.fn();

    const { getByRole } = render(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          as={TestInput}
          onChange={() => {
            spy();
          }}
        />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'Jill' } });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should pull value from event target', () => {
    let spy = vi.fn();

    const { getByRole } = render(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'foo' } });

    expect(spy).toHaveBeenCalledWith({ name: 'foo' }, ['name']);
  });

  it('should coerce value to number', () => {
    let spy = vi.fn();

    let { container } = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="age" id="first" />
        <Form.Field type="range" name="age" id="second" />
      </Form>,
    );

    fireEvent.change(container.querySelector('input[type="number"]')!, {
      target: { value: '3.56', type: 'number' },
    });

    expect(spy).toHaveBeenCalledWith({ age: 3.56 }, expect.anything());

    fireEvent.change(container.querySelector('input[type="range"]')!, {
      target: { value: '42', type: 'range' },
    });

    expect(spy).toHaveBeenCalledWith({ age: 42 }, expect.anything());
  });

  it('should update touched value', () => {
    let spy = vi.fn();

    const { getByRole } = mount(
      <Form schema={schema} defaultValue={{}} onTouch={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'foo' } });

    expect(spy).toHaveBeenCalledWith({ name: true }, ['name']);
  });

  it('should update touched once per field', () => {
    let spy = vi.fn();

    const { getByRole } = mount(
      <Form schema={schema} defaultValue={{}} onTouch={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'foo' } });
    fireEvent.change(getByRole('textbox'), { target: { value: 'bar' } });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('ensures values are never undefined', () => {
    let { getByRole } = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" />
      </Form>,
    );

    expect((getByRole('textbox') as any).value).toBe('');
  });

  it('maps value from string', () => {
    let spy = vi.fn();

    function TestInput({ value, onChange }) {
      return (
        <input
          value={value}
          onChange={(e) => onChange({ otherProperty: e.target.value })}
        />
      );
    }
    const { getByRole } = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} mapFromValue="otherProperty" />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'john' },
    });

    expect(spy).toHaveBeenCalledWith({ name: 'john' }, expect.anything());
  });

  it('maps value from function', () => {
    let spy = vi.fn();

    function TestInput({ value, onChange }) {
      return (
        <input
          value={value}
          onChange={(e) => onChange({ otherProperty: e.target.value })}
        />
      );
    }

    const { getByRole } = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapFromValue={(e: any) => e.otherProperty}
        />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'john' },
    });

    expect(spy).toHaveBeenCalledWith({ name: 'john' }, expect.anything());
  });

  it('gets value from accessor', () => {
    let spy = vi.fn((model) => model.other);

    const { getByRole } = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapToValue={spy}
          mapFromValue={{
            other: (e: any) => e.target.value,
          }}
        />
      </Form>,
    );

    expect(spy).toHaveBeenCalledWith({}, expect.anything());

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'john' },
    });

    expect(spy).toHaveBeenCalledWith({ other: 'john' }, expect.anything());
  });

  it('maps values from hash', () => {
    let spy = vi.fn();

    function TestInput({ value, onChange }) {
      return (
        <input
          value={value}
          onChange={(e) =>
            onChange({ otherProperty: e.target.value, text: 'hi' })
          }
        />
      );
    }

    let { getByRole } = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapFromValue={{
            name: (e: any) => e.otherProperty,
            text: 'text',
          }}
        />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'john' },
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      {
        name: 'john',
        text: 'hi',
      },
      expect.anything(),
    );
  });

  it('should pass all args to mapFromValue', () => {
    let spy = vi.fn();
    let mapFromValue = vi.fn();
    let { getByRole } = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} mapFromValue={mapFromValue} />
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'john' },
    });

    expect(mapFromValue).toHaveBeenLastCalledWith(expect.anything(), 'hi');
  });

  it('should forward inner ref', () => {
    let inst;
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          as={TestInput}
          ref={(r) => {
            inst = r;
          }}
        />
      </Form>,
    );

    expect(inst instanceof TestInput).toBe(true);
  });

  describe('meta', () => {
    it('should pass meta to field', () => {
      let Input = vi.fn(({ meta }) => {
        // //first pass isn't correct since form hasn't propagated it's state yet.
        // if (!meta.invalid) return null

        expect(meta.invalid).toBe(true);
        expect(meta.valid).toBe(false);

        expect(meta.touched).toBe(true);

        expect(meta.errors).toEqual({
          name: 'foo',
        });

        return null;
      });

      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo' }}
          defaultTouched={{ name: true }}
        >
          <Form.Field name="name" as={Input} />
        </Form>,
      );

      expect(Input).toHaveBeenCalled();
    });

    it('should pass meta to field with noValidate', () => {
      let Input = vi.fn(({ meta }) => {
        expect(meta.invalid).toBe(true);
        expect(meta.valid).toBe(false);
        expect(meta.errors).toEqual({
          name: 'foo',
        });
        return null;
      });

      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field noValidate name="name" as={Input} />
        </Form>,
      );

      expect(Input).toHaveBeenCalled();
    });

    it('should field onError should remove existing errors', () => {
      let errorSpy = vi.fn();

      let inputMeta;
      function TestInput({ meta, ...props }) {
        inputMeta = meta;
        return <input {...props} />;
      }

      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name="name" as={TestInput} />
        </Form>,
      );

      act(() => {
        inputMeta.onError({});
      });

      expect(errorSpy).toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should field onError should update field errors', () => {
      let errorSpy = vi.fn();

      let inputMeta;
      function TestInput({ meta, ...props }) {
        inputMeta = meta;
        return <input {...props} />;
      }

      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name="name" as={TestInput} />
        </Form>,
      );

      act(() => {
        inputMeta.onError({ 'name': 'foo', 'name.first': 'baz' });
      });

      expect(errorSpy).toHaveBeenCalledWith({
        'name': 'foo',
        'name.first': 'baz',
        'bar': 'baz',
      });
    });

    // it('should set validateOn via a function', async () => {
    //   let schema = yup.object({
    //     number: yup.number().min(5),
    //   });
    //   let spy = vi.fn();
    //   const { getByRole } = mount(
    //     <Form
    //       delay={0}
    //       schema={schema}
    //       onValidate={spy}
    //       defaultValue={{ number: 6 }}
    //     >
    //       <Form.Field
    //         name="number"
    //         validateOn={({ valid }) => ({
    //           blur: valid,
    //           change: !valid,
    //         })}
    //       >
    //         {(props) => <input {...props} />}
    //       </Form.Field>
    //     </Form>,
    //   );

    //   let input = getByRole('textbox');
    //   fireEvent.change(input, { target: { value: '4' } });
    //   fireEvent.blur(input, { target: { value: '4' } });

    //   // Field is valid only; `onBlur`
    //   await act(() => {
    //     return new Promise<void>((resolve) => {
    //       setTimeout(() => {
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         // field is invalid now: `onChange`

    //         fireEvent.blur(input, { target: { value: '4' } });

    //         expect(spy).toHaveBeenCalledTimes(1);

    //         fireEvent.change(input, { target: { value: '6' } });

    //         expect(spy).toHaveBeenCalledTimes(2);

    //         resolve();
    //       }, 100);
    //     });
    //   });
    // });

    it('should field onError should replace field errors', () => {
      let errorSpy = vi.fn();

      let inputMeta;
      function TestInput({ meta, ...props }) {
        inputMeta = meta;
        return <input {...props} />;
      }

      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ name: 'foo', bar: 'baz' }}
          onError={errorSpy}
        >
          <Form.Field name="name" as={TestInput} />
        </Form>,
      );

      act(() => {
        inputMeta.onError({ 'name.first': 'baz' });
      });

      expect(errorSpy).toHaveBeenCalledWith({
        'name.first': 'baz',
        'bar': 'baz',
      });
    });
  });

  describe('inclusive active matching', () => {
    it('should count path matches', () => {
      const { getByRole } = mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field name="name" errorClass="invalid" />
        </Form>,
      );

      expect(getByRole('textbox').className).toEqual(' invalid');
    });

    it('should use inclusive active checking', () => {
      let { getByRole } = mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field name="name" errorClass="invalid" />
        </Form>,
      );

      expect(getByRole('textbox').className).toEqual(' invalid');
    });

    it('should respect `exclusive`', () => {
      let { getByRole } = mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field exclusive name="name" errorClass="invalid" />
        </Form>,
      );

      expect(getByRole('textbox').className).toEqual('');
    });

    it('should respect `exclusive` and still have errors', () => {
      let { getByRole } = mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field exclusive name="name" errorClass="invalid" />
        </Form>,
      );
      expect(getByRole('textbox').className).toEqual(' invalid');
    });
  });

  describe('useField', () => {
    let fieldProps: UseFieldProps, meta: FieldMeta;

    it('providing `as` results in default props', () => {
      function F() {
        [fieldProps, meta] = useField({ name: 'field', as: () => null });
        return null;
      }

      render(
        <Form
          defaultValue={{ field: true }}
          schema={yup.object({ field: yup.boolean() })}
        >
          <F />
        </Form>,
      );

      // inferred details should still be accessible
      expect(meta.nativeTagName).toEqual('input');

      expect(meta.nativeType).toEqual('checkbox');

      // no extra props
      expect(fieldProps).toEqual({
        name: 'field',
        value: true,
        onBlur: expect.any(Function),
        onChange: expect.any(Function),
      });
    });

    describe('checkbox/radios', () => {
      it('should get checked correctly', () => {
        function F() {
          [fieldProps, meta] = useField({
            name: 'field',
            type: 'radio',
            value: 'red',
          });
          return null;
        }

        const schema = yup.object({ field: yup.string() });
        const { rerender } = mount(
          <Form value={{ field: 'red' }} schema={schema}>
            <F />
          </Form>,
        );

        expect(fieldProps).toEqual({
          name: 'field',
          type: 'radio',
          checked: true,
          value: 'red',
          onBlur: expect.any(Function),
          onChange: expect.any(Function),
        });

        rerender(
          <Form value={{ field: 'blue' }} schema={schema}>
            <F />
          </Form>,
        );

        expect(fieldProps).toEqual(
          expect.objectContaining({
            type: 'radio',
            checked: false,
            value: 'red',
          }),
        );
      });

      it('should infer checkbox props from schema', () => {
        function F() {
          [fieldProps, meta] = useField('field');
          return null;
        }

        mount(
          <Form
            defaultValue={{ field: true }}
            schema={yup.object({ field: yup.boolean() })}
          >
            <F />
          </Form>,
        );

        expect(fieldProps).toEqual({
          name: 'field',
          type: 'checkbox',
          checked: true,
          value: undefined,
          onBlur: expect.any(Function),
          onChange: expect.any(Function),
        });
      });

      it('should infer checkbox props from schema with value', () => {
        function F() {
          [fieldProps, meta] = useField({ name: 'field', value: 'on' });
          return null;
        }

        mount(
          <Form
            defaultValue={{ field: true }}
            schema={yup.object({ field: yup.boolean() })}
          >
            <F />
          </Form>,
        );

        expect(fieldProps).toEqual(
          expect.objectContaining({
            type: 'checkbox',
            checked: true,
            value: 'on',
          }),
        );
      });

      it('should checked from array', () => {
        function F() {
          [fieldProps, meta] = useField({
            name: 'field',
            type: 'checkbox',
            value: 'red',
          });
          return null;
        }
        let schema = yup.object({ field: yup.array() });
        const { rerender } = mount(
          <Form value={{ field: ['red'] }} schema={schema}>
            <F />
          </Form>,
        );

        rerender(
          <Form value={{ field: ['blue'] }} schema={schema}>
            <F />
          </Form>,
        );

        expect(fieldProps).toEqual(
          expect.objectContaining({
            type: 'checkbox',
            checked: false,
            value: 'red',
          }),
        );
      });

      it('should respect user `as`', () => {
        function F() {
          [fieldProps, meta] = useField({ name: 'field', as: () => null });
          return null;
        }

        render(
          <Form
            defaultValue={{ field: true }}
            schema={yup.object({ field: yup.boolean() })}
          >
            <F />
          </Form>,
        );

        // inferred details should still be accessible
        expect(meta.nativeTagName).toEqual('input');

        expect(meta.nativeType).toEqual('checkbox');

        // no extra props
        expect(fieldProps.type).toBeUndefined();
        expect(fieldProps.value).toEqual(true);
      });

      it('should respect user type', () => {
        function F() {
          [fieldProps, meta] = useField({ name: 'field', type: 'text' });
          return null;
        }

        render(
          <Form
            defaultValue={{ field: true }}
            schema={yup.object({ field: yup.boolean() })}
          >
            <F />
          </Form>,
        );

        expect(fieldProps).toEqual(
          expect.objectContaining({
            type: 'text',
            value: true,
          }),
        );
      });
    });

    describe('selects', () => {
      it('should default value to ""', () => {
        function F() {
          [fieldProps, meta] = useField({ name: 'field', as: 'select' });
          return null;
        }

        render(
          <Form
            defaultValue={{ field: null }}
            schema={yup.object({ field: yup.string().nullable() })}
          >
            <F />
          </Form>,
        );

        expect(fieldProps.type).toBeUndefined();
        expect(fieldProps.value).toEqual('');
      });

      it('should infer multiple select from schema', () => {
        function F() {
          [fieldProps, meta] = useField('field');
          return null;
        }

        render(
          <Form
            defaultValue={{ field: null }}
            schema={yup.object({ field: yup.array().nullable() })}
          >
            <F />
          </Form>,
        );

        expect(fieldProps).toEqual({
          name: 'field',
          value: [],
          multiple: true,
          onBlur: expect.any(Function),
          onChange: expect.any(Function),
        });
      });
    });

    it('should not infer when element is wrong', () => {
      function F() {
        [fieldProps, meta] = useField({ name: 'field', as: 'select' });
        return null;
      }

      render(
        <Form
          defaultValue={{ field: true }}
          schema={yup.object({ field: yup.boolean() })}
        >
          <F />
        </Form>,
      );

      expect(fieldProps).toEqual({
        name: 'field',
        value: true,
        onBlur: expect.any(Function),
        onChange: expect.any(Function),
      });
    });
  });
});
