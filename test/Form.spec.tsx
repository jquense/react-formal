/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react';
import { describe, it, vi, expect, afterEach, beforeEach } from 'vitest';
import { fireEvent, render, act, waitFor } from '@testing-library/react';

import createSlot from 'react-tackle-box/Slot';
import * as yup from 'yup';
import { Form, toFormErrors, setter, getter } from '../src';
import { useFormActions } from '../src/Contexts';
import errorManager from '../src/errorManager';
import { FormHandle } from '../src/Form';

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

let LeakySubmit = () => {
  const actions = useFormActions();

  return (
    <button type="submit" onClick={actions!.onSubmit}>
      Submit
    </button>
  );
};

describe('Form', () => {
  let attachTo;
  let schema = yup.object({
    name: yup.object({
      first: yup.string().default(''),
      last: yup.string().default(''),
    }),
  });

  beforeEach(() => {
    attachTo = document.createElement('div');
    document.body.appendChild(attachTo);
  });

  afterEach(() => {
    document.body.removeChild(attachTo);
  });

  it('should expose setter', () => {
    expect(setter('foo', {}, 5)).toEqual({ foo: 5 });
  });

  it('should expose setter', () => {
    expect(getter('foo', { foo: 5 })).toBe(5);
  });

  it('should pass errors', () => {
    let { container } = render(
      <Form schema={schema} defaultErrors={{ fieldA: ['hi', 'good day'] }}>
        <div>
          <Form.Message for="fieldA" className="msg" />
          <Form.Message for="fieldB" className="msg" />
        </div>
      </Form>,
    );

    expect(container.querySelector('span.msg')?.textContent).toBe(
      'hi, good day',
    );
  });

  it('should update the form value', function () {
    let value, last;
    let change = vi.fn((v) => (value = v));

    let { container } = render(
      <Form
        schema={schema}
        defaultValue={schema.getDefault()}
        onChange={change}
      >
        <Form.Field name="name.first" className="field" />
        <Form.Field name="name.last" className="field" />
      </Form>,
    );

    fireEvent.change(container.querySelector('[name="name.first"]')!, {
      target: { value: 'Jill' },
    });

    expect(change).toHaveBeenCalledTimes(1);

    expect(value).toEqual({
      name: {
        first: 'Jill',
        last: '',
      },
    });

    last = value;

    fireEvent.change(container.querySelector('[name="name.last"]')!, {
      target: { value: 'Smith' },
    });

    expect(value).toEqual({
      name: {
        first: 'Jill',
        last: 'Smith',
      },
    });

    expect(value).not.toBe(last);
  });

  it('should pass updated paths', function () {
    let paths;
    let change = vi.fn((_, p) => (paths = p));

    let { container } = render(
      <Form
        schema={schema}
        defaultValue={schema.getDefault()}
        onChange={change}
      >
        <Form.Field
          name="name.first"
          className="field"
          mapFromValue={{
            'name.first': (v: any) => v.first,
            'name.last': (v: any) => v.last,
          }}
        />
      </Form>,
    );

    let value = { first: 'Jill', last: 'smith' };

    fireEvent.change(container.querySelector('[name="name.first"]')!, {
      target: { value },
    });

    expect(paths).toEqual(['name.first', 'name.last']);
  });

  it('should let native submits simulate onSubmit', async () => {
    let spy = vi.fn();

    let { getByRole } = render(
      <Form onSubmit={spy} schema={schema} defaultValue={{}}>
        <Form.Field name="name" type="text" className="test" />
        <button type="submit">Submit</button>
      </Form>,
    );

    act(() => {
      fireEvent.submit(getByRole('button'));
    });

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('should deduplicate form submissions', async () => {
    let spy = vi.fn();
    let { getByRole } = render(
      <Form onSubmit={spy} schema={schema} defaultValue={{}}>
        <Form.Field name="name" type="text" className="test" />
        <Form.Submit type="submit" />
      </Form>,
      { container: attachTo },
    );

    act(() => {
      getByRole('button').click();
    });

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it("doesn't call submitForm on error", async () => {
    let onInvalidSubmit = vi.fn();
    let submitForm = vi.fn(() => Promise.resolve());

    let { getByRole } = render(
      <Form
        submitForm={submitForm}
        onInvalidSubmit={onInvalidSubmit}
        schema={schema.shape({
          foo: yup.string().required(),
        })}
        defaultValue={{}}
      >
        <Form.Field name="name" type="text" className="test" />
        <Form.Submit type="submit" />
      </Form>,
    );

    act(() => {
      getByRole('button').click();
    });

    await waitFor(() => expect(onInvalidSubmit).toHaveBeenCalledTimes(1));

    expect(onInvalidSubmit).toHaveBeenCalledTimes(1);
    expect(submitForm).not.toHaveBeenCalled();
  });

  it('calls submitForm on success', async () => {
    let onSubmit = vi.fn();
    let submitForm = vi.fn(() => Promise.resolve());

    let { getByRole } = render(
      <Form
        onSubmit={onSubmit}
        submitForm={submitForm}
        schema={schema}
        defaultValue={{}}
      >
        <Form.Field name="name" type="text" className="test" />
        <Form.Submit type="submit" />
      </Form>,
    );

    act(() => {
      getByRole('button').click();
    });

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledTimes(1);
    // expect(submitForm).toHaveBeenCalledAfter(onSubmit);
  });

  it('submits through a Slot', async () => {
    let onSubmit = vi.fn();
    let submitForm = vi.fn(() => Promise.resolve());

    let Slot = createSlot();

    let { getByRole } = render(
      <div>
        <Form
          onSubmit={onSubmit}
          submitForm={submitForm}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name="name" type="text" className="test" />
          <Slot.Entry waitForOutlet>
            <Form.Submit type="submit" />
          </Slot.Entry>
        </Form>

        <Slot.Outlet />
      </div>,
    );

    act(() => {
      getByRole('button').click();
    });

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledTimes(1);
  });

  it('does not submit while already submitting', async () => {
    let ref = React.createRef<FormHandle>();
    let onSubmit = vi.fn();
    let submitForm = vi.fn(() => new Promise((r) => setTimeout(r, 5)));

    let { getByRole } = render(
      <div>
        <Form
          ref={ref}
          onSubmit={onSubmit}
          submitForm={submitForm}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name="name" type="text" className="test" />
          <Form.Submit type="submit" />
        </Form>
      </div>,
    );

    await act(async () => {
      getByRole('button').click();
      getByRole('button').click();

      await ref.current!.submit();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledTimes(1);
  });

  it('should only report ValidationErrors', () => {
    let ref = React.createRef<FormHandle>();

    let spy = vi.fn();

    render(
      <div>
        <Form
          ref={ref}
          onSubmit={() => {
            throw 'foo!';
          }}
          onError={spy}
          schema={schema}
          defaultValue={{}}
        >
          <Form.Field name="name" type="text" className="test" />
          <LeakySubmit />
        </Form>
      </div>,
    );

    return act(async () => {
      await ref.current!.submit().catch((err) => {
        expect(err).toBe('foo!');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(undefined);
      });
    });
  });

  it('return hash of errors from a assertSingle error', () => {
    expect(toFormErrors(new yup.ValidationError('hello!', {}, 'path'))).toEqual(
      {
        path: [
          {
            message: 'hello!',
            values: undefined,
            type: undefined,
          },
        ],
      },
    );
  });

  it('return hash of errors from aggregate error', () => {
    expect(
      toFormErrors(
        // @ts-ignore
        new yup.ValidationError([
          new yup.ValidationError('foo', null, 'bar'),
          new yup.ValidationError('bar', null, 'foo'),
        ]),
      ),
    ).toEqual({
      foo: [{ message: 'bar', values: undefined, type: undefined }],
      bar: [{ message: 'foo', values: undefined, type: undefined }],
    });
  });

  describe('Field validation', () => {
    let schema;

    beforeEach(() => {
      schema = yup.object({
        name: yup.object({
          meta: yup.object(),
          first: yup.string(),
          last: yup.string(),
        }),
      });
    });

    it('remove errors for branches', async () => {
      const spy = vi.fn((errors) => {
        expect(errors).not.toHaveProperty('name.first');
      });

      let { container } = render(
        <Form
          delay={0}
          onError={spy}
          schema={schema}
          errors={{ 'name.first': ['invalid'] }}
          defaultValue={{}}
        >
          <Form.Field name="name" />
          <Form.Field name="name.first" />
        </Form>,
      );
      await act(() => {
        fireEvent.change(container.querySelector('[name="name"]')!, {
          target: { value: 'Smith' },
        });

        return wait(10);
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should deduplicate validation paths', () => {
      const paths = [] as string[];

      return errorManager((spec) => {
        paths.push(spec.path);
      })
        .collect(['name', 'name.meta', 'name.first'])
        .then(() => {
          expect(paths).toEqual(['name']);
        });
    });

    it('should remove paths', () => {
      let errors = {
        'name': ['invalid'],
        'name.meta': ['invalid'],
        'name.first': ['invalid'],
        'id': ['invalid'],
      };

      return errorManager(() => {})
        .collect(['name'], errors)
        .then((errors) => {
          expect(errors).toEqual({
            id: ['invalid'],
          });
        });
    });

    it('should return same object when unchanged', () => {
      const errors = {
        'name': ['invalid'],
        'name.meta': ['invalid'],
        'name.first': ['invalid'],
        'id': ['invalid'],
      };

      return errorManager(() => {})
        .collect(['foo'], errors)
        .then((newErrors) => {
          expect(errors).toBe(newErrors);
        });
    });

    it('should clear errors on submit', async () => {
      const spy = vi.fn();

      const { getByRole } = render(
        <Form
          submitForm={() => {}}
          schema={yup.object({
            name: yup.string(),
          })}
          defaultValue={{}}
          errors={{ name: ['invalid'] }}
          onError={spy}
        >
          <Form.Field name="name" type="text" />
          <Form.Submit type="submit" />
        </Form>,
      );

      await act(() => {
        getByRole('button').click();
        return wait(10);
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(undefined);
    });
  });
});
