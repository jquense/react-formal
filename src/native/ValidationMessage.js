import { Text } from 'react-native'; // eslint-disable-line import/no-unresolved

import setDefaults from './setDefaults';
import ValidationMessage from '../ValidationMessage';

export default setDefaults(ValidationMessage, {
  component: Text,
  errorClass: undefined
});
