import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import * as yup from 'yup';
import Form, { useFormSubmit } from '../src';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Submit', () => {
  const schema = yup.object({ fieldA: yup.mixed(), fieldB: yup.mixed() });

  it('should passthrough props', () => {
    expect(
      mount(<Form.Submit className="foo" />).find('button.foo'),
    ).toHaveLength(1);
  });

  it('should warn when submit is used outside of Form', () => {
    let stub = jest.spyOn(console, 'error').mockImplementation(() => {});
    let spy = jest.fn();

    mount(<Form.Submit onClick={spy} />).simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);

    expect(stub).toHaveBeenCalledTimes(1);

    stub.mockRestore();
  });

  it('should simulate event for name', () => {
    let spy = jest.fn(),
      wrapper = mount(
        <Form schema={schema} onValidate={spy}>
          <div>
            <Form.Field name="fieldA" noMeta>
              {props => <input {...props} value={props.value || ''} />}
            </Form.Field>
          </div>
        </Form>,
      );

    wrapper.find('input').simulate('change');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ fields: ['fieldA'] }),
    );
  });

  it('should simulate event once with multiple names', () => {
    let spy = jest.fn(),
      wrapper = mount(
        <Form schema={schema} onValidate={spy}>
          <div>
            <Form.Submit triggers={['fieldA', 'fieldB']} />
          </div>
        </Form>,
      );

    wrapper.find('button').simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ fields: ['fieldA', 'fieldB'] }),
    );
  });

  it('should simulate for `triggers`', async () => {
    const spy = jest.fn(({ fields }) => {
      expect(fields).toEqual(['fieldA']);
    });

    let wrapper = mount(
      <Form schema={schema} onValidate={spy}>
        <div>
          <Form.Field name={'fieldA'}>
            {props => <input {...props} value={props.value || ''} />}
          </Form.Field>
          <Form.Field name={'fieldB'}>
            {props => <input {...props} value={props.value || ''} />}
          </Form.Field>

          <Form.Submit triggers={['fieldA']} />
        </div>
      </Form>,
    );

    await act(() => {
      wrapper.find('button').simulate('click');
      return wait();
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should trigger a submit', async () => {
    const spy = jest.fn();

    let wrapper = mount(
      <Form schema={schema} onSubmit={spy}>
        <div>
          <Form.Field name="fieldA">
            {({ props }) => <input {...props} />}
          </Form.Field>

          <Form.Field name="fieldB">
            {({ props }) => <input {...props} />}
          </Form.Field>

          <Form.Submit />
        </div>
      </Form>,
    );

    await act(() => {
      wrapper.find('button').simulate('click');
      return wait();
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Field should handle submitting state', async () => {
    let spy = jest.fn(() => wait(50));
    let ref = React.createRef();

    let wrapper = mount(
      <div>
        <Form ref={ref} schema={schema} submitForm={spy}>
          <div>
            <Form.Field name="fieldA">
              {(_, meta) => <span>submitting: {String(meta.submitting)}</span>}
            </Form.Field>
          </div>
        </Form>
      </div>,
    );

    let trigger = wrapper.find('span');

    expect(trigger.text()).toBe('submitting: false');

    await act(async () => {
      let promise = ref.current.submit();

      await wait();

      expect(trigger.text()).toBe('submitting: true');

      return promise;
    });

    expect(trigger.text()).toBe('submitting: false');
  });

  it('Submit should handle submitting state', async () => {
    let ref = React.createRef();
    let spy = jest.fn(() => wait(50));

    function Submit(props) {
      const [, { submitting, submitCount }] = useFormSubmit(props);

      return (
        <span>
          {String(submitting)}: {String(submitCount)}
        </span>
      );
    }

    let wrapper = mount(
      <div>
        <Form ref={ref} schema={schema} submitForm={spy}>
          <div>
            <Submit name="fieldA" />
          </div>
        </Form>
      </div>,
    );

    let trigger = wrapper.find('span');

    expect(trigger.text()).toBe('false: 0');

    await act(async () => {
      let promise = ref.current.submit();

      await wait();

      expect(trigger.text()).toBe('true: 0');

      return promise;
    });

    expect(trigger.text()).toBe('false: 1');
  });
});
