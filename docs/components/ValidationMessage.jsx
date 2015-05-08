var React = require('react')
  , Link = require('react-router').Link
  , Playground = require('component-playground');

module.exports = class  extends React.Component {
  render(){
    return (
      <div>
<h2 id="message">Message</h2>
<p>Represents a Form validation error message. Only renders when the 
value that it is <code>{`for`}</code> is invalid.</p>
<h3 id="props">Props</h3>
<h4 id="-component-__-required-__"><code>{`component`}</code> <strong>(required)</strong></h4>
<p>Specify what Field or Fields the Message is in charge of displaying. 
<code>{`for`}</code> should correspond to a field <code>{`name`}</code>.</p>
<p>type: <code>{`func, string`}</code>  <em>default</em>: <code>{`'span'`}</code></p>
<h4 id="-errorclass-"><code>{`errorClass`}</code></h4>
<p>A css class that should be always be applied to the Message container.</p>
<p>type: <code>{`string`}</code>  <em>default</em>: <code>{`'validation-error'`}</code></p>

      </div>
    )
  }
}
