import { FieldEvents } from './useField';

interface Config {
  events: FieldEvents;
  errorClass: string;
}

// meta => {
//   return meta.valid ? ['onBlur'] : ['onChange', 'onBlur'];
// },

const config: Config = {
  events: ['onChange', 'onBlur'],
  errorClass: 'invalid-field',
};

export default config;
