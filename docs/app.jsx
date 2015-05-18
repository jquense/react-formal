var React = require('react')
  , types = require('react-formal-inputs')
  , Form = require('../src')
  , MyDateInput = require('../src/inputs/Date')
  , yup = require('yup')
  , {
    create: createRouter
  , DefaultRoute
  , RouteHandler
  , Navigation
  , State
  , Route
  , Link } = require('react-router')

require('./style.less')
require('react-widgets/lib/less/react-widgets.less')

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


var reqMap = { 'react-formal': 'Form', 'react': 'React', 'react/addons': 'React', 'react-formal-inputs': 'types' }
  , scope = { Form, React, yup, modelSchema, MyDateInput, types, require(name){ return scope[reqMap[name] || name] } }
  , Intro = require('./components/intro')

class Docs extends React.Component {

  render(){
    return (<div className='container'>
      <aside className='col-sm-3 col-md-2'>
        <nav className='side-nav'>
          <ul className='nav'>
            <li className='side-heading '>API</li>
            <li><Link to='/api/form'>Form</Link></li>
            <li><Link to='/api/field'>Form.Field</Link></li>
            <li><Link to='/api/message'>Form.Message</Link></li>
            <li><Link to='/api/summary'>Form.Summary</Link></li>
            <li><Link to='/api/button'>Form.Button</Link></li>
            <li><Link to='/api/yup'>Schema</Link></li>
          </ul>
        </nav>
      </aside>
      <main className='col-sm-9 col-md-10 doc-page'>
        <RouteHandler scope={scope} />
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
    router: React.PropTypes.any
  }

  render(){
    var home = this.context.router.getCurrentPath() === '/'
            || this.context.router.isActive('intro')

    return (<div>
      <nav className='navbar navbar-default navbar-static-top' style={{ marginBottom: 0 }}>
        
        <div className='container'>
          { !home && 
          <span className='navbar-brand'>
            <Link to='intro'>React&nbsp;<img src='./bow-tie.svg' style={{ width: 30, marginTop: -5 }}/>&nbsp;Formal</Link>
          </span>
          }
          <ul className='nav navbar-nav navbar-right'>
            <li><Link to='/api'>Documentation</Link></li>
            <li><a href='https://github.com/jquense/react-formal'>Github</a></li>
          </ul>
        </div>
      </nav>
      <RouteHandler scope={scope} />
     </div>
   )
  }
}


var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Main} />
    
    <Route name="intro" path='getting-started' handler={Main}/>
    

    <Route path='api' handler={Docs}>
      <DefaultRoute handler={require('./components/Form')} />
      <Route path='yup' handler={require('./components/yup')}/>
      <Route path='form' handler={require('./components/Form')}/>
      <Route path='field' handler={require('./components/Field')}/>
      <Route path='message' handler={require('./components/ValidationMessage')}/>
      <Route path='summary' handler={require('./components/ValidationSummary')}/>
      <Route path='button' handler={require('./components/Button')}/>
      <Route path="/controllables" handler={require('./components/controllables')}/>
    </Route>
  </Route>
);

var rootInstance = null;

createRouter({ routes }).run(function (Handler, state) {
  rootInstance = React.render(<Handler params={state.params}/>, document.getElementById('AppContainer'));
})