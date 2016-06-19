'use strict';
import React from 'react';
import { render } from 'react-dom';
var Form = require('../src')

require('../src/less/styles.less');
var yup = require('yup');
// var perf = window.perf = React.addons.Perf;

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
        last:     emptyString.required()
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
    return (
      <div style={{ width: 400 }}>
        <Form debug
          value={this.state.model}
          schema={schema}
          className='form-horizontal'
          onChange={this._change}
        >
          <fieldset>
            <legend>Personal</legend>
            <div className='form-group'>
              <label className='control-label col-sm-3'>name</label>
              <div className='col-sm-8'>
                <Form.Field name='personal.first' className='form-control'/>
                {/*/<Form.Message for='personal.first'/>*/}
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


render(<App/>, document.body, function(){
  console.log('starting')
  //perf.start()
});
