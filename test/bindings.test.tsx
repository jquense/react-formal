import useUpdateEffect from '@restart/hooks/useUpdateEffect';

import { mount } from 'enzyme';
import useFormBindingContext, {
  BindingContext as Context,
} from '../src/BindingContext';
import useBinding from '../src/useBinding';
/* eslint-disable react/prop-types */
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
  class StaticContainer extends React.Component {
    shouldComponentUpdate(props) {
      return !!props.shouldUpdate; // eslint-disable-line
    }
    render() {
      return this.props.children;
    }
  }

  const BoundInput = ({ name }) => {
    const [value = '', handleChange] = useBinding(name);
    return <input type="text" value={value} onChange={handleChange} />;
  };

  it('should update the form value: hook', function () {
    let change = jest.fn();

    let inst = mount(
      <BindingContext onChange={change}>
        <BoundInput name="name" />
      </BindingContext>,
    );

    inst
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill' } });

    expect(change).toHaveBeenCalledTimes(1);

    expect(change).toHaveBeenCalledWith({ name: 'Jill' }, ['name']);
  });

  it('should accept primitive values', function () {
    let change = jest.fn();

    const BoundInput = ({ name }) => {
      const [value = '', handleChange] = useBinding(name);
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
    };

    let inst = mount(
      <BindingContext onChange={change}>
        <BoundInput name="name" />
      </BindingContext>,
    );

    inst
      .find('input')
      .first()
      .simulate('change', { target: { value: 'Jill' } });

    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith({ name: 'Jill' }, ['name']);
  });

  it('should always update if binding value changed', function () {
    let change = jest.fn();
    let value = { name: 'sally', eyes: 'hazel' };
    let count = 0;

    const CountRenders = ({ name }) => {
      const [value = '', handleChange] = useBinding(name);
      // @ts-ignore
      useUpdateEffect(() => {
        count++;
      });
      return <input type="text" value={value} onChange={handleChange} />;
    };

    let wrapper = mount(
      <BindingContext onChange={change} value={value}>
        {/* @ts-ignore */}
        <StaticContainer shouldUpdate={false}>
          <CountRenders name="name" />
        </StaticContainer>
      </BindingContext>,
    );

    expect(count).toBe(0);

    wrapper.setProps({ value: { ...value, eyes: 'brown' } });

    expect(count).toBe(1);

    wrapper.setProps({ value: { ...value, name: 'Sallie' } });

    expect(count).toBe(2);
  });

  it('should update if props change', function () {
    let count = 0;
    const CountRenders = ({ name }) => {
      const [value = '', handleChange] = useBinding(name);
      // @ts-ignore
      useUpdateEffect(() => {
        count++;
      });
      return <input type="text" value={value} onChange={handleChange} />;
    };

    let wrapper = mount(<CountRenders name="name" />);

    expect(count).toBe(0);

    wrapper.setProps({ name: 'fooo' });

    expect(count).toBe(1);
  });

  it('should not prevent input updates', function () {
    let change = jest.fn();
    let value = { name: 'sally', eyes: 'hazel' };
    let count = 0;

    class Input extends React.Component<any> {
      componentDidUpdate() {
        count++;
      }
      render = () => <input type="text" {...this.props} />;
    }

    class Parent extends React.Component {
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

    let wrapper = mount(<Parent />);

    expect(count).toBe(0);

    wrapper.setProps({ foo: 'bar' });

    expect(count).toBe(1);
  });

  it('should batch', function () {
    let ref = { current: null };

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
            setValue([v, paths]);
          }}
        >
          <Input />
        </BindingContext>
      );
    }

    let inst = mount(<Wrapper />);

    inst.find('input').first().simulate('change');

    expect(ref.current).toEqual([
      {
        a: '1',
        b: '2',
      },
      ['a', 'b'],
    ]);
  });
});
