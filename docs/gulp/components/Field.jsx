var React = require('react')
  , Playground = require('component-playground');

module.exports = class  extends React.Component {
  render(){
    return (
      <div>
<h2 id="field">Field</h2>
<p>The Field Component renders a form control and handles input value updates and validations. 
Changes to the Field value are automatically propagated back up to the containing Form 
Component.</p>
<h3 id="props">Props</h3>
<h4 id="-name-__-required-__"><code>{`name`}</code> <strong>(required)</strong></h4>
<p>The Field name, which should be path corresponding to a specific form <code>{`value`}</code> path.</p>
<pre><code>{`// given the form value 
value = {
  name: { first: '' }
  languages: ['english', 'spanish']
}

// the path "name.first" would update the &quot;first&quot; property of the form value
<Form.Field name='name.first' />

// use indexes for paths that cross arrays
<Form.Field name='languages[0]' />`}
</code></pre>
<p>type: <code>{`string`}</code>  </p>
<h4 id="-group-"><code>{`group`}</code></h4>
<p>Group Fields together with a common <code>{`group`}</code> name. Groups can be 
validated together, helpful for multi-part forms.</p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`<Form schema={modelSchema} defaultValue={modelSchema.default()}>

  <Form.Field name='name.first' group='name' 
    placeholder='first'/>

  <Form.Field name='name.last' group='name' 
    placeholder='surname'/>

  <Form.Message for={['name.first', 'name.last']}/>

  <Form.Field name='dateOfBirth' placeholder='dob'/>

  <Form.Button group='name'>
    Validate Name
  </Form.Button> 
</Form>`} noRender/>

<p>type: <code>{`string`}</code>  </p>
<h4 id="-type-"><code>{`type`}</code></h4>
<p>The Component Input the form should render. You can sepcify a builtin type 
with a string name e.g <code>{`'text'`}</code>, <code>{`'datetime-local'`}</code>, etc. or provide a Component
type class directly. When no type is provided the Field will attempt determine 
the correct input from the corresponding scheme. A Field corresponding to a <code>{`yup.number()`}</code> 
will render a <code>{`type='number'`}</code> input by default.</p>
<pre><code>{`<Form.Field type='number' />

<Form.Field type={MyInputComponent}/>`}
</code></pre>
<p>Custom Inputs should comply with the basic input api contract: set a value via a <code>{`value`}</code> prop and 
broadcast changes to that value via an <code>{`onChange`}</code> handler.</p>
<p>You can also permenantly map Components to a string <code>{`type`}</code> name via the top-level 
<code>{`addInputType()`}</code> api.</p>
<p>type: <code>{`func, string`}</code>  <em>default</em>: <code>{`''`}</code></p>
<h4 id="-events-"><code>{`events`}</code></h4>
<p>An array of event names that the Field should trigger a validation.</p>
<p>type: <code>{`array<string>`}</code>  <em>default</em>: <code>{`['onChange', 'onBlur']`}</code></p>
<h4 id="-mapvalue-"><code>{`mapValue`}</code></h4>
<p>Customize how the Field value maps to the overall Form <code>{`value`}</code>. 
<code>{`mapValue`}</code> can be a function that returns a value for <code>{`name`}</code>&#39;d path, allowing 
you to set commuted values from the Field.</p>
<pre><code>{`<Form.Field name='name'
  mapValue={ fieldValue => fieldValue.first + ' ' + fieldValue.last }
/>`}
</code></pre>
<p>You can also provide an object hash, mapping paths of the Form <code>{`value`}</code> 
to fields in the field value using a string field name, or a function accessor.</p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`<Form 
  schema={modelSchema}
  defaultValue={modelSchema.default()}
>
  <label>Name</label>
  <Form.Field name='name.first' placeholder='First name'/>

  <label>Date of Birth</label>
  <Form.Field name='dateOfBirth' 
    mapValue={{
      'dateOfBirth': date => date,
      'age': date => 
      (new Date()).getFullYear() - date.getFullYear()
  }}/>

  <label>Age</label>
  <Form.Field name='age'/>

  <Form.Button type='submit'>Submit</Form.Button>
</Form>`} noRender/>

<p>type: <code>{`func, object`}</code>  </p>
<h4 id="-errorclass-"><code>{`errorClass`}</code></h4>
<p>The css class added to the Field Input when it fails validation</p>
<p>type: <code>{`string`}</code>  <em>default</em>: <code>{`'invalid-field'`}</code></p>
<h4 id="-alsovalidates-"><code>{`alsoValidates`}</code></h4>
<p>Tells the Field to trigger validation for addition paths as well as its own (<code>{`name`}</code>). 
Useful when used in conjuction with a <code>{`mapValue`}</code> hash that updates more than one value.</p>
<pre><code>{`<Form.Field name='name'
  mapValue={{
    'name.first': 'first',
    'name.last':  'surname'
  }}
  alsoValidates={['name.first', 'name.last']}
/>`}
</code></pre>
<p>type: <code>{`array<string>`}</code>  </p>
<h4 id="-novalidate-"><code>{`noValidate`}</code></h4>
<p>Disables validation for the Field.</p>
<p>type: <code>{`bool`}</code>  </p>

      </div>
    )
  }
}
