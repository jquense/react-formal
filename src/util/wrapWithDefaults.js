import React from 'react';

export default function wrapWithDefualts(Component, defaults) {
  return class extends React.Component {
    static displayName =
      `WithDefaults(${Component.name || Component.displayName || 'Component'})`;

    static propTypes = {
      type: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func,
      ]),
    };

    render() {
      return React.createElement(Component, {
        ...defaults,
        ...this.props,
        type: defaults.type || this.props.type
      })
    }
  }
}
