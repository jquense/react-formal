'use strict';
var React = require('react/addons')
var Form = require('../src')

require('../src/less/styles.less');
var yup = require('yup');
var perf = window.perf = React.addons.Perf;

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
        id:     yup.number(),

        first:    emptyString.required(),
        last:     emptyString.required(),

        address:  emptyString.required(),

        birthday: yup.date()
          .required('please provide a date of birth')
          .nullable()
          .default(null)
      }),

      trivia: yup.object({
        isCool:    yup.bool().default(false),
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
    return { model: {} }
  },

  _change(model) {
    this.setState({ model })
  },

  render(){
    var model = this.state.model; // the data to bind to the form

    return (
      <div style={{ width: 400 }}>
        <Form debug value={this.state.model} schema={schema} className='form-horizontal' onChange={this._change}>
          <Form.Summary />
          <fieldset>
            <legend>Personal</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>name</label>
              <div className='col-sm-8'>
                <Form.Field name='personal.first' type='select' className='form-control'/>
                <Form.Message for='personal.first'/>

                <Form.Field name='personal.last' type='select' className='form-control'/>
                <Form.Message for='personal.first'/>
              </div>
            </div>
            <div className='form-group'>
              <label className='control-label col-sm-3'>Employer</label>
              <div className='col-sm-8'>

                <Form.Message for={['personal.orgID', 'personal.location']}/>
              </div>
            </div>
            <div className='form-group'>
              <label className='control-label col-sm-3'>birthday</label>
              <div className='col-sm-8'>
                <Form.Field type='textarea' name='personal.address' className='form-control'/>
                <Form.Message for='personal.address'/>
              </div>
            </div>
            <div className='form-group'>
              <label className='control-label col-sm-3'>birthday</label>
              <div className='col-sm-8'>
                <Form.Field type='datetime-local' name='personal.birthday' group='personal' className='form-control'/>
                <Form.Message for='personal.birthday'/>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Trivia</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>favorite number</label>
              <div className='col-sm-8'>
                <Form.Field name='trivia.favNumber' className='form-control'/>
                <Form.Message for='trivia.favNumber'/>
              </div>
            </div>
            <div className='form-group'>

              <div className='col-sm-8 col-sm-offset-3'>
                <div className='checkbox'>
                  <label className='checkbox'>
                    <Form.Field name='trivia.isCool'/> Cool?
                  </label>
                  <Form.Message for='trivia.isCool'/>
                </div>
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


ReactDOM.render(<App/>, document.body, function(){
  console.log('starting')
  //perf.start()
});
