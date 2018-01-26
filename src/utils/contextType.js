import PropTypes from 'prop-types';

export default {
  reactFormalContext: PropTypes.shape({
    noValidate: PropTypes.bool,
    schema: PropTypes.func,
    onFieldError: PropTypes.func,
    onSubmit: PropTypes.func,
    onOptions: PropTypes.func
  })
}
