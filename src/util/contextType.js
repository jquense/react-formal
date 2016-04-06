import React from 'react';

export default {
  reactFormalContext: React.PropTypes.shape({
    noValidate: React.PropTypes.bool,
    schema: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onOptions: React.PropTypes.func
  }).isRequired
}
