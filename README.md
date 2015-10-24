# react-formal

Better form validation and value management for React. Provides __minimal__ wiring while also allowing for complete input flexibility.

Built on [yup](https://github.com/jquense/yup) and [react-input-message](https://github.com/jquense/react-input-message).

## Install

```sh
npm i -S react-formal yup
```

__(don't like the yup but like how the form works? Try: [topeka](https://github.com/jquense/topeka))__

### Use

__For more complete api documentations, live examples, and getting started guide check out the [documentation site](http://jquense.github.io/react-formal/docs/#/getting-started).__

`react-formal` uses a [yup](https://github.com/jquense/yup) schema to update and validate form values. It treats the `form` like an input (representing an object) with a `value` and `onChange`. The `form` can be controlled or uncontrolled as well, just like a normal React input.

```js
var yup = require('yup')
  , Form = require('react-formal')

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
        >
            <fieldset>
                <legend>Personal Details</legend>

                <Form.Field name='name.first'/>
                <Form.Message for='name.first'/>

                <Form.Field name='name.last'/>
                <Form.Message for='name.last'/>

                <Form.Field name='dateOfBirth'/>
                <Form.Message for='dateOfBirth'/>
            </fieldset>
            <Form.Button type='submit' >Submit</Form.Button>
        </Form>
    )
}
```
