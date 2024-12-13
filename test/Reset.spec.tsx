import React from 'react';
import { describe, it, vi, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import * as yup from 'yup';
import { Form } from '../src';

describe('Reset', () => {
  const schema = yup.object({ testfield: yup.string() });

  it('should passthrough props', () => {
    const { getByRole } = render(<Form.Reset className="foo" />);

    expect(getByRole('button').classList.contains('foo')).toEqual(true);
  });

  it('should warn when reset is used outside of Form', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let stub = vi.spyOn(console, 'error').mockImplementation(() => {});
    let spy = vi.fn();

    let { getByRole } = render(<Form.Reset onClick={spy} />);

    getByRole('button').click();

    expect(stub).toHaveBeenCalledTimes(1);

    stub.mockRestore();
  });

  it('should reset to default form values', async () => {
    let spy = vi.fn();
    let errorSpy = vi.fn();

    const { getByRole } = render(
      <Form schema={schema} onReset={spy} onError={errorSpy}>
        <div>
          <Form.Field name="testfield" />
          <Form.Reset data-test="test" />
        </div>
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), {
      target: { value: 'foo', type: 'string' },
    });

    expect((getByRole('textbox') as any).value).toBe('foo');

    fireEvent.click(getByRole('button'), {});

    expect((getByRole('textbox') as any).value).toBe('');
  });
});
