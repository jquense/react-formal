var React = require('react')
  , Playground = require('component-playground');

module.exports = class  extends React.Component {
  render(){
    return (
      <div>
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

<p>React Formal is a library for quickly and painlessly handling HTML form validation and serialization. It tries to strike a balance between prescriptive form generators and libraries that require you to manually handle ever input and manage them in state. React formal, lets you build your form however you want with no restrictions on form markup, or uncessary boilerplate.</p>
<p>React formal leverages a schema validation system, through <code>{`yup`}</code> a joi like schema DSL, which offers helpful benefits over the traditional &quot;validate the state DOM&quot; approach.</p>
<ul>
<li>Forms can be handled the &quot;React Way&quot;, with controlled or uncontrolled values, completely decoupled from DOM state.</li>
<li>Validating and updating javascripts objects instead of an HTML representation of an object, means no need for <code>{`<input type='hidden'/>`}</code>; only render inputs that a user actually needs to change!</li>
<li>Schema based validation, lets you reuse your parsing and model validation logic outside of forms, in your server API utilities, or Flux stores.</li>
</ul>
<h3 id="getting-started">Getting Started</h3>
<p>Lets first define the object schema that our form will provide input too. The <code>{`yup`}</code> api and style is heavily inspired by Joi, an excellent library but is too large and difficult to use in a browser. Yup is a leaner and mostly and about as expressive, without the server specific bulk. Check out the our quick start guide to yup <a href="/api/yup">here</a> for just the basics, or the <a href="https://github.com/jquense/yup/blob/master/README.md">yup documentation site</a> for a full run down of the features.</p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`var nameSchema = yup.string()
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

 React.render(form, mountNode);`} es6Console />

<p>Once we have a Schema we are ready to build our Form.</p>

      </div>
    )
  }
}
