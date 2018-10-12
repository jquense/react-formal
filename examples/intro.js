const Form = require('react-formal')
const { object, string, number, date } = require('yup')

// if we are using a different set of inputs
// we can set some defaults once at the beginning
Form.addInputTypes(require('react-formal-inputs'))

const modelSchema = object({
  name: object({
    first: string().required('please enter a first name'),
    last: string().required('please enter a surname'),
  }),

  dateOfBirth: date().max(new Date(), "You can't be born in the future!"),

  colorId: number()
    .nullable()
    .required('Please select a color'),
})

render(
  <Form schema={modelSchema} defaultValue={modelSchema.default()}>
    <div>
      <label>Name</label>

      <Form.Field name="name.first" placeholder="First name" />
      <Form.Field name="name.last" placeholder="Surname" />

      <Form.Message for={['name.first', 'name.last']} />
    </div>

    <label>Date of Birth</label>
    <Form.Field name="dateOfBirth" />
    <Form.Message for="dateOfBirth" />

    <label>Favorite Color</label>
    <Form.Field name="colorId" type="select">
      <option value={null}>Select a color...</option>
      <option value={0}>Red</option>
      <option value={1}>Yellow</option>
      <option value={2}>Blue</option>
      <option value={3}>other</option>
    </Form.Field>
    <Form.Message for="colorId" />

    <Form.Submit type="submit">Submit</Form.Submit>
  </Form>
)
