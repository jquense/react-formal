var React = require('react')
  , Link = require('react-router').Link
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

<p>React Formal is a library for quickly and painlessly handling HTML form validation and serialization. It tries to strike a balance between prescriptive form generators and libraries that require you to manually handle ever input and manage them in state. React Formal, lets you build your form however you want with no restrictions on form markup, or uncessary boilerplate. React Formal leverages a schema validation system, which offers helpful benefits over the traditional &quot;validate the state DOM&quot; approach.</p>
<ul>
<li>Forms can be handled the &quot;React Way&quot;, with controlled or uncontrolled values, completely decoupled from DOM state.</li>
<li>Working against javascript objects instead of HTML representations of an objects, means no need for <code>{`<input type='hidden'/>`}</code>; only render inputs that a user actually needs to change!</li>
<li>Schema based validation, lets you reuse your parsing and model validation logic outside of forms, in your server API utilities, or Flux stores.</li>
</ul>
<h3 id="getting-started">Getting Started</h3>
<p>Lets install both <code>{`react-formal`}</code> and <code>{`yup`}</code>.</p>
<pre><code className="sh">{`npm install react-formal yup --save`}
</code></pre>
<p>If you&#39;d like more robust input options like, date and number pickers, multiselect, and comboboxes (like in the documentation) you might want to also install <code>{`react-formal-inputs`}</code> which is swaps out the native input types for <a href="http://jquense.github.io/react-widgets/docs/#/">react-widgets</a>.</p>
<pre><code className="sh">{`npm install react-formal-inputs --save`}
</code></pre>
<p>Lets first define the object schema that our form will provide input too. The <code>{`yup`}</code> api and style is heavily inspired by Joi, an excellent library but is too large and difficult to use in a browser. Yup is a leaner and mostly as expressive, without the server specific bulk. Check out the <Link to="/api/yup" title="">quick start guide to <code>{`yup`}</code></Link> for schema basics, or the <a href="https://github.com/jquense/yup/blob/master/README.md">yup documentation site</a> for a full run down of the features.</p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`var Form = require('react-formal')
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

React.render(form, mountNode);`} />


      </div>
    )
  }
}
