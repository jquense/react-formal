import { ValidateOnConfig } from './useField';

interface Config {
  validateOn: ValidateOnConfig;
  errorClass: string;
}

const config: Config = {
  validateOn: { change: true, blur: true },
  errorClass: 'invalid-field',
};

export default config;
