import React from 'react';
import { Text, View } from 'react-native'; // eslint-disable-line import/no-unresolved

import setDefaults from './setDefaults';
import ValidationSummary from '../ValidationSummary';

ValidationSummary.defaultProps.formatMessage =
  (message, idx) => <Text key={idx}>{message}</Text>

export default setDefaults(ValidationSummary, {
  component: View,
  formatMessage: (message, idx) => <Text key={idx}>{message}</Text>
});
