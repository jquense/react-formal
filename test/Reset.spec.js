import { mount } from 'enzyme';
import React from 'react';
import * as yup from 'yup';
import Form from '../src';

describe('Reset', () => {
  const schema = yup.object({ testfield: yup.string() });

  it('should passthrough props', () => {
    expect(
      mount(<Form.Reset className="foo" />).find('button.foo'),
    ).toHaveLength(1);
  });

  it('should warn when reset is used outside of Form', () => {
    let stub = jest.spyOn(console, 'error').mockImplementation(() => {});
    let spy = jest.fn();

    mount(<Form.Reset onClick={spy} />).simulate('click');

    expect(stub).toHaveBeenCalledTimes(1);

    stub.mockRestore();
  });

  it('should reset to default form values', () => {
    let spy = jest.fn();
    const wrapper = mount(
      <Form schema={schema} onReset={spy}>
        <div>
          <Form.Field name="testfield" />
          <Form.Reset data-test="test" />
        </div>
      </Form>,
    );

    wrapper
      .find('input[name="testfield"]')
      .assertSingle('input')
      .simulate('change', { target: { value: 'foo', type: 'string' } });

    expect(
      wrapper.find('input[name="testfield"]').getElement().props.value,
    ).toBe('foo');

    wrapper.find('button').simulate('click');

    expect(
      wrapper.find('input[name="testfield"]').getElement().props.value,
    ).toBe('');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
