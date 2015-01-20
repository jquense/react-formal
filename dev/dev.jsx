'use strict';
var React = require('react/addons')
var Form = require('../src/Form.jsx')
var ValidatableInput = require('../src/ValidatableInput.jsx')
var ValidationMessage = require('react-input-error/lib/components/ValidationMessage')
var FormButton = require('react-input-error/lib/components/ValidateButton')

var yup = require('yup');
var assign = require('xtend/mutable');
var setter = require('property-expr').setter;

var schema = yup.object({
      personal:  yup.object({
        name:      yup.string().required('please provide a name').default(''),
        birthday:  yup.date().required('please provide a date of birth'),
      }),

      trivia: yup.object({

        favNumber: yup.number()
                      .required().default(0)
                      .min(0, 'your favorite number cannot be negative')
      }),

    }).strict();


// Simple component to pull it all together
var App = React.createClass({

  getInitialState: function(){
    // create a default empty model for the initial value
    return { model: schema.default() }
  },

  createHandler(path){
    var self = this
      , setpath = setter(path)

    return function(val){
      var s = assign(self.state); // copy state so we can update without mutating

      if( val && val.target)      // in case we got a `SyntheticEvent` object 
        val = val.target.value

      setpath(s, val === null ? undefined : val) // i don't want to allow nullable values so coerce to undefined
      self.setState(s)
    }
  },

  _change(model){
    this.setState({ model })
  },

  render(){
    var model = this.state.model; // the data to bind to the form
    
    return (
      <div style={{ width: 400 }}>
        <Form value={model} onChange={this._change} schema={schema} className='form-horizontal'>
          <fieldset>
            <legend>Personal</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>name</label>
              <div className='col-sm-8'>
                <ValidatableInput for='personal.name' group='personal' className='form-control'/>
                <ValidationMessage for='personal.name'/>
              </div>
            </div>
            <div className='form-group'>
              <label className='control-label col-sm-3'>birthday</label>
              <div className='col-sm-8'>
                <ValidatableInput for='personal.birthday' group='personal' time={false} format='d'/>
                <ValidationMessage for='personal.birthday'/>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Trivia</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>favorite number</label>
              <div className='col-sm-8'>
                <ValidatableInput for='trivia.favNumber'/>
                <ValidationMessage for='trivia.favNumber'/>
              </div>
            </div>
            <div className='form-group'>
              <div className='col-sm-offset-3 col-sm-8'>
                <FormButton type='button' className='btn btn-primary'>Submit</FormButton>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>
    )
  }
})

React.render(<App/>, document.body);



