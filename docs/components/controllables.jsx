var React = require('react')
  , Link = require('react-router').Link
  , Playground = require('component-playground');

module.exports = class  extends React.Component {
  render(){
    return (
      <div>
<h1 id="controlled-and-uncontrolled-components">Controlled and Uncontrolled Components</h1>
<p>One of the strengths of React is its extensibility model, enabled by a common practice of pushing component state as high up the component hierarchy as possible. For simple components (like an input) this is usually a matter of tying the input <code>{`value`}</code> prop to a parent state property via its <code>{`onChange`}</code> handler. here is an extremely common pattern:</p>
<pre><code className="js">{`render: function() {
  return (
    <input type='text' 
      value={this.state.value} 
      onChange={ e => this.setState({ value: e.target.value })}/>
  )
}`}
</code></pre>
<p>This pattern moves the responsibility of managing the <code>{`value`}</code> prop from the input Component to its parent. This is called a <strong>controlled</strong> component because the parent is in complete <em>control</em> of setting the <code>{`value`}</code> prop, in fact the input couldn&#39;t change its value even if it wanted to, it will <em>always</em> render the <code>{`value`}</code> prop it is given.</p>
<p>Using controlled components is great for flexibility, and helps keep the data flow going in one direction, but it can become tedious to wire up the components every time, even if you don&#39;t need the benefits of controlling it. To mitigate this concern React introduces the concept of an <strong>uncontrolled</strong> Component.</p>
<pre><code className="js">{`render: function() {
  return (
    <input type='text' 
      defaultValue={'hello'} />
  )
}`}
</code></pre>
<p>This input, doesn&#39;t provide a <code>{`value`}</code> prop, instead it uses the <code>{`defaultValue`}</code> prop to set an <em>initial</em> value for the input. After that initial setting, the input takes over and manages the value itself requiring no more input from the parent. This is much simplier to set up but, is not conducive to setting the input value from <em>outside</em> the input. In this case however, that isn&#39;t needed so we can leave it uncontrolled.</p>
<p>We can extend this pattern to more than just <code>{`value`}</code> props, lots of things can be controlled or uncontrolled. in <code>{`react-formal`}</code> for instance the <code>{`Form`}</code> component lets you control the <code>{`errors`}</code> prop for setting the current errors in the form.</p>
<pre><code className="js">{`// controlled
<Form 
  errors={this.state.errors}
  onError={errors => this.setState({ errors })}
>
  {/* fields omitted */}
</Form>

// Uncontrolled
<Form>
  {/* fields omitted */}
</Form>

// and Uncontrolled with an initial setting
<Form defaultErrors={this.state.errors}>
  {/* fields omitted */}
</Form>`}
</code></pre>
<p>So when a prop is said to be &quot;controllable&quot; it means that you have the option to let the component handle it, or if you need finer grained control over how that prop updates you can jump in and handle it yourself.</p>

      </div>
    )
  }
}
