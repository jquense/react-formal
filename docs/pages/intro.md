
<div className='row text-center headlines'>
  <div className='col-sm-4'>
    <h2>Strongly Typed</h2>
    <p>
      Schema based forms to handle all the frustrating parsing and serializing of strings to objects automatically.
    </p> 
  </div>
  <div className='col-sm-4'>
    <h2>Minimal Wiring</h2>
    <p>
      Requires about as much boilerplate as a single input. 
      No managing tons of values and onChange handlers.
    </p> 
  </div>
  <div className='col-sm-4'>
    <h2>Extreme Flexibility</h2>
    <p>
      You have complete control how each field renders. Use any components you want!
    </p> 
  </div>
</div>

React Formal is a library for quickly and painlessly handling HTML form validation and serialization. It tries to strike a balance between prescriptive form generators and libraries that require you to manually handle ever input and manage them in state. React formal, lets you build your form however you want with no restrictions on form markup, or uncessary boilerplate.

React formal leverages a schema validation system, through `yup` a joi like schema DSL, which offers helpful benefits over the traditional "validate the state DOM" approach.

 - Forms can be handled the "React Way", with controlled or uncontrolled values, completely decoupled from DOM state.
 - Validating and updating javascripts objects instead of an HTML representation of an object, means no need for `<input type='hidden'/>`; only render inputs that a user actually needs to change!
 - Schema based validation, lets you reuse your parsing and model validation logic outside of forms, in your server API utilities, or Flux stores.

### Getting Started

```sh
  npm install --save react-formal yup
```
If you want to use the default inputs or just define your own thats it. If you'd like some additional inputs, like date pickers, multiselects and comboboxes (used here) you might want to also install.

```sh
  npm install --save react-formal-inputs
```

Lets first define the object schema that our form will provide input too. The `yup` api and style is heavily inspired by Joi, an excellent library but is too large and difficult to use in a browser. Yup is a leaner and mostly as expressive, without the server specific bulk. Check out the our quick start guide to yup [here](/api/yup) for just basics, or the [yup documentation site](https://github.com/jquense/yup/blob/master/README.md) for a full run down of the features.

```console
var nameSchema = yup.string()
  .default('')
  .required('You must provide a name');

var formSchema = yup.object({
  name: yup.object({
    first: nameSchema,
    last:  nameSchema
  }),

  dateOfBirth: yup.date()
    .max(new Date(), "You can't be born in the future!"),

  age: yup.number()
    .required('Please enter an age')
    .positive('Ages must be a positive number')
})

//now we define our Form
var form = (
  <Form 
    schema={modelSchema}
    defaultValue={modelSchema.default()}
  >
    <fieldset>
      <legend>Name</legend>

      <Form.Field name='name.first' placeholder='First name'/>
      <Form.Message for='name.first'/>

      <Form.Field name='name.last' placeholder='Surname'/>
      <Form.Message for='name.last'/>
    </fieldset>

    <label>Date of Birth</label>
    <Form.Field name='dateOfBirth'/>
    <Form.Message for='dateOfBirth'/>

    <label>Age</label>
    <Form.Field name='age'/>
    <Form.Message for='age'/>

    <Form.Button type='submit'>Submit</Form.Button>
  </Form>
)

 React.render(form, mountNode);
```

Once we have a Schema we are ready to build our Form.
