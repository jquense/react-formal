import { View } from 'react-native'; // eslint-disable-line import/no-unresolved

import setDefaults from './setDefaults';
import Field from '../Field';

export default setDefaults(Field, {
  component: View,
  errorClass: undefined
});
