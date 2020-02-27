import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import * as yup from 'yup';
import Form from '../src';

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

  class TestInput extends React.Component {
    render() {
      return (
        <input
          value={this.props.value || ''}
          onChange={e => this.props.onChange(e, 'hi')}
        />
      );
    }
  }

  it('should pass props to inner type', () => {
    expect(
      mount(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field name="name" as={TestInput} className="test" />
        </Form>,
      )
        .find(TestInput)
        .instance().props.className,
    ).toEqual('test'); // test invalid-field
  });

  it('should fall back to using schema types', () => {
    let schema = yup.object({
      string: yup.string(),
      number: yup.number(),
      date: yup.date(),
      bool: yup.bool(),
    });

    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="string" />
        <Form.Field name="number" />
        <Form.Field name="date" />
        <Form.Field name="bool" />
        <Form.Field as="select" name="string" />
        <Form.Field as="textarea" name="string" />
      </Form>,
    );

    // console.log(wrapper.debug())
    wrapper.assertSingle(`input[name='string']`);
    wrapper.assertSingle('input[type="number"]');
    wrapper.assertSingle('input[type="date"]');

    wrapper.assertSingle('input[type="checkbox"]');
    wrapper.assertSingle('select');
    wrapper.assertSingle('textarea');
  });

  it('should use as override', () => {
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" as="select" />
        <Form.Field name="name" as="textarea" />
        <Form.Field name="name" as={TestInput} />
      </Form>,
    );
    wrapper.assertSingle(TestInput);
    wrapper.assertSingle('textarea');
    wrapper.assertSingle('select');
  });

  it('should fire onChange', done => {
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          as={TestInput}
          onChange={() => {
            done();
          }}
        />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change');
  });

  it('should pull value from event target', () => {
    let spy = jest.fn();

    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    )
      //.tap(_ => console.log(_.debug()))
      .assertSingle('input')
      .simulate('change', { target: { value: 'foo' } });

    expect(spy).toHaveBeenCalledWith({ name: 'foo' }, ['name']);
  });

  it('should coerce value to number', () => {
    let spy = jest.fn();

    let form = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="age" id="first" />
        <Form.Field type="range" name="age" id="second" />
      </Form>,
    );

    form
      .find('input[type="number"]')
      .simulate('change', { target: { value: '3.56', type: 'number' } });

    expect(spy).toHaveBeenCalledWith({ age: 3.56 }, expect.anything());

    form
      .find('input[type="range"]')
      .simulate('change', { target: { value: '42', type: 'range' } });

    expect(spy).toHaveBeenCalledWith({ age: 42 }, expect.anything());
  });

  it('should update touched value', () => {
    let spy = jest.fn();

    mount(
      <Form schema={schema} defaultValue={{}} onTouch={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', 'foo');

    expect(spy).toHaveBeenCalledWith({ name: true }, ['name']);
  });

  it('should update touched once per field', () => {
    let spy = jest.fn();

    mount(
      <Form schema={schema} defaultValue={{}} onTouch={spy}>
        <Form.Field name="name" as={TestInput} />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', 'foo')
      .simulate('change', 'bar');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('ensures values are never undefined', () => {
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field name="name" />
      </Form>,
    );

    expect(wrapper.assertSingle('input').prop('value')).toBe('');
  });

  it('maps value from string', () => {
    let spy = jest.fn();
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} mapFromValue="value" />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', { value: 'john' });

    expect(spy).toHaveBeenCalledWith({ name: 'john' }, expect.anything());
  });

  it('maps value from function', () => {
    let spy = jest.fn();
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field name="name" as={TestInput} mapFromValue={e => e.value} />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', { value: 'john' });

    expect(spy).toHaveBeenCalledWith({ name: 'john' }, expect.anything());
  });

  it('gets value from accessor', () => {
    let spy = jest.fn(model => model.other);
    let wrapper = mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapToValue={spy}
          mapFromValue={{
            other: e => e.value,
          }}
        />
      </Form>,
    );

    expect(spy).toHaveBeenCalledWith({}, expect.anything());

    wrapper.assertSingle('input').simulate('change', { value: 'john' });

    expect(spy).toHaveBeenCalledWith({ other: 'john' }, expect.anything());
  });

  it('maps values from hash', () => {
    let spy = jest.fn();
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapFromValue={{
            name: e => e.value,
            text: 'text',
          }}
        />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change', { value: 'john', text: 'hi' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      {
        name: 'john',
        text: 'hi',
      },
      expect.anything(),
    );
  });

  it('should pass all args to mapFromValue', function(done) {
    let spy = jest.fn();
    mount(
      <Form schema={schema} defaultValue={{}} onChange={spy}>
        <Form.Field
          name="name"
          as={TestInput}
          mapFromValue={(...args) => {
            expect(args.length).toBe(2);
            expect(args[1]).toBe('hi');
            done();
          }}
        />
      </Form>,
    )
      .assertSingle('input')
      .simulate('change');
  });

  it('should forward inner ref', () => {
    let inst;
    mount(
      <Form schema={schema} defaultValue={{}}>
        <Form.Field
          name="name"
          as={TestInput}
          ref={r => {
            inst = r;
          }}
        />
      </Form>,
    );
    expect(inst instanceof TestInput).toBe(true);
  });

  it('should work with conditional schema', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    let render = name => {
      mount(
        <Form schema={schema} defaultValue={{ ...schema.default(), name }}>
          <Form.Field name="more.isCool" />
        </Form>,
      );
    };

    render('john');
    expect(spy).toHaveBeenCalled();
  });

  describe('meta', () => {
    it('should pass meta to field', done => {
      let Input = ({ meta }) => {
        // //first pass isn't correct since form hasn't propagated it's state yet.
        // if (!meta.invalid) return null

        expect(meta.invalid).toBe(true);
        expect(meta.valid).toBe(false);

        expect(meta.touched).toBe(true);

        expect(meta.errors).toEqual({
          name: 'foo',
        });
        done();
        return null;
      };

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
    });

    it('should pass meta to field with noValidate', done => {
      let Input = ({ meta }) => {
        expect(meta.invalid).toBe(true);
        expect(meta.valid).toBe(false);
        expect(meta.errors).toEqual({
          name: 'foo',
        });
        done();
        return null;
      };

      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field noValidate name="name" as={Input} />
        </Form>,
      );
    });

    it('should field onError should remove existing errors', () => {
      let errorSpy = jest.fn();
      act(() => {
        mount(
          <Form
            schema={schema}
            defaultValue={{}}
            defaultErrors={{ name: 'foo', bar: 'baz' }}
            onError={errorSpy}
          >
            <Form.Field name="name" as={TestInput} />
          </Form>,
        )
          .find(TestInput)
          .props()
          .meta.onError({});
      });

      expect(errorSpy).toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should field onError should update field errors', () => {
      let errorSpy = jest.fn();
      act(() => {
        mount(
          <Form
            schema={schema}
            defaultValue={{}}
            defaultErrors={{ name: 'foo', bar: 'baz' }}
            onError={errorSpy}
          >
            <Form.Field name="name" as={TestInput} />
          </Form>,
        )
          .find(TestInput)
          .props()
          .meta.onError({ 'name': 'foo', 'name.first': 'baz' });
      });

      expect(errorSpy).toHaveBeenCalledWith({
        'name': 'foo',
        'name.first': 'baz',
        'bar': 'baz',
      });
    });

    it('should set events via a function', done => {
      let schema = yup.object({
        number: yup.number().min(5),
      });
      let spy = jest.fn();
      let wrapper = mount(
        <Form
          delay={0}
          schema={schema}
          onValidate={spy}
          defaultValue={{ number: 6 }}
        >
          <Form.Field
            name="number"
            events={({ valid }) => (valid ? ['onBlur'] : ['onChange'])}
          >
            {/* noop prevents a readonly console warning */}
            {props => <input onChange={() => {}} {...props} />}
          </Form.Field>
        </Form>,
      );
      // Field is valid only; `onBlur`
      act(() => {
        wrapper.find('input').simulate('change', { target: { value: '4' } });
        wrapper.find('input').simulate('blur', { target: { value: '4' } });
      });

      setTimeout(() => {
        act(() => {
          expect(spy).toHaveBeenCalledTimes(1);
          // field is invalid now: `onChange`
          wrapper.find('input').simulate('blur', { target: { value: '4' } });

          expect(spy).toHaveBeenCalledTimes(1);

          wrapper.find('input').simulate('change', { target: { value: '6' } });

          expect(spy).toHaveBeenCalledTimes(2);
        });
        done();
      }, 100);
    });

    it('should field onError should replace field errors', () => {
      let errorSpy = jest.fn();

      act(() => {
        mount(
          <Form
            schema={schema}
            defaultValue={{}}
            defaultErrors={{ name: 'foo', bar: 'baz' }}
            onError={errorSpy}
          >
            <Form.Field name="name" as={TestInput} />
          </Form>,
        )
          .find(TestInput)
          .props()
          .meta.onError({ 'name.first': 'baz' });
      });

      expect(errorSpy).toHaveBeenCalledWith({
        'name.first': 'baz',
        'bar': 'baz',
      });
    });
  });

  describe('inclusive active matching', () => {
    it('should count path matches', () => {
      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field name="name" errorClass="invalid" />
        </Form>,
      ).assertSingle('input.invalid');
    });

    it('should use inclusive active checking', () => {
      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field name="name" errorClass="invalid" />
        </Form>,
      ).assertSingle('input.invalid');
    });

    it('should respect `exclusive`', () => {
      mount(
        <Form
          schema={schema}
          defaultValue={{}}
          defaultErrors={{ 'name.first': 'foo' }}
        >
          <Form.Field exclusive name="name" errorClass="invalid" />
        </Form>,
      ).assertNone('input.invalid');
    });

    it('should respect `exclusive` and still have errors', () => {
      mount(
        <Form schema={schema} defaultValue={{}} defaultErrors={{ name: 'foo' }}>
          <Form.Field exclusive name="name" errorClass="invalid" />
        </Form>,
      ).assertSingle('input.invalid');
    });
  });

  xdescribe('form fields', () => {
    it('should inject onError', () => {
      expect(
        mount(
          <Form schema={schema} defaultValue={{}}>
            <Form.Field name="name" />
          </Form>,
        )
          .find('input')
          .prop('onError'),
      ).toBeInstanceOf(Function);
    });

    // skip for now since name is still required.
    xit('should not inject onError for nameless fields', () => {
      expect(
        mount(
          <Form schema={schema} defaultValue={{}}>
            <Form.Field />
          </Form>,
        )
          .find('input')
          .prop('onError'),
      ).toBeInstanceOf(Function);
    });

    it('should propagate onError to form', () => {
      let spy = jest.fn();

      mount(
        <Form schema={schema} defaultValue={{}} onError={spy}>
          <Form.Field name="name" />
        </Form>,
      )
        .find('input')
        .prop('onError')({ foo: 'bar' });

      expect(spy).toHaveBeenCalledWith({
        'name.foo': 'bar',
      });
    });

    it('should properly prefix nested errors', () => {
      const onError = mount(
        <Form schema={schema} defaultValue={{}}>
          <Form.Field name="name" />
        </Form>,
      )
        .find('input')
        .prop('onError');

      expect(onError({ foo: 'bar' })).toEqual({ 'name.foo': 'bar' });
      expect(onError({ '[1].foo': 'bar' })).toEqual({ 'name[1].foo': 'bar' });
      expect(onError({ '[1].baz.foo': 'bar' })).toEqual({
        'name[1].baz.foo': 'bar',
      });
    });
  });
});
