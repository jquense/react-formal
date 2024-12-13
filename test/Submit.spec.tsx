import React from 'react';
import { describe, it, vi, expect } from 'vitest';
import { fireEvent, render, act, waitFor } from '@testing-library/react';
import * as yup from 'yup';
import { Form, useFormSubmit } from '../src';
import { FormHandle } from '../src/Form';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Submit', () => {
  const schema = yup.object({ fieldA: yup.mixed(), fieldB: yup.mixed() });

  it('should passthrough props', () => {
    let { getByRole } = render(<Form.Submit className="foo" />);

    expect(getByRole('button').classList.contains('foo')).toBe(true);
  });

  it('should warn when submit is used outside of Form', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let stub = vi.spyOn(console, 'error').mockImplementation(() => {});
    let spy = vi.fn();

    let { getByRole } = render(<Form.Submit onClick={spy} />);

    act(() => {
      getByRole('button').click();
    });
    expect(spy).toHaveBeenCalledTimes(1);

    expect(stub).toHaveBeenCalledTimes(1);

    stub.mockRestore();
  });

  it('should simulate event for name', () => {
    let spy = vi.fn();
    let { getByRole } = render(
      <Form schema={schema} onValidate={spy}>
        <div>
          <Form.Field name="fieldA">
            {(props) => <input {...props} value={props.value || ''} />}
          </Form.Field>
        </div>
      </Form>,
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'foo' } });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ fields: ['fieldA'] }),
    );
  });

  it('should simulate event once with multiple names', () => {
    let spy = vi.fn();
    let { getByRole } = render(
      <Form schema={schema} onValidate={spy}>
        <div>
          <Form.Submit triggers={['fieldA', 'fieldB']} />
        </div>
      </Form>,
    );

    act(() => {
      getByRole('button').click();
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ fields: ['fieldA', 'fieldB'] }),
    );
  });

  it('should simulate for `triggers`', async () => {
    const spy = vi.fn(({ fields }) => {
      expect(fields).toEqual(['fieldA']);
    });

    let { getByRole } = render(
      <Form schema={schema} onValidate={spy}>
        <div>
          <Form.Field name={'fieldA'}>
            {(props) => <input {...props} value={props.value || ''} />}
          </Form.Field>
          <Form.Field name={'fieldB'}>
            {(props) => <input {...props} value={props.value || ''} />}
          </Form.Field>

          <Form.Submit triggers={['fieldA']} />
        </div>
      </Form>,
    );

    act(() => {
      getByRole('button').click();
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should trigger a submit', async () => {
    const spy = vi.fn();

    let { getByRole } = render(
      <Form schema={schema} onSubmit={spy}>
        <div>
          <Form.Field name="fieldA" />

          <Form.Field name="fieldB" />

          <Form.Submit />
        </div>
      </Form>,
    );

    fireEvent.click(getByRole('button'));

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('Field should handle submitting state', async () => {
    let spy = vi.fn(() => wait(50));
    let ref = React.createRef<FormHandle>();

    let { getByTestId } = render(
      <div>
        <Form ref={ref} schema={schema} submitForm={spy}>
          <div>
            <Form.Field name="fieldA">
              {(_, meta) => (
                <span data-testid="span">
                  submitting: {String(meta.submitting)}
                </span>
              )}
            </Form.Field>
          </div>
        </Form>
      </div>,
    );

    let trigger = getByTestId('span');

    expect(trigger.textContent).toBe('submitting: false');

    act(() => {
      ref.current!.submit();
    });

    await waitFor(() => {
      expect(trigger.textContent).toBe('submitting: true');
    });

    await waitFor(() => {
      expect(trigger.textContent).toBe('submitting: false');
    });
  });

  it('Submit should handle submitting state', async () => {
    let ref = React.createRef<FormHandle>();
    let spy = vi.fn(() => wait(50));

    function Submit(props) {
      const [, { submitting, submitCount }] = useFormSubmit(props);

      return (
        <span data-testid="span">
          {String(submitting)}: {String(submitCount)}
        </span>
      );
    }

    let { getByTestId } = render(
      <div>
        <Form ref={ref} schema={schema} submitForm={spy}>
          <div>
            <Submit name="fieldA" />
          </div>
        </Form>
      </div>,
    );

    let trigger = getByTestId('span');

    expect(trigger.textContent).toBe('false: 0');

    act(() => {
      ref.current!.submit();
    });

    await waitFor(() => {
      expect(trigger.textContent).toBe('true: 0');
    });

    await waitFor(() => {
      expect(trigger.textContent).toBe('false: 1');
    });
  });
});
