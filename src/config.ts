import { ValidateOnConfig } from './useField';

interface Config {
  validateOn: ValidateOnConfig;
  errorClass: string;
}

// meta => {
//   return meta.valid ? ['onBlur'] : ['onChange', 'onBlur'];
// },

const config: Config = {
  validateOn: { change: true, blur: true },
  errorClass: 'invalid-field',
};

export default config;
