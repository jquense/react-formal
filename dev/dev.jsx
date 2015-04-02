'use strict';
var React = require('react/addons')
var Form = require('../src')


var yup = require('yup');
var setter = require('property-expr').setter;

var people =[
  { id: 0, first: 'John', surname: 'Smith'},
  { id: 1, first: 'Jane', surname: 'Smith'},
  { id: 2, first: 'Betsy', surname: 'Quense'},
  { id: 3, first: 'Natalie', surname: 'Quense'},
  { id: 4, first: 'Yolanda', surname: 'Diaz'},
  { id: 5, first: 'Bertha', surname: 'Totes'}
]

var schema = yup.object({
      personal: yup.object(
      {
        id:     yup.number()
          .required('please provide a name')
          .default(''),
        first:    yup.string()
          .default(''),
        last:     yup.string()
          .default(''),
        birthday: yup.date()
          .required('please provide a date of birth')
          .nullable()
          .default(null)
      }),

      trivia: yup.object({

        favNumber: yup.number()
          .required()
          .default(0)
          .min(0, 'your favorite number cannot be negative')
      })

    }).strict();


// Simple component to pull it all together
var App = React.createClass({

  getInitialState() {
    // create a default empty model for the initial value
    return { model: schema.default() }
  },

  createHandler(path) {
    var self = this
      , setpath = setter(path)

    return function(val){
      var s = self.state // copy state so we can update without mutating

      if( val && val.target)      // in case we got a `SyntheticEvent` object 
        val = val.target.value

      setpath(s, val === null ? undefined : val) // i don't want to allow nullable values so coerce to undefined
      self.setState(s)
    }
  },

  _change(model) {
    this.setState({ model })
  },

  render(){
    var model = this.state.model; // the data to bind to the form
    
    return (
      <div style={{ width: 400 }}>
        <input type='text' defaultValue='hi'/>
        <Form value={model} onChange={this._change} schema={schema} className='form-horizontal'>
          <fieldset>
            <legend>Personal</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>name</label>
              <div className='col-sm-8'>
                <Form.Field for='personal.id' 
                  type='dropdownlist'
                  updates={{
                    'personal.id':    'id',
                    'personal.first': 'first', 
                    'personal.last':  'surname'
                  }}
                  group='personal' 
                  textField='first'
                  valueField='id'
                  data={people}
                  />
                <Form.ValidationMessage for='personal.name'/>
              </div>
            </div>
            <div className='form-group'>
              <label className='control-label col-sm-3'>birthday</label>
              <div className='col-sm-8'>
                <Form.Field 
                  for='personal.birthday' 
                  group='personal'
                  time={false} 
                  format='d'/>
                <Form.ValidationMessage for='personal.birthday'/>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Trivia</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>favorite number</label>
              <div className='col-sm-8'>
                <Form.Field for='trivia.favNumber'/>
                <Form.ValidationMessage for='trivia.favNumber'/>
              </div>
            </div>
            <div className='form-group'>
              <div className='col-sm-offset-3 col-sm-8'>
                <Form.Submit type='button' className='btn btn-primary'>Submit</Form.Submit>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>
    )
  }
})

React.render(<App/>, document.body);



