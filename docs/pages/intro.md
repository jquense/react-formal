
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

React Formal is a library for quickly and painlessly handling HTML form validation and serialization. It tries to strike a balance between prescriptive form generators and libraries that require you to manually handle ever input and manage them in state. React Formal, lets you build your form however you want with no restrictions on form markup, or unnecessary boilerplate. React Formal leverages a schema validation system, which offers helpful benefits over the traditional "validate the state DOM" approach.

 - Forms can be handled the "React Way", with controlled or uncontrolled values, completely decoupled from DOM state.
 - Working against javascript objects instead of HTML representations of an objects, means no need for `<input type='hidden'/>`; only render inputs that a user actually needs to change!
 - Schema based validation, lets you reuse your parsing and model validation logic outside of forms, in your server API utilities, or Flux stores.

### Getting Started

Lets install both `react-formal` and `yup`.

```sh
npm install react-formal yup --save
```

If you'd like more robust input options like, date and number pickers, multiselect, and comboboxes (like in the documentation) you might want to also install `react-formal-inputs` which is swaps out the native input types for [react-widgets](http://jquense.github.io/react-widgets/docs/#/) (read the docs for complete installation instructions).

```sh
npm install react-formal-inputs --save
```

Lets first define the object schema that our form will provide input too. The `yup` api and style is heavily inspired by Joi, an excellent library but is too large and difficult to use in a browser. Yup is a leaner and mostly as expressive, without the server specific bulk. Check out the [quick start guide to `yup`](/api/yup) for schema basics, or the [yup documentation site](https://github.com/jquense/yup/blob/master/README.md) for a full run down of the features.

```editable
var Form = require('react-formal')
  , yup = require('yup')

// if we are using a different set of inputs
// we can set some defaults once at the beginning
Form.addInputTypes(
  require('react-formal-inputs'))

var defaultStr = yup.string().default('')

var modelSchema = yup.object({

    name: yup.object({
      first: defaultStr.required('please enter a first name'),
      last:  defaultStr.required('please enter a surname'),
    }),

    dateOfBirth: yup.date()
      .max(new Date(), "You can't be born in the future!"),

    colorId: yup.number().nullable()
      .required('Please select a color')
  });

var form = (
  <Form
    schema={modelSchema}
    defaultValue={modelSchema.default()}
  >
    <div>
      <label>Name</label>

      <Form.Field name='name.first' placeholder='First name'/>
      <Form.Field name='name.last' placeholder='Surname'/>

      <Form.Message for={['name.first', 'name.last']}/>
    </div>

    <label>Date of Birth</label>
    <Form.Field name='dateOfBirth'/>
    <Form.Message for='dateOfBirth'/>

    <label>Favorite Color</label>
    <Form.Field name='colorId' type='select'>
      <option value={null}>Select a color...</option>
      <option value={0}>Red</option>
      <option value={1}>Yellow</option>
      <option value={2}>Blue</option>
      <option value={3}>other</option>
    </Form.Field>
    <Form.Message for='colorId'/>

  <Form.Button type='submit'>Submit</Form.Button>
</Form>)

React.render(form, mountNode);
```
