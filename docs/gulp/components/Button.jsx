var React = require('react')
  , Playground = require('component-playground');

module.exports = class  extends React.Component {
  render(){
    return (
      <div>
<h2 id="button">Button</h2>
<p>A Form Button, for triggering validations for specific Field groups</p>
<h3 id="props">Props</h3>
<h4 id="-type-"><code>{`type`}</code></h4>
<p>The <code>{`<button/>`}</code> type</p>
<p>type: <code>{`enum<'button', 'submit'>`}</code>  <em>default</em>: <code>{`'button'`}</code></p>
<h4 id="-group-"><code>{`group`}</code></h4>
<p>Specify a group to validate, if empty the entire form will be validated.
If the button type is &#39;submit&#39; the group will be ignored and the 
entire form will be validated prior to submission.</p>
<p>type: <code>{`string`}</code>  </p>

      </div>
    )
  }
}
