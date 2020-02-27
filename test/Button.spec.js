import { mount } from 'enzyme';
import React from 'react';
import Form from '../src';

describe('Form Button', () => {
  it('should passthrough props', () => {
    expect(
      mount(<Form.Submit className="foo" />).find('button.foo'),
    ).toHaveLength(1);
  });

  it('should chain events', () => {
    let stub = jest.spyOn(console, 'error');
    let spy = jest.fn();

    mount(<Form.Submit onClick={spy} />).simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);

    expect(stub).toHaveBeenCalledTimes(1);

    stub.mockRestore();
  });
});
