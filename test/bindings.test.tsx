/* eslint-disable @typescript-eslint/no-use-before-define */
import useUpdateEffect from '@restart/hooks/useUpdateEffect';
import { describe, it, vi, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import useFormBindingContext, {
  BindingContext as Context,
} from '../src/BindingContext';
import useBinding from '../src/useBinding';

import React, { useState, useMemo } from 'react';

function BindingContext({ value, onChange, children }: any) {
  return (
    <Context.Provider
      value={useFormBindingContext({
        formValue: value,
        onChange,
        getSchemaForPath: () => null,
      })}
    >
      {children}
    </Context.Provider>
  );
}

function Binding({ bindTo, mapValue, children }: any) {
  const [value, handleEvent] = useBinding(bindTo, mapValue);

  const element = useMemo(
    () => children(value, handleEvent),
    [value, handleEvent, children],
  );

  return element;
}

describe('Bindings', () => {
  class StaticContainer extends React.Component<any> {
    shouldComponentUpdate(props) {
      return !!props.shouldUpdate;
    }
    render() {
      return this.props.children;
    }
  }

  const BoundInput = ({ name }) => {
    const [value = '', handleChange] = useBinding<string>(name);
    return <input type="text" value={value} onChange={handleChange} />;
  };

  it('should update the form value: hook', function () {
    let change = vi.fn();

    let { getByRole } = render(
      <BindingContext onChange={change}>
        <BoundInput name="name" />
      </BindingContext>,
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'Jill' } });

    expect(change).toHaveBeenCalledTimes(1);

    expect(change).toHaveBeenCalledWith({ name: 'Jill' }, ['name']);
  });

  it('should accept primitive values', function () {
    let change = vi.fn();

    const BoundInput = ({ name }) => {
      const [value = '', handleChange] = useBinding<string>(name);
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
    };

    let { getByRole } = render(
      <BindingContext onChange={change}>
        <BoundInput name="name" />
      </BindingContext>,
    );

    fireEvent.change(getByRole('textbox'), { target: { value: 'Jill' } });

    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith({ name: 'Jill' }, ['name']);
  });

  it('should always update if binding value changed', function () {
    let change = vi.fn();
    let value = { name: 'sally', eyes: 'hazel' };
    let count = 0;

    const CountRenders = ({ name }) => {
      const [value = '', handleChange] = useBinding<string>(name);
      // @ts-ignore
      useUpdateEffect(() => {
        count++;
      });
      return <input type="text" value={value} onChange={handleChange} />;
    };

    let { rerender } = render(renderWithValue(value));

    expect(count).toBe(0);

    rerender(renderWithValue({ ...value, eyes: 'brown' }));

    expect(count).toBe(1);

    rerender(renderWithValue({ ...value, name: 'Sallie' }));

    expect(count).toBe(2);

    function renderWithValue(value) {
      return (
        <BindingContext onChange={change} value={value}>
          {/* @ts-ignore */}
          <StaticContainer shouldUpdate={false}>
            <CountRenders name="name" />
          </StaticContainer>
        </BindingContext>
      );
    }
  });

  it('should update if props change', function () {
    let count = 0;
    const CountRenders = ({ name }) => {
      const [value = '', handleChange] = useBinding<string>(name);
      // @ts-ignore
      useUpdateEffect(() => {
        count++;
      });
      return <input type="text" value={value} onChange={handleChange} />;
    };

    let { rerender } = render(<CountRenders name="name" />);

    expect(count).toBe(0);

    rerender(<CountRenders name="fooo" />);

    expect(count).toBe(1);
  });

  it('should not prevent input updates', function () {
    let change = vi.fn();
    let value = { name: 'sally', eyes: 'hazel' };
    let count = 0;

    class Input extends React.Component<any> {
      componentDidUpdate() {
        count++;
      }
      render = () => <input type="text" {...this.props} />;
    }

    class Parent extends React.Component<any> {
      render() {
        return (
          <BindingContext onChange={change} value={value}>
            <Binding bindTo="name">
              {(value, onChange) => (
                <Input value={value} onChange={onChange} {...this.props} />
              )}
            </Binding>
          </BindingContext>
        );
      }
    }

    let { rerender } = render(<Parent />);

    expect(count).toBe(0);

    rerender(<Parent foo="bar" />);

    expect(count).toBe(1);
  });

  it('should batch', async () => {
    let ref = { current: null };
    let count = 0;
    const Input = () => {
      const [, changeA] = useBinding('a');
      const [, changeB] = useBinding('b');

      return (
        <input
          type="text"
          onChange={() => {
            changeA('1');
            changeB('2');
          }}
        />
      );
    };

    function Wrapper() {
      const [value, setValue] = useState<any>([{ a: 'nope', b: 'nope' }, null]);
      ref.current = value;
      return (
        <BindingContext
          value={value[0]}
          onChange={(v, paths) => {
            ++count;
            setValue([v, paths]);
          }}
        >
          <Input />
        </BindingContext>
      );
    }

    let { getByRole } = render(<Wrapper />);

    fireEvent.change(getByRole('textbox'), { target: { value: 'something' } });

    expect(count).toBe(1);
    expect(ref.current).toEqual([
      {
        a: '1',
        b: '2',
      },
      ['a', 'b'],
    ]);
  });
});
