# formal-yup

Another form validation and value management component for React. Provides __minimal__ wiring while also allowing for complete input flexibility.

Built on [yup](https://github.com/jquense/yup) and [react-input-message](https://github.com/jquense/react-input-message).

## Install

```sh
npm i -S jquense/yup-forms
```


### Use

`formal-yup` uses a [yup](https://github.com/jquense/yup) schema to update and validate form values. It treats the `form` like an input (representing an object) with a `value` and `onChange`. The `form` can be controlled or uncontrolled as well, just like a React input.

```js
var yup = require('yup')
  , Form = require('formal-yup')

var modelSchema =  yup.object({
        name: yup.object({
            first: yup.string().required('Name is required'),
            last: yup.string().required('Name is required')    
        }),
        dateOfBirth: yup.date()
            .max(new Date(), 'You can be born in the future!')
    })

// ...in a component
render(){
    return (
        <Form 
            schema={modelSchema}
            value={this.state.model} 
            onChange={model => this.setState({ model})}
        />
            <fieldset>
                <legend>Personal Details</legend>

                <Form.field for='name.first'/>
                <Form.Message for='name.first'/>

                <Form.field for='name.last'/>
                <Form.Message for='name.last'/>

                <Form.field for='dateOfBirth'/>
                <Form.Message for='dateOfBirth'/>
            </fieldset>
            <Form.Button type='submit' >Submit</Form.Button>
        </Form>
    )
}
```

The above form 