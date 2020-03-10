import * as yup from 'yup';

let nameSchema = yup
  .string()
  .default('')
  .required('You must provide a name');

export default yup.object({
  name: yup.object({
    first: nameSchema,
    last: nameSchema,
  }),
  dateOfBirth: yup
    .date()
    .required('Please enter a date of birth')
    .max(new Date(), "You can't be born in the future!"),

  colorIds: yup.array(yup.number()),

  age: yup
    .number()
    .nullable()
    .required('Please enter an age')
    .positive('Ages must be a positive number'),
});
