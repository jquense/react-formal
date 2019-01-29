const defaultStr = yup.string().default('')

const customerSchema = yup.object({
  name: yup.object({
    first: defaultStr.required('please enter a first name'),

    last: defaultStr.required('please enter a surname'),
  }),

  dateOfBirth: yup.date().max(new Date(), 'Are you a time traveler?!'),

  colorId: yup
    .number()
    .nullable()
    .required('Please select a dank color'),
})

render(
  <Form schema={customerSchema} defaultValue={customerSchema.default()}>
    <div>
      grandchildren are no problem
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
