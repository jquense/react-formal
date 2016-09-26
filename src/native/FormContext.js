import { View } from 'react-native'; // eslint-disable-line import/no-unresolved

import setDefaults from './setDefaults';
import FormContext from '../FormContext';

export default setDefaults(FormContext, {
  component: View
});
