import React from 'react';
import ReactDOM, { render } from 'react-dom';
import types from 'react-formal-inputs';
import Form from '../src';
import DateInput from '../src/inputs/Date';
import Intro from'./pages/intro.md';
import yup from 'yup';
import {
    Router
  , Route
  , IndexRoute
  , Link } from 'react-router';

import './styles/style.less';
import 'react-widgets/lib/less/react-widgets.less';

import localizers from 'react-widgets/lib/localizers/globalize'

localizers(require('globalize'))

Form.addInputTypes(types)

var nameSchema = yup.string()
      .default('')
      .required('You must provide a name');

var modelSchema = yup.object({
   name: yup.object({
     first: nameSchema,
     last:  nameSchema
   }),
   dateOfBirth: yup.date()
      .required('Please enter a date of birth')
      .max(new Date(), "You can't be born in the future!"),

   colorId: yup.number(),

   age: yup.number()
     .nullable()
     .required('Please enter an age')
     .positive('Ages must be a positive number')
})

let MyDateInput = props => <DateInput {...props} type='datetime-local'/>

var reqMap = { 'react-formal': 'Form', 'react': 'React', 'react-formal-inputs': 'types' }
  , scope = {
    Form, React, ReactDOM, yup, modelSchema, MyDateInput, types,
    require(name){ return scope[reqMap[name] || name] }
  };


class Docs extends React.Component {

  render(){
    return (<div className='container'>
      <aside className='col-sm-3 col-md-2'>
        <nav className='side-nav'>
          <ul className='nav'>
            <li className='side-heading '>API</li>
            <li><Link to='/api/form'>Form</Link></li>
            <li><Link to='/api/field'>Form.Field</Link></li>
            <li><Link to='/api/context'>Form.Context</Link></li>
            <li><Link to='/api/message'>Form.Message</Link></li>
            <li><Link to='/api/summary'>Form.Summary</Link></li>
            <li><Link to='/api/button'>Form.Button</Link></li>
            <li><Link to='/api/yup'>Schema</Link></li>
          </ul>
        </nav>
      </aside>
      <main className='col-sm-9 col-md-10 doc-page'>
        { React.cloneElement(this.props.children, { scope })}
      </main>
     </div>)
  }
}

class Main extends React.Component {

  render(){
    return (<div>
      <div className="jumbotron">
        <div className="container">
          <h1>React&nbsp;<img src='./bow-tie.svg' style={{ width: 75, marginTop: -5 }}/>&nbsp;Formal</h1>
          <p>Classy HTML form management</p>
        </div>
      </div>
      <div className='container'>
        <Intro scope={scope} />
      </div>
     </div>)
  }
}

class App extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  render(){
    var location = this.props.location;
    var home = location.pathname === '/'
            || location.pathname.indexOf('/getting-started') === 0

    return (<div>
      <nav className='navbar navbar-default navbar-static-top' style={{ marginBottom: 0 }}>

        <div className='container'>
          { !home &&
          <span className='navbar-brand'>
            <Link to='/getting-started'>
              React&nbsp;<img src='./bow-tie.svg' style={{ width: 30, marginTop: -5 }}/>&nbsp;Formal
            </Link>
          </span>
          }
          <ul className='nav navbar-nav navbar-right'>
            <li><Link to='/api'>Documentation</Link></li>
            <li><a href='https://github.com/jquense/react-formal'>Github</a></li>
          </ul>
        </div>
      </nav>
      { React.cloneElement(this.props.children, { scope })}
     </div>
   )
  }
}


var routes = (
  <Route name="app" path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path='getting-started' component={Main}/>

    <Route path='api' component={Docs}>
      <IndexRoute component={require('!babel-loader!./loaders/jsx!./loaders/metadata!../src/Form')} />
      <Route path='yup'     component={require('./pages/yup.md')}/>
      <Route path='form'    component={require('!babel-loader!./loaders/jsx!./loaders/metadata!../src/Form')}/>
      <Route path='field'   component={require('!babel-loader!./loaders/jsx!./loaders/metadata!../src/Field')}/>
      <Route path='message' component={require('!babel-loader!./loaders/jsx!./loaders/metadata!../src/ValidationMessage')}/>
      <Route path='summary' component={require('!babel-loader!./loaders/jsx!./loaders/metadata!../src/ValidationSummary')}/>
      <Route path='button'  component={require('!babel-loader!./loaders/jsx!./loaders/metadata!../src/FormButton')}/>
      <Route path='context' component={require('!babel-loader!./loaders/jsx!./loaders/metadata!../src/FormContext')}/>
      <Route path="/controllables" component={require('./pages/controllables.md')}/>
    </Route>
  </Route>
);

render(<Router>{routes}</Router>, document.getElementById('AppContainer'));
