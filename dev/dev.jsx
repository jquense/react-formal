'use strict';
var React = require('react/addons')
var Form = require('../src')

var yup = require('../src/less/styles.less');
var yup = require('yup');

var people = [
  { id: 0, first: 'John', surname: 'Smith'},
  { id: 1, first: 'Jane', surname: 'Smith'},
  { id: 2, first: 'Betsy', surname: 'Quense'},
  { id: 3, first: 'Natalie', surname: 'Quense'},
  { id: 4, first: 'Yolanda', surname: 'Diaz'},
  { id: 5, first: 'Bertha', surname: 'Totes'}
]

var orgs = [
  { id: 0, name: 'Place'},
  { id: 1, name: 'Walmart'},
  { id: 2, name: 'Target'}
]

var emptyString = yup.string().default('')

yup.mixed.prototype.forbidden = function(message = 'This field is forbidden'){
  return this.test({ 
    message, name: 'required', 
    exclusive: true, 
    test: v => {
      return v == null 
    }
  })
}

var schema = yup.object({
      personal: yup.object().shape(
      {
        id:     yup.number()
          .required('please provide an ID')
          .default(0),
        first:    emptyString,
        last:     emptyString,
        orgID:    yup.number().when('location', (v, s) => !v ? s.required() : s),
        location: yup.string().when('orgID', (v, s) => v ? s.forbidden() : s),

        birthday: yup.date()
          .required('please provide a date of birth')
          .nullable()
          .default(null)
      }, ['orgID', 'location']),

      trivia: yup.object({

        favNumber: yup.number()
          .required()
          .default(0)
          .min(0, 'your favorite number cannot be negative')
      })

    });


// Simple component to pull it all together
var App = React.createClass({

  getInitialState() {
    // create a default empty model for the initial value
    return { model: schema.default() }
  },

  _change(model) {
    this.setState({ model })
  },

  render(){
    var model = this.state.model; // the data to bind to the form
    
    return (
      <div style={{ width: 400 }}>
        <Form defaultValue={model} schema={schema} className='form-horizontal' onChange={ model => console.log(model)}>
          <Form.Summary />
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
                <Form.Message for='personal.id'/>
              </div>
            </div>
            <div className='form-group'>
              <label className='control-label col-sm-3'>Employer</label>
              <div className='col-sm-8'>
                <Form.Field for='personal.orgID' validates='personal.location' 
                  type='combobox'
                  mapValue={{
                    'personal.orgID': 'id',
                    'personal.location': value => typeof value === 'string' ? value : value.name
                  }}
                  group='personal' 
                  textField='name'
                  valueField='id'
                  data={orgs}
                  />
                <Form.Message for={['personal.orgID', 'personal.location']}/>
              </div>
            </div>
            <div className='form-group'>
              <label className='control-label col-sm-3'>birthday</label>
              <div className='col-sm-8'>
                <Form.Field type='date' 
                  for='personal.birthday' 
                  onChange={ e => console.log('hi', e)}
                  group='personal'
                />
                <Form.Message for='personal.birthday'/>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Trivia</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>favorite number</label>
              <div className='col-sm-8'>
                <Form.Field for='trivia.favNumber'/>
                <Form.Message for='trivia.favNumber'/>
              </div>
            </div>
            <div className='form-group'>
              <div className='col-sm-offset-3 col-sm-8'>
                <Form.Button type='submit' className='btn btn-primary'>Submit</Form.Button>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>
    )
  }
})

React.render(<App/>, document.body);



