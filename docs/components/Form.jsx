var React = require('react')
  , Link = require('react-router').Link
  , Playground = require('component-playground');

module.exports = class  extends React.Component {
  render(){
    return (
      <div>
<h2 id="form">Form</h2>
<p>Form component renders a <code>{`value`}</code> to be updated and validated by child Fields. 
Forms can be thought of as <code>{`<input/>`}</code>s for complex values, or models. A Form aggregates 
a bunch of smaller inputs, each in charge of updating a small part of the overall model.
The Form will integrate and validate each change and fire a single unified <code>{`onChange`}</code> with the new <code>{`value`}</code>.</p>
<p>Validation messages can be displayed anywhere inside a Form with Message Components. </p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`var defaultStr = yup.string().default('')
  , modelSchema = yup.object({
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
    <div> {\/\*'grandchildren' are no problem \*\/}
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

<h3 id="props">Props</h3>
<h4 id="-value-"><code>{`value`}</code></h4>
<p>Form value object, can be left uncontrolled; 
use the <code>{`defaultValue`}</code> prop to initialize an uncontrolled form.</p>
<p>type: <code>{`object`}</code>  </p>
<h4 id="-onchange-"><code>{`onChange`}</code></h4>
<p>Callback that is called when the <code>{`value`}</code> prop changes.</p>
<p>type: <code>{`func`}</code>  </p>
<h4 id="-errors-"><code>{`errors`}</code></h4>
<p>An object hash of field errors for the form. The object should be keyed with paths
with the values being string messages or an array of messages. Errors can be left 
uncontrolled (use <code>{`defaultErrors`}</code> to set an initial value) or managed along with the <code>{`onError`}</code> callback</p>
<pre><code className="js">{`errors={{
 "name.first": [
   'First names are required', 
   "Names must be at least 2 characters long"
 ],
}}`}
</code></pre>
<p>type: <code>{`object`}</code>  </p>
<h4 id="-onerror-"><code>{`onError`}</code></h4>
<p>Callback that is called when a validation error occures. It is called with an <code>{`errors`}</code> object</p>
<pre><code className="js">{`function onError(errors){
  errors['name.first'] 
  // => 'required field', "Names must be at least 2 characters long"]
}`}
</code></pre>
<p>type: <code>{`func`}</code>  </p>
<h4 id="-onvalidate-"><code>{`onValidate`}</code></h4>
<p>Callback that is called whenever a validation is triggered. 
It is called <em>before</em> the validation is actually run.</p>
<pre><code className="js">{`function onError(e){
  { event, field, args, target } = e
}`}
</code></pre>
<p>type: <code>{`func`}</code>  </p>
<h4 id="-onsubmit-"><code>{`onSubmit`}</code></h4>
<p>Callback that is fired when the native onSubmit event is triggered. Only relevant when 
the <code>{`component`}</code> prop renders a <code>{`<form/>`}</code> tag. onSubmit will trigger only if the form is valid.</p>
<pre><code className="js">{`function onSubmit(e){
  // do something with valid value
}`}
</code></pre>
<p>type: <code>{`func`}</code>  </p>
<h4 id="-getter-"><code>{`getter`}</code></h4>
<p>A value getter function. <code>{`getter`}</code> is called with <code>{`path`}</code> and <code>{`value`}</code> and 
should return the plain <strong>javascript</strong> value at the path.</p>
<pre><code className="js">{`function(
 path: string,
 value: any,
) -> object`}
</code></pre>
<p>type: <code>{`func`}</code>  <em>default</em>: <code>{`(path, model) => expr.getter(path, true)(model || {})`}</code></p>
<h4 id="-setter-__-required-__"><code>{`setter`}</code> <strong>(required)</strong></h4>
<p>A value setter function. <code>{`setter`}</code> is called with <code>{`path`}</code>, the form <code>{`value`}</code> and the path <code>{`value`}</code>. 
The <code>{`setter`}</code> must return updated form <code>{`value`}</code>, which allows you to leave the original value unmutated.</p>
<p>The default implementation uses the <a href="http://facebook.github.io/react/docs/update.html">react immutability helpers</a>, 
letting you treat the form <code>{`value`}</code> as immutable.</p>
<pre><code className="js">{`function(
 path: string,
 formValue: object,
 pathValue: any
) -> object`}
</code></pre>
<p>type: <code>{`func`}</code>  <em>default</em>: <code>{`(path, model, val) => updateIn(model, toUpdateSpec(path, val))`}</code></p>
<h4 id="-delay-"><code>{`delay`}</code></h4>
<p>Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
made at the expense of a slight delay. Helpful for performance.</p>
<p>type: <code>{`number`}</code>  <em>default</em>: <code>{`300`}</code></p>
<h4 id="-strict-"><code>{`strict`}</code></h4>
<p>Validations will be strict, making no attempt to coarce input values to the appropriate type.</p>
<p>type: <code>{`bool`}</code>  <em>default</em>: <code>{`true`}</code></p>
<h4 id="-novalidate-"><code>{`noValidate`}</code></h4>
<p>Turns off input validation for the Form, value updates will continue to work.</p>
<p>type: <code>{`enum<true, 'heelo', 5>`}</code>  </p>
<h4 id="-component-__-required-__"><code>{`component`}</code> <strong>(required)</strong></h4>
<p>A tag name or Component class the Form should render as</p>
<p>type: <code>{`func, string`}</code>  <em>default</em>: <code>{`'form'`}</code></p>
<h4 id="-schema-"><code>{`schema`}</code></h4>
<p>A Yup schema  that validates the Form <code>{`value`}</code> prop. Used to validate the form input values 
For more information about the yup api check out: <a href="https://github.com/jquense/yup/blob/master/README.md">https://github.com/jquense/yup/blob/master/README.md</a></p>
<p>type: <code>{`YupSchema`}</code>  </p>

      </div>
    )
  }
}
