import { SyntheticEvent } from 'react';
import { Schema } from 'yup';
import { BindingContext } from 'topeka';

const isEvent = (e): e is SyntheticEvent =>
  typeof e == 'object' && e != null && 'target' in e;

type Setter = (path: string, formData: unknown, fieldValue: any) => unknown;

const defaultSetter = BindingContext.defaultProps.setter;

function setter(
  path: string,
  formData: any,
  fieldValue: any,
  getSchemaForPath,
) {
  if (!isEvent(fieldValue)) return defaultSetter(path, formData, fieldValue);

  const {
    type,
    value,
    checked,
    options,
    multiple,
    files,
  } = fieldValue.target as HTMLInputElement & HTMLSelectElement;

  if (type === 'file') return multiple ? files : files && files[0];
  if (multiple) {
    return Array.from(options)
      .filter(opt => opt.selected)
      .map(opt => opt.value);
  }

  if (/number|range/.test(type)) {
    let parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  if (type === 'checkbox') {
    const type = getTypeForCheckbox(eventOrValue as any, fieldValue);
    if (type === 'boolean') return checked;

    const nextValue = Array.isArray(fieldValue) ? [...fieldValue] : [];
    const idx = nextValue.indexOf(valueProp);
    isValueInArray = index >= 0;
  }

  return value;
}
