var React = require('react')
  , Playground = require('component-playground');

module.exports = class  extends React.Component {
  render(){
    return (
      <div>
<h2 id="a-quick-guide-to-yup">A Quick Guide to yup</h2>
<p>Create schemas by calling the type factories on the <code>{`yup`}</code> object.</p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`  // base: matches every type
  yup.mixed() 

  // primitive types
  yup.string()
  yup.date()
  yup.number()
  yup.bool()

  // complex types
  yup.array().of(yup.number())
  yup.object({
      property: yup.string()    
  })`} es6Console />

<p>Schema objects are immutable, so each method returns a <em>new</em> schema object. This is helpful for reusing schemas without worrying about breaking existing ones.</p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`  var string = yup.string();
  var requiredString = string.required();

  console.log(string !== requiredString)

  console.log(
    requiredString !== requiredString.max(5))`} es6Console />

<p>Schemas can be combined (as long as they are the same type) using <code>{`.concat()`}</code></p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`  var defaultString = yup.string().default('hi');
  var reqString = yup.string().required();

  var reqDefaultString = defaultString.concat(reqString)

  console.log(reqDefaultString.default())

  reqDefaultString.isValid('').then(
    valid => console.log(valid))`} es6Console />

<p>You can use <code>{`yup`}</code> to coerce objects to match the defined schema with <code>{`.cast()`}</code></p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`  var schema = yup.object()
    .camelcase()
    .shape({
      firstName: yup.string().trim(),
      age:       yup.number()
    })

  console.log(
    schema.cast({ FIRST_NAME: '  John  ', age: '6' }))`} es6Console />

<p>Validate an object against a scheam with <code>{`.validate()`}</code> or <code>{`.isValid()`}</code></p>
<Playground lang="js" theme="neo" scope={this.props.scope} codeText={`  var schema = yup.object()
    .camelcase()
    .shape({
      firstName: yup.string().trim(),
      age:       yup.number()
    })

  schema.validate({ FIRST_NAME: '  John  ', age: '6' })
    .then(value => console.log('validate: ', value))

  // pass in the strict option to disable coercion
  schema.validate(
      { FIRST_NAME: '  John  ', age: '6' },
      { strict: true }
    ).catch(err  => console.log('strict: ', err.errors))

  schema.isValid(
      { FIRST_NAME: '  John  ', age: '6' }, 
      { strict: true }
    ).then( valid => console.log('isValid:', valid))`} es6Console />


      </div>
    )
  }
}
