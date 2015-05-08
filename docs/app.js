/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var React = __webpack_require__(1),
	    Playground = __webpack_require__(3),
	    Form = __webpack_require__(2),
	    yup = __webpack_require__(6);
	
	__webpack_require__(4);
	
	var scope = { Form: Form, React: React, Playground: Playground, yup: yup };
	
	var App = (function () {
	  function App() {
	    _classCallCheck(this, App);
	  }
	
	  App.prototype.render = function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'h1',
	        { id: 'formal-react' },
	        'formal-react'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Another form validation and value management component for React. Provides ',
	        React.createElement(
	          'strong',
	          null,
	          'minimal'
	        ),
	        ' wiring while also allowing complete ',
	        React.createElement(
	          'strong',
	          null,
	          'flexibility'
	        ),
	        ' in how your inputs and errors are displayed. ',
	        React.createElement(
	          'code',
	          null,
	          'formal-react'
	        ),
	        ' is built to quick and flexible. It decouples your form structure and layout from the backing data, so you can update and rearrange your markup without changing your data at all.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'formal-react'
	        ),
	        ' also decouples form values form DOM state, ands ties validation to an object Schema defination. Since the schema is for the entire model and not just field specific validation, you can reuse it in your api utils for parsing responses, or flux stores for validating data. By default forms are ',
	        React.createElement(
	          'strong',
	          null,
	          'immutable'
	        ),
	        '; it doesn\'t use any fancy persistant data structures but is easily adaptable to them if you prefer. Built on ',
	        React.createElement(
	          'a',
	          { href: 'https://github.com/jquense/yup' },
	          'yup'
	        ),
	        ', ',
	        React.createElement(
	          'code',
	          null,
	          'formal-react'
	        ),
	        ' leverages the powerful schema DSL to quickly and easily define object shapes, validation messages and typed values.'
	      ),
	      React.createElement(
	        'h2',
	        { id: 'a-quick-guide-to-yup' },
	        'A Quick guide to yup'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Yup is a js object schema validator and object parser. The api and style is heavily inspired by Joi, an amazing library but is often too large and diffucult to use in a browser. Yup is a leaner and mostly as expressive without the server specific features. Check out the ',
	        React.createElement(
	          'a',
	          { href: 'https://github.com/jquense/yup/blob/master/README.md' },
	          'yup documentation'
	        ),
	        ' for a full run down of the features.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'var yup = require(\'yup\')\n\nvar nameSchema = yup.string()\n  .required(\'You must provide a name\')\n  .min(2, \'names must be at least 2 characters long\');\n\nvar myFormModel = yup.object({\n  name: yup.object({\n    first: nameSchema,\n    last:  nameSchema\n  }),\n\n  dateOfBirth: yup.date()\n    .max(new Date(), \'You can\'t be born in the future!\'),\n\n  age: yup.number()\n    .required(\'Please enter an age\')\n    .positive(\'Ages must be a positive number\')\n})'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Once we have a Schema we are ready to build our Form.'
	      ),
	      React.createElement(
	        'h2',
	        { id: 'components' },
	        'Components'
	      ),
	      React.createElement(
	        'h3',
	        { id: 'field' },
	        'Field'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'The Field Component renders a form control and handles input value updates and validations. Changes to the Field value are automatically propagated back up to the containing Form Component.'
	      ),
	      React.createElement(
	        'h4',
	        { id: 'props' },
	        'Props'
	      ),
	      React.createElement(
	        'h4',
	        { id: '-name-__-required-__' },
	        React.createElement(
	          'code',
	          null,
	          'name'
	        ),
	        ' ',
	        React.createElement(
	          'strong',
	          null,
	          '(required)'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'The Field name, which should be path corresponding to a specific form ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' path.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          '// given the form value \nvalue = {\n  name: { first: \'\' }\n  languages: [\'english\', \'spanish\']\n}\n\n// the path "name.first" would update the &quot;first&quot; property of the form value\n<Form.Field name=\'name.first\' />\n\n// use indexes for paths that cross arrays\n<Form.Field name=\'languages[0]\' />'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'string'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-group-' },
	        React.createElement(
	          'code',
	          null,
	          'group'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Group Fields together with a common ',
	        React.createElement(
	          'code',
	          null,
	          'group'
	        ),
	        ' name. Groups can be validated together, helpful for multi-part forms.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          '<Form.Field name=\'first\' group=\'name\'/>\n<Form.Field name=\'surname\' group=\'name\' />\n\n<Form.Buttom group=\'name\'>\n  Validate Name\n</Form.Button>'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'string'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-type-' },
	        React.createElement(
	          'code',
	          null,
	          'type'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'The Component Input the form should render. You can sepcify a builtin type with a string name e.g ',
	        React.createElement(
	          'code',
	          null,
	          '\'text\''
	        ),
	        ', ',
	        React.createElement(
	          'code',
	          null,
	          '\'datetime-local\''
	        ),
	        ', etc. or provide a Component type class directly. When no type is provided the Field will attempt determine the correct input from the corresponding scheme. A Field corresponding to a ',
	        React.createElement(
	          'code',
	          null,
	          'yup.number()'
	        ),
	        'will render a ',
	        React.createElement(
	          'code',
	          null,
	          'type=\'number\''
	        ),
	        ' input by default.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          '<Form.Field type=\'number\' />\n\n<Form.Field type={MyInputComponent}/>'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Custom Inputs should comply with the basic input api contract: set a value via a ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' prop and broadcast changes to that value via an ',
	        React.createElement(
	          'code',
	          null,
	          'onChange'
	        ),
	        ' handler.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'You can also permenantly map Components to a string ',
	        React.createElement(
	          'code',
	          null,
	          'type'
	        ),
	        ' name via the top-level',
	        React.createElement(
	          'code',
	          null,
	          'addInputType()'
	        ),
	        ' api.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func, string'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '\'\''
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-events-' },
	        React.createElement(
	          'code',
	          null,
	          'events'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'An array of event names that the Field should trigger a validation.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'array<string>'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '[\'onChange\', \'onBlur\']'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-mapvalue-' },
	        React.createElement(
	          'code',
	          null,
	          'mapValue'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Customize how the Field value maps to the overall Form ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        '.',
	        React.createElement(
	          'code',
	          null,
	          'mapValue'
	        ),
	        ' can be a function that returns a value for ',
	        React.createElement(
	          'code',
	          null,
	          'name'
	        ),
	        '\'d path, allowing you to set commuted values from the Field.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          '<Form.Field name=\'name\'\n  mapValue={ fieldValue => fieldValue.first + \' \' + fieldValue.last }\n/>'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'You can also provide an object hash, mapping paths of the Form ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        'to fields in the field value.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          '<Form.Field name=\'name\'\n  mapValue={{\n    \'name.first\': \'first\', // where \'first\' is a field on the input value\n    \'name.last\':  \'surname\'\n  }}\n/>'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func, object'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-errorclass-' },
	        React.createElement(
	          'code',
	          null,
	          'errorClass'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'The css class added to the Field Input when it fails validation'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'string'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '\'invalid-field\''
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-alsovalidates-' },
	        React.createElement(
	          'code',
	          null,
	          'alsoValidates'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Tells the Field to trigger validation for addition paths as well as its own (',
	        React.createElement(
	          'code',
	          null,
	          'name'
	        ),
	        '). Useful when used in conjuction with a ',
	        React.createElement(
	          'code',
	          null,
	          'mapValue'
	        ),
	        ' hash that updates more than one value.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          '<Form.Field name=\'name\'\n  mapValue={{\n    \'name.first\': \'first\',\n    \'name.last\':  \'surname\'\n  }}\n  alsoValidates={[\'name.first\', \'name.last\']}\n/>'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'array<string>'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-novalidate-' },
	        React.createElement(
	          'code',
	          null,
	          'noValidate'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Disables validation for the Field.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'bool'
	        )
	      ),
	      React.createElement(
	        'h3',
	        { id: 'form' },
	        'Form'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Form component renders a ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' to be updated and validated by child Fields. Forms can be thought of as ',
	        React.createElement(
	          'code',
	          null,
	          '<input/>'
	        ),
	        's for complex values, or models. A Form aggregates a bunch of smaller inputs, each in charge of updating a small part of the overall model. The Form will integrate and validate each change and fire a single unified ',
	        React.createElement(
	          'code',
	          null,
	          'onChange'
	        ),
	        ' with the new ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        '.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Validation messages can be displayed anywhere inside a Form with Message Components. '
	      ),
	      React.createElement(Playground, { lang: 'js', theme: 'neo', scope: scope, codeText: 'var nameSchema = yup.string()\n      .default(\'\')\n      .required(\'You must provide a name\')\n      .min(2, \'names must be at least 2 characters long\');\n\nvar modelSchema = yup.object({\n   name: yup.object({\n     first: nameSchema,\n     last:  nameSchema\n   }),\n   dateOfBirth: yup.date()\n     .max(new Date(), "You can\'t be born in the future!"),\n   age: yup.number()\n     .nullable()\n     .required(\'Please enter an age\')\n     .positive(\'Ages must be a positive number\')\n})\n\nReact.render(\n  <Form \n    schema={modelSchema}\n    defaultValue={modelSchema.default()}\n  >\n    <fieldset>\n      <legend>Name</legend>\n\n      <Form.Field name=\'name.first\'/>\n      <Form.Field name=\'name.last\'/>\n\n      <Form.Message for={[\'name.first\', \'name.last\']}/>\n    </fieldset>\n\n    <Form.Field name=\'dateOfBirth\'/>\n    <Form.Message for=\'dateOfBirth\'/>\n\n    <Form.Field name=\'age\'/>\n    <Form.Message for=\'age\'/>\n\n    <Form.Button type=\'submit\'>Submit</Form.Button>\n</Form>\n, mountNode);' }),
	      React.createElement(
	        'h4',
	        { id: 'props' },
	        'Props'
	      ),
	      React.createElement(
	        'h4',
	        { id: '-value-' },
	        React.createElement(
	          'code',
	          null,
	          'value'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Form value object, can be left uncontrolled; use the ',
	        React.createElement(
	          'code',
	          null,
	          'defaultValue'
	        ),
	        ' prop to initialize an uncontrolled form.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'object'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-onchange-' },
	        React.createElement(
	          'code',
	          null,
	          'onChange'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Callback that is called when the ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' prop changes.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-errors-' },
	        React.createElement(
	          'code',
	          null,
	          'errors'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'An object hash of field errors for the form. The object should be keyed with paths with the values being string messages or an array of messages. Errors can be left uncontrolled (use ',
	        React.createElement(
	          'code',
	          null,
	          'defaultErrors'
	        ),
	        ' to set an initial value) or managed along with the ',
	        React.createElement(
	          'code',
	          null,
	          'onError'
	        ),
	        ' callback'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'errors={{\n "name.first": [\n   \'First names are required\', \n   "Names must be at least 2 characters long"\n ],\n}}'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'object'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-onerror-' },
	        React.createElement(
	          'code',
	          null,
	          'onError'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Callback that is called when a validation error occures. It is called with an ',
	        React.createElement(
	          'code',
	          null,
	          'errors'
	        ),
	        ' object'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'function onError(errors){\n  errors[\'name.first\'] \n  // => \'required field\', "Names must be at least 2 characters long"]\n}'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-onvalidate-' },
	        React.createElement(
	          'code',
	          null,
	          'onValidate'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Callback that is called whenever a validation is triggered. It is called ',
	        React.createElement(
	          'em',
	          null,
	          'before'
	        ),
	        ' the validation is actually run.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'function onError(e){\n  { event, field, args, target } = e\n}'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-onsubmit-' },
	        React.createElement(
	          'code',
	          null,
	          'onSubmit'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Callback that is fired when the native onSubmit event is triggered. Only relevant when the ',
	        React.createElement(
	          'code',
	          null,
	          'component'
	        ),
	        ' prop renders a ',
	        React.createElement(
	          'code',
	          null,
	          '<form/>'
	        ),
	        ' tag. onSubmit will trigger only if the form is valid.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'function onSubmit(e){\n  // do something with valid value\n}'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-getter-' },
	        React.createElement(
	          'code',
	          null,
	          'getter'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'A value getter function. ',
	        React.createElement(
	          'code',
	          null,
	          'getter'
	        ),
	        ' is called with ',
	        React.createElement(
	          'code',
	          null,
	          'path'
	        ),
	        ' and ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' and should return the plain ',
	        React.createElement(
	          'strong',
	          null,
	          'javascript'
	        ),
	        ' value at the path.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'function(\n path: string,\n value: any,\n) -> object'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '(path, model) => expr.getter(path)(model)'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-setter-__-required-__' },
	        React.createElement(
	          'code',
	          null,
	          'setter'
	        ),
	        ' ',
	        React.createElement(
	          'strong',
	          null,
	          '(required)'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'A value setter function. ',
	        React.createElement(
	          'code',
	          null,
	          'setter'
	        ),
	        ' is called with ',
	        React.createElement(
	          'code',
	          null,
	          'path'
	        ),
	        ', the form ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' and the path ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        '. The ',
	        React.createElement(
	          'code',
	          null,
	          'setter'
	        ),
	        ' must return updated form ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ', which allows you to leave the original value unmutated.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'The default implementation uses the ',
	        React.createElement(
	          'a',
	          { href: 'http://facebook.github.io/react/docs/update.html' },
	          'react immutability helpers'
	        ),
	        ', letting you treat the form ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' as immutable.'
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'function(\n path: string,\n formValue: object,\n pathValue: any\n) -> object'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '(path, model, val) => updateIn(model, toUpdateSpec(path, val))'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-delay-' },
	        React.createElement(
	          'code',
	          null,
	          'delay'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Time in milliseconds that validations should be debounced. Reduces the amount of validation calls made at the expense of a slight delay. Helpful for performance.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'number'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '300'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-strict-' },
	        React.createElement(
	          'code',
	          null,
	          'strict'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Validations will be strict, making no attempt to coarce input values to the appropriate type.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'bool'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          'true'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-novalidate-' },
	        React.createElement(
	          'code',
	          null,
	          'noValidate'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Turns off input validation for the Form, value updates will continue to work.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'enum<true, \'heelo\', 5>'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-component-__-required-__' },
	        React.createElement(
	          'code',
	          null,
	          'component'
	        ),
	        ' ',
	        React.createElement(
	          'strong',
	          null,
	          '(required)'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'A tag name or Component class the Form should render as'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func, string'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '\'form\''
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-schema-' },
	        React.createElement(
	          'code',
	          null,
	          'schema'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'A Yup schema  that validates the Form ',
	        React.createElement(
	          'code',
	          null,
	          'value'
	        ),
	        ' prop. Used to validate the form input values For more information about the yup api check out: ',
	        React.createElement(
	          'a',
	          { href: 'https://github.com/jquense/yup/blob/master/README.md' },
	          'https://github.com/jquense/yup/blob/master/README.md'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'YupSchema'
	        )
	      ),
	      React.createElement(
	        'h3',
	        { id: 'button' },
	        'Button'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'A Form Button, for triggering validations for specific Field groups'
	      ),
	      React.createElement(
	        'h4',
	        { id: 'props' },
	        'Props'
	      ),
	      React.createElement(
	        'h4',
	        { id: '-type-' },
	        React.createElement(
	          'code',
	          null,
	          'type'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'The ',
	        React.createElement(
	          'code',
	          null,
	          '<button/>'
	        ),
	        ' type'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'enum<\'button\', \'submit\'>'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '\'button\''
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-group-' },
	        React.createElement(
	          'code',
	          null,
	          'group'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Specify a group to validate, if empty the entire form will be validated. If the button type is \'submit\' the group will be ignored and the entire form will be validated prior to submission.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'string'
	        )
	      ),
	      React.createElement(
	        'h3',
	        { id: 'validationsummary' },
	        'ValidationSummary'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'Display all Form validation ',
	        React.createElement(
	          'code',
	          null,
	          'errors'
	        ),
	        ' in a single summary list.'
	      ),
	      React.createElement(
	        'h4',
	        { id: 'props' },
	        'Props'
	      ),
	      React.createElement(
	        'h4',
	        { id: '-formatmessage-__-required-__' },
	        React.createElement(
	          'code',
	          null,
	          'formatMessage'
	        ),
	        ' ',
	        React.createElement(
	          'strong',
	          null,
	          '(required)'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'An error message renderer, Should return a ',
	        React.createElement(
	          'code',
	          null,
	          'ReactElement'
	        )
	      ),
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          'function(\n  message: string, \n  idx: number, \n  messages: array\n) -> ReactElement'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '(message, idx) => <li key={idx}>{message}</li>'
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-component-__-required-__' },
	        React.createElement(
	          'code',
	          null,
	          'component'
	        ),
	        ' ',
	        React.createElement(
	          'strong',
	          null,
	          '(required)'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'A DOM node tag name or Component class the Message should render as.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'func, string'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '\'ul\''
	        )
	      ),
	      React.createElement(
	        'h4',
	        { id: '-errorclass-' },
	        React.createElement(
	          'code',
	          null,
	          'errorClass'
	        )
	      ),
	      React.createElement(
	        'p',
	        null,
	        'A css class that should be always be applied to the Message container.'
	      ),
	      React.createElement(
	        'p',
	        null,
	        'type: ',
	        React.createElement(
	          'code',
	          null,
	          'string'
	        ),
	        React.createElement(
	          'em',
	          null,
	          'default'
	        ),
	        ': ',
	        React.createElement(
	          'code',
	          null,
	          '\'validation-error\''
	        )
	      )
	    );
	  };
	
	  return App;
	})();
	
	React.render(React.createElement(App, null), document.body);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Form = __webpack_require__(8),
	    Field = __webpack_require__(9),
	    ValidationMessage = __webpack_require__(10),
	    ValidationSummary = __webpack_require__(11),
	    FormButton = __webpack_require__(12),
	    addType = __webpack_require__(13);
	
	Form.Field = Field;
	Form.Message = ValidationMessage;
	Form.Summary = ValidationSummary;
	Form.Button = FormButton;
	
	Form.addInputType = addType;
	
	module.exports = Form;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Playground = __webpack_require__(14);
	
	module.exports = Playground;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!E:\\Projects\\yup-forms\\node_modules\\css-loader\\index.js!E:\\Projects\\yup-forms\\node_modules\\less-loader\\index.js!E:\\Projects\\yup-forms\\docs\\style.less", function() {
			var newContent = require("!!E:\\Projects\\yup-forms\\node_modules\\css-loader\\index.js!E:\\Projects\\yup-forms\\node_modules\\less-loader\\index.js!E:\\Projects\\yup-forms\\docs\\style.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(15)();
	exports.push([module.id, "pre + .example {\n  margin-top: -10px;\n  border-top-width: 0;\n}\n.example {\n  background-color: white;\n  margin-top: 20px;\n  position: relative;\n  border: #DAE3E7 1px solid;\n  padding: 20px;\n  padding-top: 35px;\n}\ncode {\n  color: #555;\n  background-color: rgba(0, 0, 0, 0.07);\n}\n@media (min-width: 992px) {\n  .playground {\n    display: flex;\n  }\n}\n.playgroundCode,\n.cm-s-neo.CodeMirror {\n  background-color: #F4F4F4;\n  height: auto;\n  min-height: 75px;\n}\n.CodeMirror {\n  font-size: 12px;\n  height: auto;\n}\n.playgroundCode {\n  padding: 15px;\n  border-top: 1px solid #ddd;\n}\n.playgroundPreview {\n  position: relative;\n  padding: 40px 15px 15px 15px;\n}\n.playgroundPreview .rw-widget + input,\n.playgroundPreview .rw-widget + button,\n.playgroundPreview input + .rw-widget,\n.playgroundPreview button + .rw-widget,\n.playgroundPreview .rw-widget + .rw-widget {\n  margin-top: 15px;\n}\n.playgroundPreview:before {\n  position: absolute;\n  top: 3px;\n  left: 10px;\n  color: #959595;\n  content: 'Result';\n}\n.editable-error {\n  border-top: 1px solid #ddd;\n  background-color: white;\n  margin: 0 -15px;\n  margin-bottom: -15px;\n  padding: 10px;\n}\n.playground {\n  position: relative;\n  margin: 0;\n  margin-bottom: 20px;\n  border-radius: 3px;\n  border: 1px solid #ddd;\n}\n", ""]);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var mixed = __webpack_require__(16),
	    bool = __webpack_require__(17);
	
	module.exports = {
	  mixed: mixed,
	  string: __webpack_require__(18),
	  number: __webpack_require__(19),
	  boolean: bool,
	  bool: bool,
	  date: __webpack_require__(20),
	  object: __webpack_require__(21),
	  array: __webpack_require__(22),
	
	  reach: __webpack_require__(23),
	
	  ValidationError: __webpack_require__(24)
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1),
	    invariant = __webpack_require__(33)('formal-yup'),
	    reach = __webpack_require__(23),
	    expr = __webpack_require__(37),
	    updateIn = __webpack_require__(55),
	    Validator = __webpack_require__(53),
	    Container = __webpack_require__(54),
	    uncontrollable = __webpack_require__(57),
	    getChildren = __webpack_require__(26),
	    toUpdateSpec = __webpack_require__(27);
	
	var done = function done(e) {
	  return setTimeout(function () {
	    throw e;
	  });
	};
	
	var parent = function parent(path) {
	  return expr.join(expr.split(path).slice(0, -1));
	};
	
	/**
	 * Form component renders a `value` to be updated and validated by child Fields. 
	 * Forms can be thought of as `<input/>`s for complex values, or models. A Form aggregates 
	 * a bunch of smaller inputs, each in charge of updating a small part of the overall model.
	 * The Form will integrate and validate each change and fire a single unified `onChange` with the new `value`.
	 *
	 * Validation messages can be displayed anywhere inside a Form with Message Components. 
	 * 
	 * ```editable
	 * var nameSchema = yup.string()
	 *       .default('')
	 *       .required('You must provide a name')
	 *       .min(2, 'names must be at least 2 characters long');
	 * 
	 * var modelSchema = yup.object({
	 *    name: yup.object({
	 *      first: nameSchema,
	 *      last:  nameSchema
	 *    }),
	 *    dateOfBirth: yup.date()
	 *      .max(new Date(), "You can't be born in the future!"),
	 *    age: yup.number()
	 *      .nullable()
	 *      .required('Please enter an age')
	 *      .positive('Ages must be a positive number')
	 * })
	 *
	 * React.render(
	 *   <Form 
	 *     schema={modelSchema}
	 *     defaultValue={modelSchema.default()}
	 *   >
	 *     <fieldset>
	 *       <legend>Name</legend>
	 *     
	 *       <Form.Field name='name.first'/>
	 *       <Form.Field name='name.last'/>
	 *     
	 *       <Form.Message for={['name.first', 'name.last']}/>
	 *     </fieldset>
	 *  
	 *     <Form.Field name='dateOfBirth'/>
	 *     <Form.Message for='dateOfBirth'/>
	 *
	 *     <Form.Field name='age'/>
	 *     <Form.Message for='age'/>
	 *   
	 *     <Form.Button type='submit'>Submit</Form.Button>
	 * </Form>
	 * , mountNode);
	 * ```
	 * 
	 */
	
	var Form = (function (_React$Component) {
	  function Form(props, context) {
	    _classCallCheck(this, Form);
	
	    _React$Component.call(this, props, context);
	
	    this.validator = new Validator(function (path, props) {
	      var model = props.value,
	          schema = reach(props.schema, path),
	          value = props.getter(path, model),
	          context = schema._conditions.length ? props.getter(parent(path), model) : undefined; // an optimization may save a .toJS() call
	
	      return schema.validate(value, { strict: props.strict, context: context }).then(function () {
	        return void 0;
	      })['catch'](function (err) {
	        return err.errors;
	      });
	    });
	
	    this.state = {
	      children: getChildren(this.props.children, this.getChildContext())
	    };
	  }
	
	  _inherits(Form, _React$Component);
	
	  Form.prototype.componentWillUnmount = function componentWillUnmount() {
	    var timers = this._timers || {};
	
	    this._unmounted = true;
	    for (var k in timers) if (timers.hasOwnProperty(k)) clearTimeout(timers[k]);
	  };
	
	  Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    this._flushValidations(nextProps);
	
	    this.setState({
	      children: getChildren(nextProps.children, this.getChildContext())
	    });
	  };
	
	  Form.prototype.getChildContext = function getChildContext() {
	    var _this2 = this;
	
	    return this._context || (this._context = {
	
	      noValidate: function noValidate() {
	        return _this2.props.noValidate;
	      },
	
	      schema: function schema(path) {
	        return path && reach(_this2.props.schema, path);
	      },
	
	      value: function value(path) {
	        return _this2.props.getter(path, _this2.props.value);
	      },
	
	      onChange: function onChange(path, updates, val) {
	        return _this2._update(path, val, updates);
	      }
	    });
	  };
	
	  Form.prototype._update = function _update(path, widgetValue, mapValue) {
	    var model = this.props.value,
	        updater = this.props.setter;
	
	    if (process.env.NODE_ENV !== 'production') updater = wrapSetter(updater);
	
	    if (typeof mapValue === 'function') model = updater(path, model, mapValue(widgetValue));else if (mapValue) {
	      for (var key in mapValue) if (mapValue.hasOwnProperty(key)) model = updater(key, model, getValue(widgetValue, key, mapValue));
	    } else model = updater(path, model, widgetValue);
	
	    this.notify('onChange', model);
	
	    function getValue(val, key, map) {
	      var field = map[key];
	      return typeof field === 'function' ? field(val) : val[field];
	    }
	  };
	
	  Form.prototype.render = function render() {
	    var _this3 = this;
	
	    var _props = this.props;
	    var children = _props.children;
	    var onChange = _props.onChange;
	    var value = _props.value;
	    var Element = _props.component;
	
	    var props = _objectWithoutProperties(_props, ['children', 'onChange', 'value', 'component']);
	
	    if (Element === 'form') props.noValidate = true; // disable html5 validation
	
	    return React.createElement(
	      Container,
	      {
	        ref: function (ref) {
	          return _this3._container = ref;
	        },
	        messages: this.props.errors,
	        onValidationNeeded: this.props.noValidate ? function () {} : function (e) {
	          return _this3._handleValidationRequest(e);
	        } },
	      React.createElement(
	        Element,
	        _extends({}, props, { onSubmit: this._submit.bind(this) }),
	        this.state.children
	      )
	    );
	  };
	
	  Form.prototype._handleValidationRequest = function _handleValidationRequest(e) {
	    var _this4 = this;
	
	    this.notify('onValidate', e);
	
	    if (e.event === 'onChange') return this._queueValidation(e.field);
	
	    this.timeout(e.field, function () {
	      _this4.validator.validate(e.field, _this4.props).then(function () {
	        return _this4.notify('onError', _this4.validator.errors());
	      })['catch'](done);
	    }, this.props.delay);
	  };
	
	  Form.prototype._submit = function _submit(e) {
	    var _this5 = this;
	
	    var options = {
	      strict: this.props.strict,
	      abortEarly: false
	    };
	
	    e.preventDefault();
	
	    this.props.schema.validate(this.props.value, options).then(function () {
	      return _this5.notify('onSubmit', e);
	    })['catch'](function (err) {
	      var errors = err.inner.reduce(function (list, e) {
	        list[e.path] = (list[e.path] || (list[e.path] = [])).concat(e.errors);
	        return list;
	      }, {});
	
	      _this5.notify('onError', errors);
	    });
	  };
	
	  Form.prototype.timeout = function timeout(key, fn, ms) {
	    var timers = this._timers || (this._timers = Object.create(null));
	
	    if (this._unmounted) return;
	
	    clearTimeout(this._timers[key]);
	    this._timers[key] = setTimeout(fn, ms);
	  };
	
	  Form.prototype._queueValidation = function _queueValidation(path) {
	    var queue = this._queue || (this._queue = []);
	
	    if (queue.indexOf(path) === -1) queue.push(path);
	  };
	
	  Form.prototype._flushValidations = function _flushValidations(newProps) {
	    var _this6 = this;
	
	    var newValue = newProps.value,
	        oldValue = this.props.value,
	        fields = this._queue || [];
	
	    if (fields.length) {
	      this.timeout('yup_flush_validations', function () {
	        _this6._queue = [];
	
	        _this6.validator.validate(fields, newProps).then(function () {
	          return _this6.notify('onError', _this6.validator.errors());
	        })['catch'](done);
	      }, newProps.delay);
	    }
	  };
	
	  Form.prototype.notify = function notify(event, arg) {
	    this.props[event] && this.props[event](arg);
	  };
	
	  _createClass(Form, null, [{
	    key: 'propTypes',
	    value: {
	
	      /**
	       * Form value object, can be left uncontrolled; 
	       * use the `defaultValue` prop to initialize an uncontrolled form.
	       */
	      value: React.PropTypes.object,
	
	      /**
	       * Callback that is called when the `value` prop changes.
	       */
	      onChange: React.PropTypes.func,
	
	      /**
	       * An object hash of field errors for the form. The object should be keyed with paths
	       * with the values being string messages or an array of messages. Errors can be left 
	       * uncontrolled (use `defaultErrors` to set an initial value) or managed along with the `onError` callback
	       * 
	       * ```js
	       * errors={{
	       *  "name.first": [
	       *    'First names are required', 
	       *    "Names must be at least 2 characters long"
	       *  ],
	       * }}
	       * ```
	       */
	      errors: React.PropTypes.object,
	
	      /**
	       * Callback that is called when a validation error occures. It is called with an `errors` object
	       * ```js
	       * function onError(errors){
	       *   errors['name.first'] 
	       *   // => 'required field', "Names must be at least 2 characters long"]
	       * }
	       * ```
	       */
	      onError: React.PropTypes.func,
	
	      /**
	       * Callback that is called whenever a validation is triggered. 
	       * It is called _before_ the validation is actually run.
	       * ```js
	       * function onError(e){
	       *   { event, field, args, target } = e
	       * }
	       * ```
	       */
	      onValidate: React.PropTypes.func,
	
	      /**
	       * Callback that is fired when the native onSubmit event is triggered. Only relevant when 
	       * the `component` prop renders a `<form/>` tag. onSubmit will trigger only if the form is valid.
	       * 
	       * ```js
	       * function onSubmit(e){
	       *   // do something with valid value
	       * }
	       * ```
	       */
	      onSubmit: React.PropTypes.func,
	
	      /**
	       * A value getter function. `getter` is called with `path` and `value` and 
	       * should return the plain **javascript** value at the path.
	        * ```js
	       * function(
	       *  path: string,
	       *  value: any,
	       * ) -> object
	       * ```
	       */
	      getter: React.PropTypes.func,
	
	      /**
	       * A value setter function. `setter` is called with `path`, the form `value` and the path `value`. 
	       * The `setter` must return updated form `value`, which allows you to leave the original value unmutated.
	       *
	       * The default implementation uses the [react immutability helpers](http://facebook.github.io/react/docs/update.html), 
	       * letting you treat the form `value` as immutable.
	       * ```js
	       * function(
	       *  path: string,
	       *  formValue: object,
	       *  pathValue: any
	       * ) -> object
	       * ```
	       */
	      setter: React.PropTypes.func.isRequired,
	
	      /**
	       * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
	       * made at the expense of a slight delay. Helpful for performance.
	       */
	      delay: React.PropTypes.number,
	
	      /**
	       * Validations will be strict, making no attempt to coarce input values to the appropriate type.
	       */
	      strict: React.PropTypes.bool,
	
	      /**
	       * Turns off input validation for the Form, value updates will continue to work.
	       */
	      noValidate: React.PropTypes.oneOf([true, 'heelo', 5]),
	
	      /**
	       * A tag name or Component class the Form should render as
	       */
	      component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,
	
	      /**
	       * A Yup schema  that validates the Form `value` prop. Used to validate the form input values 
	       * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
	       * @type {YupSchema}
	       */
	      schema: function schema(props, name, componentName) {
	        var err = !props.noValidate && React.PropTypes.any.isRequired(props, name, componentName);
	
	        if (!err && !props[name].__isYupSchema__) err = new Error('`schema` must be a proper yup schema: (' + componentName + ')');
	
	        return err;
	      }
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      component: 'form',
	      strict: true,
	      delay: 300,
	      getter: function getter(path, model) {
	        return expr.getter(path)(model);
	      },
	      setter: function setter(path, model, val) {
	        return updateIn(model, toUpdateSpec(path, val));
	      } },
	    enumerable: true
	  }, {
	    key: 'childContextTypes',
	    value: {
	      schema: React.PropTypes.func,
	      value: React.PropTypes.func,
	      onChange: React.PropTypes.func,
	      onSubmit: React.PropTypes.func,
	      noValidate: React.PropTypes.func },
	    enumerable: true
	  }]);
	
	  return Form;
	})(React.Component);
	
	module.exports = uncontrollable(Form, { value: 'onChange', errors: 'onError' });
	
	function wrapSetter(setter) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    var result = setter.apply(undefined, args);
	    invariant(result && typeof result === 'object', '`setter(..)` props must return the form value object after updating a value.');
	    return result;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1),
	    invariant = __webpack_require__(33)('formal-yup'),
	    types = __webpack_require__(25),
	    Input = __webpack_require__(28),
	    MessageTrigger = __webpack_require__(50);
	
	var has = ({}).hasOwnProperty;
	
	/**
	 * The Field Component renders a form control and handles input value updates and validations. 
	 * Changes to the Field value are automatically propagated back up to the containing Form 
	 * Component.
	 */
	
	var Field = (function (_React$Component) {
	  function Field() {
	    _classCallCheck(this, Field);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(Field, _React$Component);
	
	  Field.prototype.componentWillMount = function componentWillMount() {
	    if (process.env.NODE_ENV !== 'production') invariant(!this.getContext().noValidate() && !!this.getContext().schema(this.props.name), 'There is no corresponding schema defined for this field: "' + this.props.name + '" ' + 'Each Field\'s `name` prop must be a valid path defined by the parent Form schema');
	  };
	
	  Field.prototype.render = function render() {
	    var _props2 = this.props;
	    var events = _props2.events;
	    var group = _props2.group;
	    var mapValue = _props2.mapValue;
	    var name = _props2.name;
	    var props = _objectWithoutProperties(_props2, ['events', 'group', 'mapValue', 'name']);
	    var schema = this.getContext().schema(name);
	    var value = this.getContext().value(name);
	    var type = this.props.type || schema && schema._type || '';
	    var Widget = type;
	
	    Widget = typeof this.props.type === 'function' ? (type = undefined, this.props.type) : types[type.toLowerCase()] || Input;
	
	    Widget = React.createElement(Widget, _extends({}, props, {
	      name: name,
	      type: type,
	      value: value,
	      onChange: this._change.bind(this) }));
	
	    if (this.props.noValidate || this.getContext().noValidate()) return Widget;
	
	    name = props.alsoValidates == null ? name : [name].concat(props.alsoValidates);
	
	    return React.createElement(
	      MessageTrigger,
	      { 'for': name, group: group, events: events, activeClass: props.errorClass },
	      Widget
	    );
	  };
	
	  Field.prototype._change = function _change() {
	    var _props;
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    this.getContext().onChange(this.props.name, this.props.mapValue, args[0]);
	    this.props.onChange && (_props = this.props).onChange.apply(_props, args);
	  };
	
	  Field.prototype.getContext = function getContext() {
	    return this._reactInternalInstance._context;
	  };
	
	  _createClass(Field, null, [{
	    key: '_isYupFormField',
	    value: true,
	    enumerable: true
	  }, {
	    key: 'contextTypes',
	    value: {
	      schema: React.PropTypes.func,
	      onChange: React.PropTypes.func,
	      value: React.PropTypes.func,
	      noValidate: React.PropTypes.func },
	    enumerable: true
	  }, {
	    key: 'propTypes',
	    value: {
	      /**
	       * The Field name, which should be path corresponding to a specific form `value` path.
	       * 
	       * ```js
	       * // given the form value 
	       * value = {
	       *   name: { first: '' }
	       *   languages: ['english', 'spanish']
	       * }
	       *
	       * // the path "name.first" would update the `first` property of the form value
	       * <Form.Field name='name.first' />
	       *
	       * // use indexes for paths that cross arrays
	       * <Form.Field name='languages[0]' />
	       * 
	       * ```
	       */
	      name: React.PropTypes.string.isRequired,
	
	      /**
	       * Group Fields together with a common `group` name. Groups can be 
	       * validated together, helpful for multi-part forms.
	       *
	       * ```js
	       * <Form.Field name='first' group='name'/>
	       * <Form.Field name='surname' group='name' />
	       *
	       * <Form.Buttom group='name'>
	       *   Validate Name
	       * </Form.Button>       
	       * ```
	       */
	      group: React.PropTypes.string,
	
	      /**
	       * The Component Input the form should render. You can sepcify a builtin type 
	       * with a string name e.g `'text'`, `'datetime-local'`, etc. or provide a Component
	       * type class directly. When no type is provided the Field will attempt determine 
	       * the correct input from the corresponding scheme. A Field corresponding to a `yup.number()` 
	       * will render a `type='number'` input by default.
	       * 
	       * ```js
	       * <Form.Field type='number' />
	       *
	       * <Form.Field type={MyInputComponent}/>
	       * ```
	       * 
	       * Custom Inputs should comply with the basic input api contract: set a value via a `value` prop and 
	       * broadcast changes to that value via an `onChange` handler.
	       *
	       * You can also permenantly map Components to a string `type` name via the top-level 
	       * `addInputType()` api.
	       */
	      type: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]),
	
	      /**
	       * An array of event names that the Field should trigger a validation.
	       */
	      events: React.PropTypes.arrayOf(React.PropTypes.string),
	
	      /**
	       * Customize how the Field value maps to the overall Form `value`. 
	       * `mapValue` can be a function that returns a value for `name`'d path, allowing 
	       * you to set commuted values from the Field.
	       *
	       * ```js
	       * <Form.Field name='name'
	       *   mapValue={ fieldValue => fieldValue.first + ' ' + fieldValue.last }
	       * />
	       * ```
	       *
	       * You can also provide an object hash, mapping paths of the Form `value` 
	       * to fields in the field value.
	       *
	       * ```js
	       * <Form.Field name='name'
	       *   mapValue={{
	       *     'name.first': 'first', // where 'first' is a field on the input value
	       *     'name.last':  'surname'
	       *   }}
	       * />
	       * ```
	       */
	      mapValue: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.object]),
	
	      /**
	       * The css class added to the Field Input when it fails validation
	       */
	      errorClass: React.PropTypes.string,
	
	      /**
	       * Tells the Field to trigger validation for addition paths as well as its own (`name`). 
	       * Useful when used in conjuction with a `mapValue` hash that updates more than one value.
	       *
	       * ```js
	       * <Form.Field name='name'
	       *   mapValue={{
	       *     'name.first': 'first',
	       *     'name.last':  'surname'
	       *   }}
	       *   alsoValidates={['name.first', 'name.last']}
	       * />
	       * ```
	       */
	      alsoValidates: React.PropTypes.arrayOf(React.PropTypes.string),
	
	      /**
	       * Disables validation for the Field.
	       */
	      noValidate: React.PropTypes.bool
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      type: '',
	      events: ['onChange', 'onBlur'],
	      errorClass: 'invalid-field'
	    },
	    enumerable: true
	  }]);
	
	  return Field;
	})(React.Component);
	
	module.exports = Field;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var pureRender = __webpack_require__(35);
	var Message = __webpack_require__(52);
	var cn = __webpack_require__(36);
	
	/**
	 * Represents a Form validation error message. Only renders when the 
	 * value that it is `for` is invalid.
	 */
	
	var ValidationMessage = (function () {
	  function ValidationMessage(props, context) {
	    _classCallCheck(this, _ValidationMessage);
	
	    this.props = props;
	    this.context = context;
	  }
	
	  var _ValidationMessage = ValidationMessage;
	
	  _ValidationMessage.prototype.render = function render() {
	    var props = this.props;
	
	    return React.createElement(Message, _extends({}, props, {
	      className: cn(props.className, props.errorClass)
	    }));
	  };
	
	  _createClass(_ValidationMessage, null, [{
	    key: 'propTypes',
	    value: {
	      /**
	       * Specify what Field or Fields the Message is in charge of displaying. 
	       * `for` should correspond to a field `name`.
	       */
	      component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,
	
	      /**
	       * A css class that should be always be applied to the Message container.
	       */
	      errorClass: React.PropTypes.string },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      component: 'span',
	      errorClass: 'validation-error'
	    },
	    enumerable: true
	  }]);
	
	  ValidationMessage = pureRender(ValidationMessage) || ValidationMessage;
	  return ValidationMessage;
	})();
	
	module.exports = ValidationMessage;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var pureRender = __webpack_require__(35);
	var connectToMessageContainer = __webpack_require__(51);
	var cn = __webpack_require__(36);
	
	var splat = function splat(obj) {
	  return obj == null ? [] : [].concat(obj);
	};
	
	module.exports = connectToMessageContainer(pureRender(
	/**
	 * Display all Form validation `errors` in a single summary list.
	 */
	(function (_React$Component) {
	  function ValidationSummary() {
	    _classCallCheck(this, ValidationSummary);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(ValidationSummary, _React$Component);
	
	  ValidationSummary.prototype.render = function render() {
	    var _props = this.props;
	    var Component = _props.component;
	    var messages = _props.messages;
	    var active = _props.active;
	    var fieldFor = _props['for'];
	
	    var props = _objectWithoutProperties(_props, ['component', 'messages', 'active', 'for']);
	
	    if (!active) return null;
	
	    return React.createElement(
	      Component,
	      _extends({}, props, {
	        className: cn(props.className, props.errorClass || 'validation-error') }),
	      Object.keys(messages).reduce(function (list, k) {
	        return list.concat(splat(messages[k]));
	      }, []).map(props.formatMessage)
	    );
	  };
	
	  _createClass(ValidationSummary, null, [{
	    key: 'propTypes',
	    value: {
	
	      /**
	       * An error message renderer, Should return a `ReactElement`
	       * ```
	       * function(
	       *   message: string, 
	       *   idx: number, 
	       *   messages: array
	       * ) -> ReactElement
	       * ```
	       */
	      formatMessage: React.PropTypes.func.isRequired,
	
	      /**
	       * A DOM node tag name or Component class the Message should render as.
	       */
	      component: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]).isRequired,
	
	      /**
	       * A css class that should be always be applied to the Message container.
	       */
	      errorClass: React.PropTypes.string },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      component: 'ul',
	      errorClass: 'validation-error',
	      formatMessage: function formatMessage(message, idx) {
	        return React.createElement(
	          'li',
	          { key: idx },
	          message
	        );
	      }
	    },
	    enumerable: true
	  }]);
	
	  return ValidationSummary;
	})(React.Component)));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var warning = __webpack_require__(38)('formal-yup');
	var Trigger = __webpack_require__(50);
	
	/**
	 * A Form Button, for triggering validations for specific Field groups
	 */
	
	var Button = (function (_React$Component) {
	  function Button() {
	    _classCallCheck(this, Button);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(Button, _React$Component);
	
	  Button.prototype.render = function render() {
	    var _props = this.props;
	    var type = _props.type;
	    var group = _props.group;
	
	    var props = _objectWithoutProperties(_props, ['type', 'group']);
	
	    warning(!group || type.toLowerCase() !== 'submit', 'You have specified a `group` prop with type="submit" on this Form.Button component. ' + 'submit type buttons will automatically trigger a form wide validation. ' + 'to trigger validation for jsut the group: `' + group + '` use type="button" instead.');
	
	    if (type.toLowerCase() === 'submit') return React.createElement(
	      'button',
	      _extends({}, props, { type: 'submit' }),
	      this.props.children
	    );
	
	    return React.createElement(
	      Trigger,
	      { group: group, events: ['onClick'] },
	      React.createElement(
	        'button',
	        props,
	        this.props.children
	      )
	    );
	  };
	
	  _createClass(Button, null, [{
	    key: 'propTypes',
	    value: {
	      /**
	       * The `<button/>` type
	       */
	      type: React.PropTypes.oneOf(['button', 'submit']),
	
	      /**
	       * Specify a group to validate, if empty the entire form will be validated.
	       * If the button type is 'submit' the group will be ignored and the 
	       * entire form will be validated prior to submission.
	       */
	      group: React.PropTypes.string },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      type: 'button' },
	    enumerable: true
	  }]);
	
	  return Button;
	})(React.Component);
	
	module.exports = Button;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var types = __webpack_require__(25);
	
	module.exports = function (type, Component) {
	  var compType = typeof Component;
	
	  if (typeof type !== 'string') throw new TypeError('the `type` parameter must be a string');
	
	  if (compType !== 'string' || compType !== 'function') throw new TypeError('The `Component` parameter must be a valid React Component class or tag name');
	
	  types[type] = Component;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactAddons = __webpack_require__(1);
	
	var _reactAddons2 = _interopRequireDefault(_reactAddons);
	
	var _editor = __webpack_require__(29);
	
	var _editor2 = _interopRequireDefault(_editor);
	
	var _preview = __webpack_require__(30);
	
	var _preview2 = _interopRequireDefault(_preview);
	
	var _es6Preview = __webpack_require__(31);
	
	var _es6Preview2 = _interopRequireDefault(_es6Preview);
	
	var _doc = __webpack_require__(32);
	
	var _doc2 = _interopRequireDefault(_doc);
	
	/* eslint new-cap:0 no-unused-vars:0 */
	'use strict';
	
	var ReactPlayground = _reactAddons2['default'].createClass({
	  displayName: 'ReactPlayground',
	
	  propTypes: {
	    codeText: _reactAddons2['default'].PropTypes.string.isRequired,
	    scope: _reactAddons2['default'].PropTypes.object.isRequired,
	    collapsableCode: _reactAddons2['default'].PropTypes.bool,
	    docClass: _reactAddons2['default'].PropTypes.renderable,
	    propDescriptionMap: _reactAddons2['default'].PropTypes.string,
	    theme: _reactAddons2['default'].PropTypes.string,
	    noRender: _reactAddons2['default'].PropTypes.bool,
	    es6Console: _reactAddons2['default'].PropTypes.bool,
	    babelConfig: _reactAddons2['default'].PropTypes.object
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      theme: 'monokai',
	      noRender: false
	    };
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      code: this.props.codeText,
	      expandedCode: false
	    };
	  },
	
	  _handleCodeChange: function _handleCodeChange(code) {
	    this.setState({ code: code });
	  },
	
	  _toggleCode: function _toggleCode() {
	    this.setState({
	      expandedCode: !this.state.expandedCode
	    });
	  },
	
	  render: function render() {
	    return _reactAddons2['default'].createElement(
	      'div',
	      { className: 'playground' + (this.props.collapsableCode ? ' collapsableCode' : '') },
	      this.props.docClass ? _reactAddons2['default'].createElement(_doc2['default'], {
	        componentClass: this.props.docClass,
	        propDescriptionMap: this.props.propDescriptionMap }) : '',
	      _reactAddons2['default'].createElement(
	        'div',
	        { className: 'playgroundCode' + (this.state.expandedCode ? ' expandedCode' : '') },
	        _reactAddons2['default'].createElement(_editor2['default'], {
	          onChange: this._handleCodeChange,
	          className: 'playgroundStage',
	          codeText: this.state.code,
	          theme: this.props.theme })
	      ),
	      this.props.collapsableCode ? _reactAddons2['default'].createElement(
	        'div',
	        { className: 'playgroundToggleCodeBar' },
	        _reactAddons2['default'].createElement(
	          'span',
	          { className: 'playgroundToggleCodeLink', onClick: this._toggleCode },
	          this.state.expandedCode ? 'collapse' : 'expand'
	        )
	      ) : '',
	      _reactAddons2['default'].createElement(
	        'div',
	        { className: 'playgroundPreview' },
	        this.props.es6Console ? _reactAddons2['default'].createElement(_es6Preview2['default'], {
	          code: this.state.code,
	          scope: this.props.scope }) : _reactAddons2['default'].createElement(_preview2['default'], {
	          code: this.state.code,
	          scope: this.props.scope,
	          babelConfig: this.props.babelConfig,
	          noRender: this.props.noRender })
	      )
	    );
	  } });
	
	exports['default'] = ReactPlayground;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var babelHelpers = __webpack_require__(40);
	
	var Promise = __webpack_require__(60).Promise,
	    Condition = __webpack_require__(41),
	    ValidationError = __webpack_require__(24),
	    getter = __webpack_require__(37).getter,
	    locale = __webpack_require__(42).mixed,
	    _ = __webpack_require__(39),
	    cloneDeep = __webpack_require__(43),
	    BadSet = __webpack_require__(44);
	
	var formatError = ValidationError.formatError;
	
	module.exports = SchemaType;
	
	function SchemaType() {
	  var options = arguments[0] === undefined ? {} : arguments[0];
	
	  if (!(this instanceof SchemaType)) return new SchemaType();
	
	  this._deps = [];
	  this._conditions = [];
	  this._options = { abortEarly: true };
	  this._exclusive = Object.create(null);
	  this._whitelist = new BadSet();
	  this._blacklist = new BadSet();
	  this.tests = [];
	  this.transforms = [];
	  this._typeError = formatError(locale.notType);
	
	  if (_.has(options, 'default')) this._default = options['default'];
	
	  this._type = options.type || 'mixed';
	}
	
	SchemaType.prototype = {
	
	  __isYupSchema__: true,
	
	  constructor: SchemaType,
	
	  clone: function clone() {
	    return cloneDeep(this);
	  },
	
	  concat: function concat(schema) {
	    if (!schema) return this;
	
	    if (schema._type !== this._type) throw new TypeError('You cannot `concat()` schema\'s of different types: ' + this._type + ' and ' + schema._type);
	
	    var next = _.merge(this.clone(), schema.clone());
	
	    // undefined isn't merged over, but is a valid value for default
	    if (schema._default === undefined && _.has(schema, '_default')) next._default = schema._default;
	
	    // trim exclusive tests, take the most recent ones
	    next.tests = _.uniq(next.tests.reverse(), function (fn, idx) {
	      return next[fn.VALIDATION_KEY] ? fn.VALIDATION_KEY : idx;
	    }).reverse();
	
	    return next;
	  },
	
	  isType: function isType(v) {
	    if (this._nullable && v === null) return true;
	    return !this._typeCheck || this._typeCheck(v);
	  },
	
	  cast: function cast(_value, _opts) {
	    var schema = this._resolve((_opts || {}).context);
	    return schema._cast(_value, _opts);
	  },
	
	  _cast: function _cast(_value) {
	    var _this = this;
	
	    var value = _value === undefined ? _value : this.transforms.reduce(function (value, transform) {
	      return transform.call(_this, value, _value);
	    }, _value);
	
	    if (value === undefined && _.has(this, '_default')) value = this['default']();
	
	    return value;
	  },
	
	  _resolve: function _resolve(context) {
	    var schema = this;
	
	    return this._conditions.reduce(function (schema, match) {
	      if (!context) throw new Error('missing the context necessary to cast this value');
	      return match.resolve(schema, getter(match.key)(context));
	    }, schema);
	  },
	
	  //-- tests
	  _validate: function _validate(value, _opts, _state) {
	    var valids = this._whitelist,
	        invalids = this._blacklist,
	        context = (_opts || {}).context || _state.parent,
	        schema = undefined,
	        state = undefined,
	        endEarly = undefined,
	        isStrict = undefined;
	
	    state = _state;
	    schema = this._resolve(context);
	    isStrict = schema._option('strict', _opts);
	    endEarly = schema._option('abortEarly', _opts);
	
	    var path = state.path;
	
	    var errors = [];
	    var reject = function reject() {
	      return Promise.reject(new ValidationError(errors, value));
	    };
	
	    if (!state.isCast && !isStrict) value = schema._cast(value, _opts);
	
	    // value is cast, we can check if it meets type requirements
	    if (value !== undefined && !schema.isType(value)) {
	      errors.push(schema._typeError({ value: value, path: path, type: schema._type }));
	      if (endEarly) return reject();
	    }
	
	    // next check Whitelist for matching values
	    if (valids.length && !valids.has(value)) {
	      errors.push(schema._whitelistError(valids.values(), path));
	      if (endEarly) return reject();
	    }
	
	    // next check Blacklist for matching values
	    if (invalids.has(value)) {
	      errors.push(schema._blacklistError(invalids.values(), path));
	      if (endEarly) return reject();
	    }
	
	    // It makes no sense to validate further at this point if their are errors
	    if (errors.length) return reject();
	
	    var result = schema.tests.map(function (fn) {
	      return fn.call(schema, value, path);
	    });
	
	    result = endEarly ? Promise.all(result) : _.collectErrors(result, value, path);
	
	    return result.then(function () {
	      return value;
	    });
	  },
	
	  validate: function validate(value, options, cb) {
	    if (typeof options === 'function') cb = options, options = {};
	
	    return nodeify(this._validate(value, options, {}), cb);
	  },
	
	  isValid: function isValid(value, options, cb) {
	    if (typeof options === 'function') cb = options, options = {};
	
	    return nodeify(this.validate(value, options).then(function () {
	      return true;
	    })['catch'](function (err) {
	      if (err.name === 'ValidationError') return false;
	
	      throw err;
	    }), cb);
	  },
	
	  'default': function _default(def) {
	    if (arguments.length === 0) {
	      var dflt = this._default;
	      return typeof dflt === 'function' ? dflt.call(this) : cloneDeep(dflt);
	    }
	
	    var next = this.clone();
	    next._default = def;
	    return next;
	  },
	
	  strict: function strict() {
	    var next = this.clone();
	    next._options.strict = true;
	    return next;
	  },
	
	  required: function required(msg) {
	    return this.test({
	      name: 'required',
	      exclusive: true,
	      message: msg || locale.required,
	      test: function test(value) {
	        return value != null;
	      }
	    });
	  },
	
	  typeError: function typeError(msg) {
	    var next = this.clone();
	    next._typeError = formatError(msg);
	    return next;
	  },
	
	  nullable: function nullable(value) {
	    var next = this.clone();
	    next._nullable = value === false ? false : true;
	    return next;
	  },
	
	  transform: function transform(fn) {
	    var next = this.clone();
	    next.transforms.push(fn);
	    return next;
	  },
	
	  test: (function (_test) {
	    function test(_x, _x2, _x3, _x4) {
	      return _test.apply(this, arguments);
	    }
	
	    test.toString = function () {
	      return _test.toString();
	    };
	
	    return test;
	  })(function (name, message, test, useCallback) {
	    var opts = name,
	        next = this.clone(),
	        errorMsg,
	        isExclusive;
	
	    if (typeof name === 'string') opts = { name: name, test: test, message: message, useCallback: useCallback, exclusive: false };
	
	    if (next._whitelist.length) throw new TypeError('Cannot add tests when specific valid values are specified');
	
	    errorMsg = formatError(opts.message);
	
	    isExclusive = opts.name && next._exclusive[opts.name] === true;
	
	    if (opts.exclusive || isExclusive) {
	      if (!opts.name) throw new TypeError('You cannot have an exclusive validation without a name to identify it');
	
	      next._exclusive[opts.name] = true;
	      validate.VALIDATION_KEY = opts.name;
	    }
	
	    if (isExclusive) next.tests = next.tests.filter(function (fn) {
	      return fn.VALIDATION_KEY !== opts.name;
	    });
	
	    next.tests.push(validate);
	
	    return next;
	
	    function validate(value, path) {
	      var _this2 = this;
	
	      return new Promise(function (resolve, reject) {
	        !opts.useCallback ? resolve(opts.test.call(_this2, value)) : opts.test.call(_this2, value, function (err, valid) {
	          return err ? reject(err) : resolve(valid);
	        });
	      }).then(function (valid) {
	        if (!valid) throw new ValidationError(errorMsg(babelHelpers._extends({ path: path }, opts.params)), value, path);
	      });
	    }
	  }),
	
	  when: function when(key, options) {
	    var next = this.clone();
	
	    next._deps.push(key);
	    next._conditions.push(new Condition(key, next._type, options));
	    return next;
	  },
	
	  oneOf: function oneOf(enums, msg) {
	    var next = this.clone();
	
	    if (next.tests.length) throw new TypeError('Cannot specify values when there are validation rules specified');
	
	    next._whitelistError = function (valids, path) {
	      return formatError(msg || locale.oneOf, { values: valids.join(', '), path: path });
	    };
	
	    enums.forEach(function (val) {
	      next._blacklist['delete'](val);
	      next._whitelist.add(val);
	    });
	
	    return next;
	  },
	
	  notOneOf: function notOneOf(enums, msg) {
	    var next = this.clone();
	
	    next._blacklistError = function (invalids, path) {
	      return formatError(msg || locale.notOneOf, { values: invalids.join(', '), path: path });
	    };
	
	    enums.forEach(function (val) {
	      next._whitelist['delete'](val);
	      next._blacklist.add(val);
	    });
	
	    return next;
	  },
	
	  _option: function _option(key, overrides) {
	    return _.has(overrides, key) ? overrides[key] : this._options[key];
	  }
	};
	
	var aliases = {
	  oneOf: ['equals']
	};
	
	for (var method in aliases) if (_.has(aliases, method)) aliases[method].forEach(function (alias) {
	  return SchemaType.prototype[alias] = SchemaType.prototype[method];
	}); //eslint-disable-line no-loop-func
	
	function nodeify(promise, cb) {
	  if (typeof cb !== 'function') return promise;
	
	  promise.then(function (val) {
	    return cb(null, val);
	  }, function (err) {
	    return cb(err);
	  });
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var MixedSchema = __webpack_require__(16),
	    inherits = __webpack_require__(39).inherits;
	
	module.exports = BooleanSchema;
	
	function BooleanSchema() {
	  if (!(this instanceof BooleanSchema)) return new BooleanSchema();
	
	  MixedSchema.call(this, { type: 'boolean' });
	
	  this.transforms.push(function (value) {
	    if (this.isType(value)) return value;
	    return /true|1/i.test(value);
	  });
	}
	
	inherits(BooleanSchema, MixedSchema, {
	
	  _typeCheck: function _typeCheck(v) {
	    return typeof v === 'boolean';
	  }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var MixedSchema = __webpack_require__(16);
	
	var _require = __webpack_require__(42);
	
	var mixed = _require.mixed;
	var locale = _require.string;
	var inherits = __webpack_require__(39).inherits;
	
	var rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
	var rUrl = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	
	module.exports = StringSchema;
	
	function StringSchema() {
	  if (!(this instanceof StringSchema)) return new StringSchema();
	
	  MixedSchema.call(this, { type: 'string' });
	
	  this.transforms.push(function (value) {
	    if (this.isType(value)) return value;
	    return value == null ? '' : value.toString ? value.toString() : '' + value;
	  });
	}
	
	inherits(StringSchema, MixedSchema, {
	
	  _typeCheck: function _typeCheck(value) {
	    return typeof value === 'string';
	  },
	
	  required: function required(msg) {
	    var next = MixedSchema.prototype.required.call(this, msg || mixed.required);
	
	    return next.min(1, msg || mixed.required);
	  },
	
	  min: (function (_min) {
	    function min(_x, _x2) {
	      return _min.apply(this, arguments);
	    }
	
	    min.toString = function () {
	      return _min.toString();
	    };
	
	    return min;
	  })(function (min, msg) {
	    return this.test({
	      name: 'min',
	      exclusive: true,
	      message: msg || locale.min,
	      params: { min: min },
	      test: function test(value) {
	        return value == null || value.length >= min;
	      }
	    });
	  }),
	
	  max: (function (_max) {
	    function max(_x3, _x4) {
	      return _max.apply(this, arguments);
	    }
	
	    max.toString = function () {
	      return _max.toString();
	    };
	
	    return max;
	  })(function (max, msg) {
	    return this.test({
	      name: 'max',
	      exclusive: true,
	      message: msg || locale.max,
	      params: { max: max },
	      test: function test(value) {
	        return value == null || value.length <= max;
	      }
	    });
	  }),
	
	  matches: function matches(regex, msg) {
	    return this.test({
	      message: msg || locale.matches,
	      params: { regex: regex },
	      test: function test(value) {
	        return value == null || regex.test(value);
	      }
	    });
	  },
	
	  email: function email(msg) {
	    return this.matches(rEmail, msg || locale.email);
	  },
	
	  url: function url(msg) {
	    return this.matches(rUrl, msg || locale.url);
	  },
	
	  //-- transforms --
	  trim: function trim(msg) {
	    msg = msg || locale.trim;
	
	    return this.transform(function (val) {
	      return val != null ? val.trim() : val;
	    }).test('trim', msg, function (val) {
	      return val == null || val === val.trim();
	    });
	  },
	
	  lowercase: function lowercase(msg) {
	    return this.transform(function (val) {
	      return val != null ? val.toLowerCase() : val;
	    }).test({
	      name: 'string_case',
	      exclusive: true,
	      message: msg || locale.lowercase,
	      test: function test(val) {
	        return val == null || val === val.toLowerCase();
	      }
	    });
	  },
	
	  uppercase: function uppercase(msg) {
	    return this.transform(function (val) {
	      return val != null ? val.toUpperCase() : val;
	    }).test({
	      name: 'string_case',
	      exclusive: true,
	      message: msg || locale.uppercase,
	      test: function test(val) {
	        return val == null || val === val.toUpperCase();
	      }
	    });
	  }
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var SchemaObject = __webpack_require__(16);
	var locale = __webpack_require__(42).number;
	
	var _require = __webpack_require__(39);
	
	var isDate = _require.isDate;
	var inherits = _require.inherits;
	
	module.exports = NumberSchema;
	
	function NumberSchema() {
	  if (!(this instanceof NumberSchema)) return new NumberSchema();
	
	  SchemaObject.call(this, { type: 'number' });
	
	  this.transforms.push(function (value) {
	    if (this.isType(value)) return value;
	    if (typeof value === 'boolean') return value ? 1 : 0;
	
	    return isDate(value) ? +value : parseFloat(value);
	  });
	}
	
	inherits(NumberSchema, SchemaObject, {
	
	  _typeCheck: function _typeCheck(v) {
	    return typeof v === 'number' && !(v !== +v) //isNaN check
	    ;
	  },
	
	  min: (function (_min) {
	    function min(_x, _x2) {
	      return _min.apply(this, arguments);
	    }
	
	    min.toString = function () {
	      return _min.toString();
	    };
	
	    return min;
	  })(function (min, msg) {
	    return this.test({
	      name: 'min',
	      exclusive: true,
	      params: { min: min },
	      message: msg || locale.min,
	      test: function test(value) {
	        return value == null || value >= min;
	      }
	    });
	  }),
	
	  max: (function (_max) {
	    function max(_x3, _x4) {
	      return _max.apply(this, arguments);
	    }
	
	    max.toString = function () {
	      return _max.toString();
	    };
	
	    return max;
	  })(function (max, msg) {
	    return this.test({
	      name: 'max',
	      exclusive: true,
	      params: { max: max },
	      message: msg || locale.max,
	      test: function test(value) {
	        return value == null || value <= max;
	      }
	    });
	  }),
	
	  positive: function positive(max, msg) {
	    return this.min(0, msg || locale.positive);
	  },
	
	  negative: function negative(max, msg) {
	    return this.max(0, msg || locale.negative);
	  },
	
	  integer: function integer(msg) {
	    msg = msg || locale.integer;
	
	    return this.transform(function (v) {
	      return v != null ? v | 0 : v;
	    }).test('integer', msg, function (val) {
	      return val === (val | 0);
	    });
	  },
	
	  round: function round(method) {
	    var avail = ['ceil', 'floor', 'round'];
	    method = method && method.toLowerCase() || 'round';
	
	    if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError('Only valid options for round() are: ' + avail.join(', '));
	
	    return this.transform(function (v) {
	      return v != null ? Math[method](v) : v;
	    });
	  }
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var MixedSchema = __webpack_require__(16);
	var isoParse = __webpack_require__(45);
	var locale = __webpack_require__(42).date;
	
	var _require = __webpack_require__(39);
	
	var isDate = _require.isDate;
	var inherits = _require.inherits;
	
	var invalidDate = new Date('');
	
	module.exports = DateSchema;
	
	function DateSchema() {
	  if (!(this instanceof DateSchema)) return new DateSchema();
	
	  MixedSchema.call(this, { type: 'date' });
	
	  this.transforms.push(function (value) {
	    if (this.isType(value)) return isDate(value) ? new Date(value) : value;
	
	    value = isoParse(value);
	    return value ? new Date(value) : invalidDate;
	  });
	}
	
	inherits(DateSchema, MixedSchema, {
	
	  _typeCheck: function _typeCheck(v) {
	    return isDate(v) && !isNaN(v.getTime());
	  },
	
	  min: (function (_min) {
	    function min(_x, _x2) {
	      return _min.apply(this, arguments);
	    }
	
	    min.toString = function () {
	      return _min.toString();
	    };
	
	    return min;
	  })(function (min, msg) {
	    var limit = this.cast(min);
	
	    if (!this._typeCheck(limit)) throw new TypeError('`min` must be a Date or a value that can be `cast()` to a Date');
	
	    return this.test({
	      name: 'min',
	      exclusive: true,
	      message: msg || locale.min,
	      params: { min: min },
	      test: function test(value) {
	        return value && value >= limit;
	      }
	    });
	  }),
	
	  max: (function (_max) {
	    function max(_x3, _x4) {
	      return _max.apply(this, arguments);
	    }
	
	    max.toString = function () {
	      return _max.toString();
	    };
	
	    return max;
	  })(function (max, msg) {
	    var limit = this.cast(max);
	
	    if (!this._typeCheck(limit)) throw new TypeError('`max` must be a Date or a value that can be `cast()` to a Date');
	
	    return this.test({
	      name: 'max',
	      exclusive: true,
	      message: msg || locale.max,
	      params: { max: max },
	      test: function test(value) {
	        return !value || value <= limit;
	      }
	    });
	  })
	
	});

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var babelHelpers = __webpack_require__(40);
	
	var MixedSchema = __webpack_require__(16);
	var Promise = __webpack_require__(60).Promise;
	var cloneDeep = __webpack_require__(43);
	var toposort = __webpack_require__(59);
	var split = __webpack_require__(37).split;
	var c = __webpack_require__(67);
	
	var _require = __webpack_require__(39);
	
	var isObject = _require.isObject;
	var transform = _require.transform;
	var assign = _require.assign;
	var inherits = _require.inherits;
	var collectErrors = _require.collectErrors;
	var has = _require.has;
	
	var scopeError = function scopeError(value) {
	  return function (err) {
	    err.value = value;
	    throw err;
	  };
	};
	
	module.exports = ObjectSchema;
	
	function ObjectSchema(spec) {
	  if (!(this instanceof ObjectSchema)) return new ObjectSchema(spec);
	
	  MixedSchema.call(this, { type: 'object', 'default': function _default() {
	      var _this = this;
	
	      var dft = transform(this._nodes, function (obj, key) {
	        var fieldDft = _this.fields[key]['default']();
	        if (fieldDft !== undefined) obj[key] = fieldDft;
	      }, {});
	
	      return Object.keys(dft).length === 0 ? undefined : dft;
	    }
	  });
	
	  this.transforms.push(function (value) {
	    if (typeof value === 'string') {
	      try {
	        value = JSON.parse(value);
	      } catch (err) {
	        value = null;
	      }
	    }
	
	    if (this.isType(value)) return value;
	
	    return null;
	  });
	
	  this.fields = Object.create(null);
	  this._nodes = [];
	  this._excludedEdges = [];
	
	  if (spec) return this.shape(spec);
	}
	
	inherits(ObjectSchema, MixedSchema, {
	
	  _typeCheck: function _typeCheck(value) {
	    return isObject(value) || typeof value === 'function';
	  },
	
	  _cast: function _cast(_value, _opts) {
	    var schema = this,
	        value = MixedSchema.prototype._cast.call(schema, _value);
	
	    //should ignore nulls here
	    if (schema._typeCheck(value)) {
	      var fields = schema.fields,
	          strip = schema._option('stripUnknown', _opts) === true,
	          extra = Object.keys(value).filter(function (v) {
	        return schema._nodes.indexOf(v) === -1;
	      }),
	          props = schema._nodes.concat(extra);
	
	      return transform(props, function (obj, prop) {
	        var exists = has(value, prop);
	
	        if (exists && fields[prop]) obj[prop] = fields[prop].cast(value[prop], { context: obj });else if (exists && !strip) obj[prop] = cloneDeep(value[prop]);else if (fields[prop]) {
	          var fieldDefault = fields[prop]['default']();
	
	          if (fieldDefault !== undefined) obj[prop] = fieldDefault;
	        }
	      }, {});
	    }
	
	    return value;
	  },
	
	  _validate: function _validate(_value, _opts, _state) {
	    var errors = [],
	        context,
	        schema,
	        endEarly;
	
	    _state = _state || {};
	    context = _state.parent || (_opts || {}).context;
	    schema = this._resolve(context);
	    endEarly = schema._option('abortEarly', _opts);
	
	    return MixedSchema.prototype._validate.call(this, _value, _opts, _state)['catch'](endEarly ? null : function (err) {
	      errors = err;
	      return err.value;
	    }).then(function (value) {
	      if (!isObject(value)) {
	        // only iterate though actual objects
	        if (errors.length) throw errors[0];
	        return value;
	      }
	
	      var result = schema._nodes.map(function (key) {
	        var field = schema.fields[key],
	            path = (_state.path ? _state.path + '.' : '') + key;
	
	        return field._validate(value[key], _opts, babelHelpers._extends({}, _state, { key: key, path: path, parent: value }));
	      });
	
	      result = endEarly ? Promise.all(result)['catch'](scopeError(value)) : collectErrors(result, value, _state.path, errors);
	
	      return result.then(function () {
	        return value;
	      });
	    });
	  },
	
	  concat: function concat(schema) {
	    var next = MixedSchema.prototype.concat.call(this, schema);
	
	    next._nodes = sortFields(next.fields, next._excludedEdges);
	
	    return next;
	  },
	
	  shape: function shape(schema) {
	    var excludes = arguments[1] === undefined ? [] : arguments[1];
	
	    var next = this.clone(),
	        fields = assign(next.fields, schema);
	
	    if (!Array.isArray(excludes[0])) excludes = [excludes];
	
	    next.fields = fields;
	
	    next._excludedEdges = next._excludedEdges.concat(excludes.map(function (v) {
	      return '' + v[0] + '-' + v[1];
	    })); // 'node-othernode'
	
	    next._nodes = sortFields(fields, next._excludedEdges);
	
	    return next;
	  },
	
	  from: (function (_from) {
	    function from(_x, _x2, _x3) {
	      return _from.apply(this, arguments);
	    }
	
	    from.toString = function () {
	      return _from.toString();
	    };
	
	    return from;
	  })(function (from, to, alias) {
	    return this.transform(function (obj) {
	      if (obj == null) return obj;
	
	      var newObj = transform(obj, function (o, val, key) {
	        return key !== from && (o[key] = val);
	      }, {});
	
	      newObj[to] = obj[from];
	      if (alias) newObj[from] = obj[from];
	
	      return newObj;
	    });
	  }),
	
	  camelcase: function camelcase() {
	    return this.transform(function (obj) {
	      return obj == null ? obj : transform(obj, function (newobj, val, key) {
	        return newobj[c.camel(key)] = val;
	      });
	    });
	  },
	
	  constantcase: function constantcase() {
	    return this.transform(function (obj) {
	      return obj == null ? obj : transform(obj, function (newobj, val, key) {
	        return newobj[c.constant(key)] = val;
	      });
	    });
	  }
	});
	
	function sortFields(fields) {
	  var excludes = arguments[1] === undefined ? [] : arguments[1];
	
	  var edges = [],
	      nodes = [];
	
	  for (var key in fields) if (has(fields, key)) {
	    if (! ~nodes.indexOf(key)) nodes.push(key);
	
	    fields[key]._deps.forEach(function (node) {
	      //eslint-disable-line no-loop-func
	      node = split(node)[0];
	
	      if (! ~nodes.indexOf(node)) nodes.push(node);
	
	      if (! ~excludes.indexOf('' + key + '-' + node)) edges.push([key, node]);
	    });
	  }
	
	  return toposort.array(nodes, edges).reverse();
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var babelHelpers = __webpack_require__(40);
	
	var MixedSchema = __webpack_require__(16);
	var Promise = __webpack_require__(60).Promise;
	
	var _require = __webpack_require__(42);
	
	var mixed = _require.mixed;
	var locale = _require.array;
	
	var _require2 = __webpack_require__(39);
	
	var inherits = _require2.inherits;
	var collectErrors = _require2.collectErrors;
	
	var scopeError = function scopeError(value) {
	  return function (err) {
	    err.value = value;
	    throw err;
	  };
	};
	
	module.exports = ArraySchema;
	
	function ArraySchema() {
	  if (!(this instanceof ArraySchema)) return new ArraySchema();
	
	  MixedSchema.call(this, { type: 'array' });
	
	  this.transforms.push(function (values) {
	    if (typeof values === 'string') try {
	      values = JSON.parse(values);
	    } catch (err) {
	      values = null;
	    }
	
	    if (Array.isArray(values)) return this._subType ? values.map(this._subType.cast, this._subType) : values;
	
	    return this.isType(values) ? values : null;
	  });
	}
	
	inherits(ArraySchema, MixedSchema, {
	
	  _typeCheck: function _typeCheck(v) {
	    return Array.isArray(v);
	  },
	
	  _validate: function _validate(_value, _opts, _state) {
	    var errors = [],
	        context,
	        subType,
	        schema,
	        endEarly;
	
	    _state = _state || {};
	    context = _state.parent || (_opts || {}).context;
	    schema = this._resolve(context);
	    subType = schema._subType;
	    endEarly = schema._option('abortEarly', _opts);
	
	    return MixedSchema.prototype._validate.call(this, _value, _opts, _state)['catch'](endEarly ? null : function (err) {
	      errors = err;
	      return err.value;
	    }).then(function (value) {
	      if (!subType || !schema._typeCheck(value)) {
	        if (errors.length) throw errors[0];
	        return value;
	      }
	
	      var result = value.map(function (item, key) {
	        var path = (_state.path || '') + '[' + key + ']',
	            state = babelHelpers._extends({}, _state, { path: path, key: key, parent: value });
	
	        return subType._validate(item, _opts, state);
	      });
	
	      result = endEarly ? Promise.all(result)['catch'](scopeError(value)) : collectErrors(result, value, _state.path, errors);
	
	      return result.then(function () {
	        return value;
	      });
	    });
	  },
	
	  of: function of(schema) {
	    var next = this.clone();
	    next._subType = schema;
	    return next;
	  },
	
	  required: function required(msg) {
	    var next = MixedSchema.prototype.required.call(this, msg || mixed.required);
	
	    return next.min(1, msg || mixed.required);
	  },
	
	  min: (function (_min) {
	    function min(_x, _x2) {
	      return _min.apply(this, arguments);
	    }
	
	    min.toString = function () {
	      return _min.toString();
	    };
	
	    return min;
	  })(function (min, message) {
	    message = message || locale.min;
	
	    return this.test({
	      message: message,
	      name: 'min',
	      exclusive: true,
	      params: { min: min },
	      test: function test(value) {
	        return value && value.length >= min;
	      }
	    });
	  }),
	
	  max: (function (_max) {
	    function max(_x3, _x4) {
	      return _max.apply(this, arguments);
	    }
	
	    max.toString = function () {
	      return _max.toString();
	    };
	
	    return max;
	  })(function (max, message) {
	    message = message || locale.max;
	    return this.test({
	      message: message,
	      name: 'max',
	      exclusive: true,
	      params: { max: max },
	      test: function test(value) {
	        return value && value.length <= max;
	      }
	    });
	  }),
	
	  compact: function compact(rejector) {
	    var reject = !rejector ? function (v) {
	      return !!v;
	    } : function (v, i, a) {
	      return !rejector(v, i, a);
	    };
	
	    return this.transform(function (values) {
	      return values != null ? values.filter(reject) : values;
	    });
	  }
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(37);
	
	var forEach = _require.forEach;
	
	var trim = function trim(part) {
	  return part.substr(0, part.length - 1).substr(1);
	};
	
	module.exports = function (obj, path) {
	  forEach(path, function (part, isBracket, isArray) {
	    if (isArray) obj = obj._subType;else {
	      if (obj._subType) // we skipped an array
	        obj = obj._subType;
	
	      obj = obj.fields[isBracket ? trim(part) : part];
	    }
	  });
	
	  return obj;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var babelHelpers = __webpack_require__(40);
	
	var strReg = /\$\{\s*(\w+)\s*\}/g;
	
	var replace = function replace(str) {
	  return function (params) {
	    return str.replace(strReg, function (_, key) {
	      return params[key] || '';
	    });
	  };
	};
	
	module.exports = ValidationError;
	
	function ValidationError(errors, value) {
	  var _this = this;
	
	  var field = arguments[2] === undefined ? '' : arguments[2];
	
	  this.name = 'ValidationError';
	  this.value = value;
	  this.path = field;
	  this.errors = [];
	  this.inner = [];
	
	  [].concat(errors).forEach(function (err) {
	    _this.errors = _this.errors.concat(err.errors || err);
	
	    if (err.inner) _this.inner = _this.inner.concat(err.inner.length ? err.inner : err);
	  });
	
	  this.message = this.errors.length > 1 ? '' + this.errors.length + ' errors occurred' : this.errors[0];
	
	  if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
	}
	
	ValidationError.prototype = Object.create(Error.prototype);
	ValidationError.prototype.constructor = ValidationError;
	
	ValidationError.formatError = function (message, params) {
	  if (typeof message === 'string') message = replace(message);
	
	  var fn = function fn(_ref) {
	    var path = _ref.path;
	    var params = babelHelpers.objectWithoutProperties(_ref, ['path']);
	
	    params.path = 'this' + (path ? path.charAt(0) === '[' ? path : '.' + path : '');
	
	    return message(params);
	  };
	
	  return arguments.length === 1 ? fn : fn(params);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var React = __webpack_require__(1),
	    Input = __webpack_require__(28),
	    DateInput = __webpack_require__(46),
	    NumberInput = __webpack_require__(47),
	    BoolInput = __webpack_require__(48),
	    SelectInput = __webpack_require__(49);
	
	var localDt = 'datetime-local';
	
	var wrapWithDefaults = function wrapWithDefaults(Component, defaults) {
	  return (function (_React$Component) {
	    var _class = function () {
	      _classCallCheck(this, _class);
	
	      if (_React$Component != null) {
	        _React$Component.apply(this, arguments);
	      }
	    };
	
	    _inherits(_class, _React$Component);
	
	    _class.prototype.render = function render() {
	      return React.createElement(Component, _extends({}, defaults, this.props, {
	        type: defaults.type || this.props.type
	      }));
	    };
	
	    return _class;
	  })(React.Component);
	};
	
	var types = Object.create(null);
	
	types.string = wrapWithDefaults(Input, { type: 'text' });
	types.number = NumberInput;
	types.date = types.time = types.datetime = types[localDt] = DateInput;
	
	types.array = types.listbox = wrapWithDefaults(SelectInput, { multiple: true });
	
	types.bool = types.boolean = BoolInput;
	
	types.textarea = wrapWithDefaults(Input, { tagName: 'textarea' });
	
	types.select = SelectInput;
	
	module.exports = types;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	var ReactElement = __webpack_require__(1);
	
	if (process.env.NODE_ENV !== 'production') ReactElement = __webpack_require__(56);
	
	module.exports = function getChildren(children, context) {
	  var test = arguments[2] === undefined ? function () {
	    return true;
	  } : arguments[2];
	
	  if (process.env.NODE_ENV !== 'production') {
	    // this is to avoid the warning but its hacky so lets do it a less hacky way in production
	    return attachChildren(children, context, test);
	  } else return children;
	};
	
	/*
	 * “Do not be afraid; our fate Cannot be taken from us; it is a gift.” 
	 * ― Dante Alighieri, Inferno
	 */
	function attachChildren(children, context, test) {
	
	  if (typeof children === 'string' || React.isValidElement(children)) return clone(children);
	
	  return React.Children.map(children, clone);
	
	  function clone(child) {
	    var props = child.props;
	
	    if (!React.isValidElement(child)) return child;
	
	    if (props.children) props = _extends({}, child.props, { children: attachChildren(props.children, context, test) });
	
	    return new ReactElement(child.type, child.key, child.ref, child._owner, test(child.type) ? _extends({}, child._context, context) : child._context, props);
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var prop = __webpack_require__(37);
	
	var cache = Object.create(null);
	
	module.exports = function specFromPath(path, value) {
	  var obj = {},
	      current = obj;
	
	  if (cache[path]) {
	    obj = cache[path].spec;
	    cache[path].tip.$set = value;
	    return obj;
	  }
	
	  prop.split(path).forEach(function (part) {
	    return current = current[part] = {};
	  });
	
	  current.$set = value;
	  cache[path] = { spec: obj, tip: current };
	
	  return obj;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	
	var Input = (function (_React$Component) {
	  function Input() {
	    _classCallCheck(this, Input);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(Input, _React$Component);
	
	  Input.prototype.render = function render() {
	    var _props = this.props;
	    var _props$tagName = _props.tagName;
	    var Tag = _props$tagName === undefined ? 'input' : _props$tagName;
	
	    var props = _objectWithoutProperties(_props, ['tagName']);
	
	    return React.createElement(Tag, _extends({}, props, { onChange: function (e) {
	        return props.onChange(e.target.value);
	      } }));
	  };
	
	  return Input;
	})(React.Component);
	
	module.exports = Input;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactAddons = __webpack_require__(1);
	
	var _reactAddons2 = _interopRequireDefault(_reactAddons);
	
	/* eslint new-cap:0 no-unused-vars:0 */
	'use strict';
	
	var Editor = _reactAddons2['default'].createClass({
	  displayName: 'Editor',
	
	  componentDidMount: function componentDidMount() {
	    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), {
	      mode: 'javascript',
	      lineNumbers: true,
	      lineWrapping: true,
	      smartIndent: false,
	      matchBrackets: true,
	      tabSize: 2,
	      theme: this.props.theme,
	      readOnly: this.props.readOnly
	    });
	    this.editor.on('change', this._handleChange);
	  },
	
	  componentDidUpdate: function componentDidUpdate() {
	    if (this.props.readOnly) {
	      this.editor.setValue(this.props.codeText);
	    }
	  },
	
	  _handleChange: function _handleChange() {
	    if (!this.props.readOnly && this.props.onChange) {
	      this.props.onChange(this.editor.getValue());
	    }
	  },
	
	  render: function render() {
	    var editor = _reactAddons2['default'].createElement('textarea', { ref: 'editor', defaultValue: this.props.codeText });
	
	    return _reactAddons2['default'].createElement(
	      'div',
	      { style: this.props.style, className: this.props.className },
	      editor
	    );
	  }
	});
	
	exports['default'] = Editor;
	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactAddons = __webpack_require__(1);
	
	var _reactAddons2 = _interopRequireDefault(_reactAddons);
	
	var _babelCoreBrowser = __webpack_require__(58);
	
	var _babelCoreBrowser2 = _interopRequireDefault(_babelCoreBrowser);
	
	/* eslint new-cap:0 no-unused-vars:0 */
	'use strict';
	
	var Preview = _reactAddons2['default'].createClass({
	  displayName: 'Preview',
	
	  propTypes: {
	    code: _reactAddons2['default'].PropTypes.string.isRequired,
	    scope: _reactAddons2['default'].PropTypes.object.isRequired,
	    babelConfig: _reactAddons2['default'].PropTypes.object
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      error: null
	    };
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      babelConfig: { stage: 1 }
	    };
	  },
	
	  componentDidMount: function componentDidMount() {
	    this._executeCode();
	  },
	
	  componentDidUpdate: function componentDidUpdate(prevProps) {
	    clearTimeout(this.timeoutID);
	    if (this.props.code !== prevProps.code) {
	      this._executeCode();
	    }
	  },
	
	  _compileCode: function _compileCode() {
	    if (this.props.noRender) {
	      return _babelCoreBrowser2['default'].transform('(function(' + Object.keys(this.props.scope).join(',') + ', mountNode) {' + 'return React.createClass({' + 'render: function(){' + 'return (' + this.props.code + ')' + '}' + '});' + '\n});', this.props.babelConfig).code;
	    } else {
	      return _babelCoreBrowser2['default'].transform('(function(' + Object.keys(this.props.scope).join(',') + ', mountNode) {' + this.props.code + '\n});', this.props.babelConfig).code;
	    }
	  },
	
	  _setTimeout: function _setTimeout() {
	    clearTimeout(this.timeoutID);
	    this.timeoutID = setTimeout.apply(null, arguments);
	  },
	
	  _executeCode: function _executeCode() {
	    var mountNode = this.refs.mount.getDOMNode();
	
	    try {
	
	      var scope = [];
	
	      for (var s in this.props.scope) {
	        if (this.props.scope.hasOwnProperty(s)) {
	          scope.push(this.props.scope[s]);
	        }
	      }
	
	      scope.push(mountNode);
	
	      var compiledCode = this._compileCode();
	      if (this.props.noRender) {
	        var Component = _reactAddons2['default'].createElement(eval(compiledCode).apply(null, scope));
	        _reactAddons2['default'].render(Component, mountNode);
	      } else {
	        eval(compiledCode).apply(null, scope);
	      }
	
	      this.setState({
	        error: null
	      });
	    } catch (err) {
	      var self = this;
	      this._setTimeout(function () {
	        self.setState({
	          error: err.toString()
	        });
	      }, 500);
	    }
	  },
	
	  render: function render() {
	    return _reactAddons2['default'].createElement(
	      'div',
	      null,
	      this.state.error !== null ? _reactAddons2['default'].createElement(
	        'div',
	        { className: 'playgroundError' },
	        this.state.error
	      ) : null,
	      _reactAddons2['default'].createElement('div', { ref: 'mount', className: 'previewArea' })
	    );
	  } });
	
	exports['default'] = Preview;
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactAddons = __webpack_require__(1);
	
	var _reactAddons2 = _interopRequireDefault(_reactAddons);
	
	var _babelCoreBrowser = __webpack_require__(58);
	
	var _babelCoreBrowser2 = _interopRequireDefault(_babelCoreBrowser);
	
	/* eslint new-cap:0 no-unused-vars:0 */
	'use strict';
	
	var Preview = _reactAddons2['default'].createClass({
	  displayName: 'Preview',
	
	  propTypes: {
	    code: _reactAddons2['default'].PropTypes.string.isRequired,
	    scope: _reactAddons2['default'].PropTypes.object.isRequired,
	    babelConfig: _reactAddons2['default'].PropTypes.object
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      babelConfig: { stage: 1 }
	    };
	  },
	
	  componentDidMount: function componentDidMount() {
	    this._executeCode();
	  },
	
	  componentDidUpdate: function componentDidUpdate(prevProps) {
	    clearTimeout(this.timeoutID);
	    if (this.props.code !== prevProps.code) {
	      this._executeCode();
	    }
	  },
	
	  _compileCode: function _compileCode() {
	    return _babelCoreBrowser2['default'].transform('(function(' + Object.keys(this.props.scope).join(',') + ') {' + 'var list = []; \n' + 'var console = { log(x) { list.push(x) } }; \n' + this.props.code + ' \n return list;' + '\n});', this.props.babelConfig).code;
	  },
	
	  _setTimeout: function _setTimeout() {
	    clearTimeout(this.timeoutID);
	    this.timeoutID = setTimeout.apply(null, arguments);
	  },
	
	  _executeCode: function _executeCode() {
	    var mountNode = this.refs.mount.getDOMNode();
	
	    try {
	      _reactAddons2['default'].unmountComponentAtNode(mountNode);
	    } catch (e) {}
	
	    try {
	      var scope = [];
	      for (var s in this.props.scope) {
	        if (this.props.scope.hasOwnProperty(s)) {
	          scope.push(this.props.scope[s]);
	        }
	      }
	      scope.push(mountNode);
	      var compiledCode = this._compileCode();
	      var Component = _reactAddons2['default'].createElement(_reactAddons2['default'].createClass({
	        render: function render() {
	          return _reactAddons2['default'].createElement(
	            'div',
	            { style: { padding: 15 } },
	            eval(compiledCode).apply(null, scope).map(function (x) {
	              return _reactAddons2['default'].createElement(
	                'div',
	                {
	                  style: {
	                    borderBottom: '1px solid #ccc',
	                    padding: '4px 0'
	                  } },
	                x
	              );
	            })
	          );
	        }
	      }));
	      _reactAddons2['default'].render(Component, mountNode);
	    } catch (err) {
	      this._setTimeout(function () {
	        _reactAddons2['default'].render(_reactAddons2['default'].createElement(
	          'div',
	          { className: 'playgroundError' },
	          err.toString()
	        ), mountNode);
	      }, 500);
	    }
	  },
	
	  render: function render() {
	    return _reactAddons2['default'].createElement('div', { ref: 'mount' });
	  }
	});
	
	exports['default'] = Preview;
	module.exports = exports['default'];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactAddons = __webpack_require__(1);
	
	var _reactAddons2 = _interopRequireDefault(_reactAddons);
	
	'use strict';
	
	var propTypesArray = [{
	  key: 'array',
	  test: _reactAddons2['default'].PropTypes.array,
	  isRequired: _reactAddons2['default'].PropTypes.array.isRequired
	}, {
	  key: 'boolean',
	  test: _reactAddons2['default'].PropTypes.bool,
	  isRequired: _reactAddons2['default'].PropTypes.bool.isRequired
	}, {
	  key: 'function',
	  test: _reactAddons2['default'].PropTypes.func,
	  isRequired: _reactAddons2['default'].PropTypes.func.isRequired
	}, {
	  key: 'number',
	  test: _reactAddons2['default'].PropTypes.number,
	  isRequired: _reactAddons2['default'].PropTypes.number.isRequired
	}, {
	  key: 'object',
	  test: _reactAddons2['default'].PropTypes.object,
	  isRequired: _reactAddons2['default'].PropTypes.array.isRequired
	}, {
	  key: 'string',
	  test: _reactAddons2['default'].PropTypes.string,
	  isRequired: _reactAddons2['default'].PropTypes.string.isRequired
	}, {
	  key: 'node',
	  test: _reactAddons2['default'].PropTypes.node,
	  isRequired: _reactAddons2['default'].PropTypes.node.isRequired
	}, {
	  key: 'element',
	  test: _reactAddons2['default'].PropTypes.element,
	  isRequired: _reactAddons2['default'].PropTypes.element.isRequired
	}];
	
	var getReactPropType = function getReactPropType(propTypeFunc) {
	  var propType = {
	    name: 'custom',
	    isRequire: false
	  };
	
	  for (var i = 0; i < propTypesArray.length; i++) {
	    if (propTypeFunc === propTypesArray[i].test) {
	      propType.name = propTypesArray[i].key;
	
	      break;
	    }
	
	    if (propTypeFunc === propTypesArray[i].isRequired) {
	      propType.name = propTypesArray[i].key;
	      propType.isRequired = true;
	
	      break;
	    }
	  }
	
	  return propType;
	};
	
	module.exports = _reactAddons2['default'].createClass({
	  displayName: 'exports',
	
	  propTypes: {
	    componentClass: _reactAddons2['default'].PropTypes.renderable,
	    propDescriptionMap: _reactAddons2['default'].PropTypes.object,
	    ignore: _reactAddons2['default'].PropTypes.array
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      propDescriptionMap: {},
	      ignore: []
	    };
	  },
	  render: function render() {
	    var propTypes = [];
	
	    for (var propName in this.props.componentClass.propTypes) {
	      if (this.props.ignore.indexOf(propName)) {
	        propTypes.push({
	          propName: propName,
	          type: getReactPropType(this.props.componentClass.propTypes[propName]),
	          description: this.props.propDescriptionMap[propName] || ''
	        });
	      }
	    }
	
	    return _reactAddons2['default'].createElement(
	      'div',
	      null,
	      _reactAddons2['default'].createElement(
	        'ul',
	        null,
	        propTypes.map(function (propObj) {
	          return _reactAddons2['default'].createElement(
	            'li',
	            { key: propObj.propName },
	            _reactAddons2['default'].createElement(
	              'b',
	              null,
	              propObj.propName
	            ),
	            _reactAddons2['default'].createElement(
	              'i',
	              null,
	              ': ' + propObj.type.name
	            ),
	            propObj.description && ' - ' + propObj.description,
	            _reactAddons2['default'].createElement(
	              'b',
	              null,
	              propObj.type.isRequired ? ' required' : ''
	            )
	          );
	        })
	      )
	    );
	  }
	});

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	'use strict';
	var cache = Object.create(null)
	
	var invariant = function(scope, condition, format, a, b, c, d, e, f) {
	  if ( 'production' !== process.env.NODE_ENV)
	    if (format === undefined)
	      throw new Error('invariant requires an error message argument');
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        '[' + scope + '] Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f]
	        , argIndex = 0;
	      error = new Error(
	        '[' + scope + '] Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; }))
	    }
	
	    error.framesToPop = 1;
	    throw error;
	  }
	};
	
	module.exports = function(scope) {
	  if (cache[scope]) return cache[scope]
	  return cache[scope] = invariant.bind(null, scope)
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canMutationObserver = typeof window !== 'undefined'
	    && window.MutationObserver;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;
	
	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }
	
	    var queue = [];
	
	    if (canMutationObserver) {
	        var hiddenDiv = document.createElement("div");
	        var observer = new MutationObserver(function () {
	            var queueList = queue.slice();
	            queue.length = 0;
	            queueList.forEach(function (fn) {
	                fn();
	            });
	        });
	
	        observer.observe(hiddenDiv, { attributes: true });
	
	        return function nextTick(fn) {
	            if (!queue.length) {
	                hiddenDiv.setAttribute('yes', 'no');
	            }
	            queue.push(fn);
	        };
	    }
	
	    if (canPost) {
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);
	
	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }
	
	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();
	
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	function PureRender(component){
	    if (typeof component !== "function") {
	        throw new TypeError('PureRender: called without a component as the first argument');
	    }
	
	    if (component.prototype.shouldComponentUpdate) {
	        throw new Error('PureRender: called on a component that already implements shouldComponentUpdate');
	    }
	
	    // mutation
	    component.prototype.shouldComponentUpdate = PureRender.shouldComponentUpdate;
	
	    return component;
	}
	module.exports = PureRender;
	
	var hasOwn = Object.prototype.hasOwnProperty;
	function shallowEquals(a, b){
	    // primitives (usually undefined)
	    if (a === b) {
	        return true;
	    }
	
	    var aKeys = Object.keys(a);
	    var bKeys = Object.keys(b);
	
	    // prevents us from having to look at each key in b
	    if (aKeys.length !== bKeys.length) {
	        return false;
	    }
	
	    // TODO: loop for perf
	    return aKeys.every(function(key){
	        return hasOwn.call(b, key) && a[key] === b[key];
	    });
	}
	
	PureRender.shouldComponentUpdate = function(nextProps, nextState){
	   return !shallowEquals(this.props, nextProps) || !shallowEquals(this.state, nextState);
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	function classNames() {
		var classes = '';
		var arg;
	
		for (var i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			if (!arg) {
				continue;
			}
	
			if ('string' === typeof arg || 'number' === typeof arg) {
				classes += ' ' + arg;
			} else if (Object.prototype.toString.call(arg) === '[object Array]') {
				classes += ' ' + classNames.apply(null, arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes += ' ' + key;
				}
			}
		}
		return classes.substr(1);
	}
	
	// safely export classNames in case the script is included directly on a page
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license
	 * expr 1.0.0
	 * Copyright 2014 Jason Quense
	 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
	 * Copyright :copyright: 2014 Telerik
	 * Available under MIT license <https://github.com/theporchrat/expr/blob/master/LICENSE.txt>
	 */
	'use strict';
	var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g
	  , DIGIT_REGEX = /^\d+$/;
	
	var setCache = {}
	  , getCache = {};
	
	module.exports = {
	  
	  expr: expr,
	
	  setter: function(path){
	    return setCache[path] || ( setCache[path] = new Function('data, value', 'return ' + expr(path, 'data') + ' = value, data;'))
	  },
	
	  getter: function(path, safe) {
	    var k = path + '_' + safe
	    return getCache[k] || ( getCache[k] = new Function('data', 'return ' + expr(path, safe, 'data') ))
	  },
	
	  split: function(path){
	    return path.match(SPLIT_REGEX)
	  },
	
	  join: function(segments){
	    return segments.reduce(function(path, part){
	       return path + (isQuoted(part) || DIGIT_REGEX.test(part) 
	        ? '['+ part + ']' 
	        : (path ? '.' : '') + part)
	    }, '')
	  },
	
	  forEach: function(path, cb, thisArg) {
	    forEach(path.match(SPLIT_REGEX), cb, thisArg)
	  }
	}
	
	
	function expr(expression, safe, param){
	  expression = expression || ''
	  
	  if (typeof safe === 'string') {
	    param = safe;
	    safe = false;
	  }
	
	  param = param || 'data'
	
	  if(expression && expression.charAt(0) !== '[')
	    expression = '.' + expression
	
	  return safe ? makeSafe(expression, param) : param + expression 
	}
	
	function forEach(parts, iter, thisArg){
	  var len = parts.length
	    , part, idx, isArray, isBracket;
	
	  for (idx = 0; idx < len; idx++){
	    part = parts[idx]
	
	    if( part ) {
	      isBracket = isQuoted(part)
	      isArray   = !isBracket && /^\d+$/.test(part)
	
	      iter.call(thisArg, part, isBracket, isArray, idx, parts)
	    }
	  }
	}
	
	function isQuoted(str){
	  return typeof str === 'string' && str && ["'", '"'].indexOf(str.charAt(0)) !== -1
	}
	
	function makeSafe(path, param) {
	  var result = param
	    , parts = path.match(SPLIT_REGEX)
	    , isLast;
	
	  forEach(parts, function(part, isBracket, isArray, idx, parts){
	    isLast = idx === (parts.length - 1);
	
	    part = ( isBracket || isArray) 
	           ? '[' + part + ']' 
	           : '.' + part
	
	    result += part + (!isLast ? ' || {})' : ')')
	  })
	
	  return new Array(parts.length + 1).join('(') + result;
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	'use strict';
	var cache = Object.create(null)
	
	/**
	 * Copyright 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	
	 */
	'use strict';
	var warning = function(){}
	  , w = function(){};
	
	if ( 'production' !== process.env.NODE_ENV ) {
	  w = function(scope, condition, format ) {
	    var args = []
	      , len = arguments.length;
	
	    for (var idx = 2; idx < len; idx++ ) 
	      args.push(arguments[idx]);
	    
	    if (format === undefined) {
	      throw new Error(
	        '[' + scope + '] `warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }
	
	    if (!condition) {
	      var argIndex = 0;
	      console.warn('[' + scope + '] Warning: ' + format.replace(/%s/g, function()  { return args[argIndex++] }));
	    }
	  };
	
	  warning = function(scope) {
	    if (cache[scope]) return cache[scope]
	    return cache[scope] = w.bind(null, scope)
	  };
	}
	
	module.exports = warning;
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Promise = __webpack_require__(60).Promise,
	    ValidationError = __webpack_require__(24);
	
	var toString = Object.prototype.toString;
	
	var isObject = function isObject(obj) {
	  return obj && toString.call(obj) === '[object Object]';
	};
	
	var isPlainObject = function isPlainObject(obj) {
	  return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	};
	
	var isDate = function isDate(obj) {
	  return Object.prototype.toString.call(obj) === '[object Date]';
	};
	
	var isSchema = function isSchema(obj) {
	  return obj && obj.__isYupSchema__;
	};
	
	function settled(promises) {
	  var settle = function settle(promise) {
	    return promise.then(function (value) {
	      return { fulfilled: true, value: value };
	    }, function (value) {
	      return { fulfilled: false, value: value };
	    });
	  };
	
	  return Promise.all(promises.map(settle));
	}
	
	function collectErrors(promises, value, path) {
	  var errors = arguments[3] === undefined ? [] : arguments[3];
	
	  // unwrap aggregate errors
	  errors = errors.inner && errors.inner.length ? errors.inner : [].concat(errors);
	
	  return settled(promises).then(function (results) {
	    errors = results.reduce(function (arr, r) {
	      return !r.fulfilled ? arr.concat(r.value) : arr;
	    }, errors);
	
	    if (errors.length) throw new ValidationError(errors, value, path);
	  });
	}
	
	function assign(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) if (has(source, key)) target[key] = source[key];
	  }
	
	  return target;
	}
	
	function uniq(arr, iter) {
	  var seen = {};
	
	  return arr.filter(function (item, idx) {
	    var key = iter(item, idx);
	
	    if (has(seen, key)) return false;
	    return seen[key] = true;
	  });
	}
	
	function transform(obj, cb, seed) {
	  cb = cb.bind(null, seed = seed || (Array.isArray(obj) ? [] : {}));
	
	  if (Array.isArray(obj)) obj.forEach(cb);else for (var key in obj) if (has(obj, key)) cb(obj[key], key, obj);
	
	  return seed;
	}
	
	function merge(target, source) {
	  for (var key in source) if (has(source, key)) {
	    var targetVal = target[key],
	        sourceVal = source[key];
	
	    if (sourceVal === undefined) continue;
	
	    if (isSchema(sourceVal)) {
	      target[key] = isSchema(targetVal) ? targetVal.concat(sourceVal) : sourceVal;
	    } else if (isObject(sourceVal)) {
	      target[key] = isObject(targetVal) ? merge(targetVal, sourceVal) : sourceVal;
	    } else if (Array.isArray(sourceVal)) {
	      target[key] = Array.isArray(targetVal) ? targetVal.concat(sourceVal) : sourceVal;
	    } else target[key] = source[key];
	  }
	
	  return target;
	}
	
	function has(o, k) {
	  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
	}
	
	function inherits(ctor, superCtor, spec) {
	  ctor.prototype = Object.create(superCtor.prototype, {
	    constructor: {
	      value: ctor,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	
	  assign(ctor.prototype, spec);
	}
	
	module.exports = {
	  inherits: inherits, uniq: uniq, has: has,
	  assign: assign, merge: merge, transform: transform,
	  isSchema: isSchema, isObject: isObject, isPlainObject: isPlainObject, isDate: isDate,
	  settled: settled, collectErrors: collectErrors
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === "object") {
	    factory(exports);
	  } else {
	    factory(root.babelHelpers = {});
	  }
	})(this, function (global) {
	  var babelHelpers = global;
	
	  babelHelpers.objectWithoutProperties = function (obj, keys) {
	    var target = {};
	
	    for (var i in obj) {
	      if (keys.indexOf(i) >= 0) continue;
	      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
	      target[i] = obj[i];
	    }
	
	    return target;
	  };
	
	  babelHelpers._extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];
	
	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }
	
	    return target;
	  };
	
	  babelHelpers.classCallCheck = function (instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };
	})

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var babelHelpers = __webpack_require__(40);
	
	var _require = __webpack_require__(39);
	
	var has = _require.has;
	var isSchema = _require.isSchema;
	
	module.exports = Conditional;
	
	var Conditional = (function () {
	  function Conditional(key, type, options) {
	    babelHelpers.classCallCheck(this, Conditional);
	    var is = options.is;
	    var then = options.then;
	    var otherwise = options.otherwise;
	
	    this.key = key;
	
	    if (typeof options === 'function') this.fn = options;else {
	      if (!has(options, 'is')) throw new TypeError('.is must be provided');
	      if (!options.then && !options.otherwise) throw new TypeError('.then or .otherwise must be provided');
	      if (options.then && options.then._type !== type || options.otherwise && options.otherwise._type !== type) throw new TypeError('cannot return polymorphic conditionals');
	
	      is = typeof is === 'function' ? is : (function (is, value) {
	        return is === value;
	      }).bind(null, is);
	
	      this.fn = function (value, ctx) {
	        return is(value) ? ctx.concat(then) : ctx.concat(otherwise);
	      };
	    }
	  }
	
	  Conditional.prototype.resolve = function resolve(ctx, value) {
	    var schema = this.fn.call(ctx, value, ctx);
	
	    if (schema !== undefined && !isSchema(schema)) throw new TypeError('conditions must return a schema object');
	
	    return schema || ctx;
	  };
	
	  return Conditional;
	})();
	
	module.exports = Conditional;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	  mixed: {
	    notType: '${path} (value: `${value}`) must be a `${type}` type',
	    required: '${path} is a required field',
	    oneOf: '${path} must be one the following values: ${values}',
	    notOneOf: '${path} must not be one the following values: ${values}'
	  },
	
	  string: {
	    required: '${path} is a required field',
	    min: '${path} must be at least ${min} characters',
	    max: '${path} must be less than ${max} characters',
	    matches: '${path} must match the following: "${regex}"',
	    email: '${path} must be a valid email',
	    url: '${path} must be a valid URL',
	    trim: '${path} must be a trimmed string',
	    lowercase: '${path} must be a lowercase string',
	    uppercase: '${path} must be a uppercase string'
	  },
	
	  number: {
	    min: '${path} must be at least ${min}',
	    max: '${path} must be less than or equal to ${max}',
	    positive: '${path} must be a positive number',
	    negative: '${path} must be a negative number',
	    integer: '${path} must be an integer'
	  },
	
	  date: {
	    min: '${path} field must be later than ${min}',
	    max: '${path} field must be at earlier than ${max}'
	  },
	
	  boolean: {},
	
	  object: {},
	
	  array: {
	    required: '${path} is a required field',
	    min: '${path} field must have at least ${min} items',
	    max: '${path} field must have less than ${max} items'
	  }
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright (c) 2011-2014, Walmart and other contributors.
	// Copyright (c) 2011, Yahoo Inc.
	// All rights reserved. https://github.com/hapijs/hoek/blob/master/LICENSE
	
	'use strict';
	
	module.exports = function clone(obj, seen) {
	  var isFirst = !seen;
	
	  if (typeof obj !== 'object' || obj === null) return obj;
	
	  seen = seen || { orig: [], copy: [] };
	
	  var lookup = seen.orig.indexOf(obj);
	
	  if (lookup !== -1) return seen.copy[lookup];
	
	  var newObj;
	  var cloneDeep = false;
	
	  if (!Array.isArray(obj)) {
	    if (obj instanceof Date) {
	      newObj = new Date(obj.getTime());
	    } else if (obj instanceof RegExp) {
	      newObj = new RegExp(obj);
	    } else {
	      var proto = Object.getPrototypeOf(obj);
	
	      if (proto !== null && (!proto || proto.__isYupSchema__ && !isFirst)) {
	        newObj = obj;
	      } else {
	        newObj = Object.create(proto);
	        cloneDeep = true;
	      }
	    }
	  } else {
	    newObj = [];
	    cloneDeep = true;
	  }
	
	  seen.orig.push(obj);
	  seen.copy.push(newObj);
	
	  if (cloneDeep) {
	    var keys = Object.getOwnPropertyNames(obj);
	
	    for (var i = 0, il = keys.length; i < il; ++i) {
	      var key = keys[i];
	
	      var descriptor = Object.getOwnPropertyDescriptor(obj, key);
	
	      if (descriptor.get || descriptor.set) {
	        Object.defineProperty(newObj, key, descriptor);
	      } else {
	        newObj[key] = clone(obj[key], seen);
	      }
	    }
	  }
	
	  return newObj;
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var babelHelpers = __webpack_require__(40);
	
	var toString = Object.prototype.toString;
	var isDate = function isDate(obj) {
	  return toString.call(obj) === '[object Date]';
	};
	
	module.exports = (function () {
	  function BadSet() {
	    babelHelpers.classCallCheck(this, BadSet);
	
	    this._array = [];
	    this.length = 0;
	  }
	
	  BadSet.prototype.values = function values() {
	    return this._array;
	  };
	
	  BadSet.prototype.add = function add(item) {
	    if (!this.has(item)) this._array.push(item);
	
	    this.length = this._array.length;
	  };
	
	  BadSet.prototype['delete'] = function _delete(item) {
	    var idx = indexOf(this._array, item);
	    if (idx !== -1) this._array.splice(idx, 1);
	
	    this.length = this._array.length;
	  };
	
	  BadSet.prototype.has = function has(val) {
	    return indexOf(this._array, val) !== -1;
	  };
	
	  return BadSet;
	})();
	
	function indexOf(arr, val) {
	  for (var i = 0; i < arr.length; i++) {
	    var item = arr[i];
	    if (item === val || isDate(item) && +val === +item) return i;
	  }
	  return -1;
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
	 * NON-CONFORMANT EDITION.
	 * © 2011 Colin Snover <http://zetafleet.com>
	 * Released under MIT license.
	 */
	//              1 YYYY                 2 MM        3 DD              4 HH     5 mm        6 ss            7 msec         8 Z 9 ±    10 tzHH    11 tzmm
	'use strict';
	
	var isoReg = /^(\d{4}|[+\-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
	
	module.exports = function parseIsoDate(date) {
	  var numericKeys = [1, 4, 5, 6, 7, 10, 11],
	      minutesOffset = 0,
	      timestamp,
	      struct;
	
	  if (struct = isoReg.exec(date)) {
	    // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
	    for (var i = 0, k; k = numericKeys[i]; ++i) struct[k] = +struct[k] || 0;
	
	    // allow undefined days and months
	    struct[2] = (+struct[2] || 1) - 1;
	    struct[3] = +struct[3] || 1;
	
	    // allow arbitrary sub-second precision beyond milliseconds
	    struct[7] = struct[7] ? +(struct[7] + '00').substr(0, 3) : 0;
	
	    // timestamps without timezone identifiers should be considered local time
	    if ((struct[8] === undefined || struct[8] === '') && (struct[9] === undefined || struct[9] === '')) timestamp = +new Date(struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);else {
	      if (struct[8] !== 'Z' && struct[9] !== undefined) {
	        minutesOffset = struct[10] * 60 + struct[11];
	
	        if (struct[9] === '+') minutesOffset = 0 - minutesOffset;
	      }
	
	      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
	    }
	  } else timestamp = Date.parse ? Date.parse(date) : NaN;
	
	  return timestamp;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	
	var pad = function pad(n) {
	  return n < 10 ? '0' + n : n;
	};
	
	var isValid = function isValid(date) {
	  return date && !isNaN(date.getTime());
	};
	
	var toLocal = function toLocal(date) {
	  return new Date((date = new Date(date)).getTime() + date.getTimezoneOffset() * 60000);
	};
	
	var parse = function parse(date, org, type) {
	  return toLocal(type === 'time' ? toDateString(org || new Date(), 'date') + 'T' + date : date);
	};
	
	var localISOString = function localISOString(date) {
	  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.000';
	};
	
	var toDateString = function toDateString(date, type) {
	  if (!isValid(date)) return null;
	  date = localISOString(date);
	  if (type === 'date') date = date.substr(0, 10);
	  if (type === 'time') date = date.substr(11);
	  return date;
	};
	
	var DateInput = (function (_React$Component) {
	  function DateInput() {
	    _classCallCheck(this, DateInput);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(DateInput, _React$Component);
	
	  DateInput.prototype.render = function render() {
	    var _props = this.props;
	    var value = _props.value;
	    var _props$type = _props.type;
	    var type = _props$type === undefined ? 'date' : _props$type;
	
	    var props = _objectWithoutProperties(_props, ['value', 'type']);
	
	    return React.createElement('input', _extends({}, props, { type: type,
	      value: toDateString(value, type),
	      onChange: function (e) {
	        return props.onChange(parse(e.target.value, value, type));
	      }
	    }));
	  };
	
	  return DateInput;
	})(React.Component);
	
	module.exports = DateInput;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	
	var isValid = function isValid(num) {
	  return typeof num === 'number' && !isNaN(num);
	};
	
	var isAtDelimiter = function isAtDelimiter(num, str) {
	  var next = str.length <= 1 ? false : parseFloat(str.substr(0, str.length - 1));
	  return typeof next === 'number' && !isNaN(next) && next === num;
	};
	
	var NumberInput = (function (_React$Component) {
	  function NumberInput() {
	    _classCallCheck(this, NumberInput);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	
	    this.state = {};
	  }
	
	  _inherits(NumberInput, _React$Component);
	
	  NumberInput.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    this.setState({ value: '' + nextProps.value });
	  };
	
	  NumberInput.prototype.render = function render() {
	    var _this = this;
	
	    var props = this.props,
	        value = this.state.value || props.value;
	
	    return React.createElement('input', _extends({}, props, { type: 'number', value: value, onChange: function (e) {
	        return _this._change(e);
	      } }));
	  };
	
	  NumberInput.prototype._change = function _change(e) {
	    var val = e.target.value,
	        current = this.props.value,
	        number = parseFloat(val);
	
	    if (val == null || val.trim() === '' || !isValid(number)) return this.props.onChange(null);
	
	    if (isValid(number) && number !== current && !isAtDelimiter(number, val)) return this.props.onChange(number);
	
	    this.setState({ value: val });
	  };
	
	  return NumberInput;
	})(React.Component);
	
	module.exports = NumberInput;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	
	var BoolInput = (function (_React$Component) {
	  function BoolInput() {
	    _classCallCheck(this, BoolInput);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(BoolInput, _React$Component);
	
	  BoolInput.prototype.render = function render() {
	    var props = this.props;
	
	    return React.createElement('input', _extends({}, props, { type: 'checkbox',
	      checked: props.value,
	      onChange: function (e) {
	        return props.onChange(e.target.checked);
	      }
	    }));
	  };
	
	  return BoolInput;
	})(React.Component);
	
	module.exports = BoolInput;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	
	var childAt = function childAt(children, idx) {
	  var child;
	  if (children.lengh !== undefined) child = children[idx];else React.Children.forEach(children, function (c, i) {
	    return !child && i === idx && (child = c);
	  });
	  return child;
	};
	
	var Select = (function (_React$Component) {
	  function Select() {
	    _classCallCheck(this, Select);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(Select, _React$Component);
	
	  Select.prototype.render = function render() {
	    var _this = this;
	
	    var _props = this.props;
	    var children = _props.children;
	
	    var props = _objectWithoutProperties(_props, ['children']);
	
	    return React.createElement(
	      'select',
	      _extends({}, props, { onChange: function (e) {
	          return _this.change(e);
	        } }),
	      children
	    );
	  };
	
	  Select.prototype.change = function change(e) {
	    var children = this.props.children,
	        values = [];
	
	    if (!this.props.multiple) return this.props.onChange(childAt(children, e.target.selectedIndex).props.value);[].forEach.call(e.target.options, function (option, i) {
	      return option.selected && values.push(childAt(children, i).props.value);
	    });
	
	    this.props.onChange(values);
	  };
	
	  return Select;
	})(React.Component);
	
	module.exports = Select;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var React = __webpack_require__(1),
	    cn = __webpack_require__(36),
	    connectToMessageContainer = __webpack_require__(51);
	
	var stringOrArrayOfStrings = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]);
	
	var MessageTrigger = (function (_React$Component) {
	  function MessageTrigger() {
	    _classCallCheck(this, MessageTrigger);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(MessageTrigger, _React$Component);
	
	  MessageTrigger.propTypes = {
	    events: React.PropTypes.arrayOf(React.PropTypes.string),
	    activeClass: React.PropTypes.string,
	
	    for: stringOrArrayOfStrings,
	    group: stringOrArrayOfStrings
	  };
	  MessageTrigger.contextTypes = {
	    onValidateField: React.PropTypes.func,
	    onValidateGroup: React.PropTypes.func,
	    register: React.PropTypes.func
	  };
	  MessageTrigger.defaultProps = {
	    events: ["onChange"],
	    activeClass: "message-active"
	  };
	
	  MessageTrigger.prototype.getContext = function getContext() {
	    return process.env.NODE_ENV !== "production" ? this.context : this._reactInternalInstance._context;
	  };
	
	  MessageTrigger.prototype.componentWillMount = function componentWillMount() {
	    this._unregister = this.getContext().register(this.props.for, this.props.group, this);
	  };
	
	  MessageTrigger.prototype.componentWillUnmount = function componentWillUnmount() {
	    this._unregister();
	  };
	
	  MessageTrigger.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    this._unregister();
	    this._unregister = this.getContext().register(nextProps.for, nextProps.group, this);
	  };
	
	  MessageTrigger.prototype.render = function render() {
	    var errClass = this.props.activeClass,
	        active = this.props.for && this.props.active,
	        child = React.Children.only(this.props.children);
	
	    return React.cloneElement(child, _extends({}, this._events(child.props), {
	
	      className: cn(child.props.className, (function () {
	        var _cn = {};
	        _cn[errClass] = active;
	        return _cn;
	      })())
	    }));
	  };
	
	  MessageTrigger.prototype._events = function _events(childProps) {
	    var _this = this;
	
	    var notify = this._notify;
	
	    return this.props.events.reduce(function (map, evt) {
	      map[evt] = notify.bind(_this, childProps[evt], evt);
	      return map;
	    }, {});
	  };
	
	  MessageTrigger.prototype._notify = function _notify(handler, event) {
	    var _this = this;
	
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }
	
	    var context = this.getContext(),
	        forProps = this.props.for ? [].concat(this.props.for) : [];
	
	    if (forProps.length) [].concat(forProps).forEach(function (path) {
	      return context.onValidateField(path, event, _this, args);
	    });else context.onValidateGroup(this.props.group, event, this, args);
	
	    handler && handler.apply(this, args);
	  };
	
	  return MessageTrigger;
	})(React.Component);
	
	module.exports = connectToMessageContainer(MessageTrigger);
	
	function requiredIfNot(propName, propType) {
	  var type = React.PropTypes.string;
	
	  return function (props, name, componentName) {
	    var type = propType;
	
	    if (!props.hasOwnProperty(propName)) type = type.isRequired;
	
	    return type(props, name, componentName);
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(1);
	
	var stringOrArrayofStrings = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]);
	
	module.exports = function (Component) {
	  return (function (_React$Component) {
	    function MessageListener() {
	      _classCallCheck(this, MessageListener);
	
	      if (_React$Component != null) {
	        _React$Component.apply(this, arguments);
	      }
	    }
	
	    _inherits(MessageListener, _React$Component);
	
	    MessageListener.propTypes = {
	      for: stringOrArrayofStrings,
	      group: stringOrArrayofStrings
	    };
	    MessageListener.contextTypes = {
	      messages: React.PropTypes.func,
	      listen: React.PropTypes.func
	    };
	
	    MessageListener.prototype.getContext = function getContext() {
	      return process.env.NODE_ENV !== "production" ? this.context : this._reactInternalInstance._context;
	    };
	
	    MessageListener.prototype.componentWillMount = function componentWillMount() {
	      var _this = this;
	
	      this._removeChangeListener = this.getContext().listen(function () {
	        return _this.setState(_this._getValidationState());
	      });
	
	      this.setState(this._getValidationState());
	    };
	
	    MessageListener.prototype.componentWillUnmount = function componentWillUnmount() {
	      this._removeChangeListener();
	    };
	
	    MessageListener.prototype.render = function render() {
	      return React.createElement(Component, _extends({}, this.props, this.state));
	    };
	
	    MessageListener.prototype._getValidationState = function _getValidationState() {
	      var messages = this.getContext().messages(this.props.for, this.props.group);
	
	      return {
	        messages: messages,
	        active: !!(messages && Object.keys(messages).length)
	      };
	    };
	
	    return MessageListener;
	  })(React.Component);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var React = __webpack_require__(1),
	    cn = __webpack_require__(36),
	    connectToMessageContainer = __webpack_require__(51);
	
	var values = function (obj) {
	  return Object.keys(obj).map(function (k) {
	    return obj[k];
	  });
	};
	var flatten = function (arr, next) {
	  return arr.concat(next);
	};
	
	var Message = (function (_React$Component) {
	  function Message() {
	    _classCallCheck(this, Message);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(Message, _React$Component);
	
	  Message.defaultProps = {
	    component: "span",
	    delim: ", "
	  };
	
	  Message.prototype.render = function render() {
	    var _props = this.props;
	    var Component = _props.component;
	    var messages = _props.messages;
	    var active = _props.active;
	    var delim = _props.delim;
	    var fieldFor = _props.for;
	
	    var props = _objectWithoutProperties(_props, ["component", "messages", "active", "delim", "for"]);
	
	    if (!active) return null;
	
	    return React.createElement(
	      Component,
	      props,
	      values(messages).reduce(flatten, []).join(delim)
	    );
	  };
	
	  return Message;
	})(React.Component);
	
	module.exports = connectToMessageContainer(Message);
	module.exports._Message = Message;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var React = __webpack_require__(1),
	    ReactElement = __webpack_require__(56);
	
	var Promise = __webpack_require__(60).Promise;
	
	var Validator = (function () {
	  function Validator(validate) {
	    _classCallCheck(this, Validator);
	
	    this._validator = validate;
	    this._errors = Object.create(null);
	  }
	
	  Validator.prototype.errors = function errors(names) {
	    var _this = this;
	
	    if (!names || !names.length) return _extends({}, this._errors);
	
	    return [].concat(names).reduce(function (o, name) {
	      if (_this._errors[name]) o[name] = _this._errors[name];
	
	      return o;
	    }, {});
	  };
	
	  Validator.prototype.isValid = function isValid(name) {
	    return !this._errors[name] || !this._errors[name].length;
	  };
	
	  Validator.prototype.validate = function validate(name, context) {
	    var _this = this;
	
	    var fields = [].concat(name).map(function (key) {
	      return _this._validateField(key, context);
	    });
	
	    this._removeError(name);
	
	    return Promise.all(fields);
	  };
	
	  Validator.prototype._validateField = function _validateField(name, context) {
	    var _this = this;
	
	    return new Promise(function (resolve, reject) {
	      Promise.resolve(_this._validator(name, context)).then(function (msgs) {
	        msgs = msgs == null ? [] : [].concat(msgs);
	        if (msgs.length) _this._addError(name, msgs);
	        resolve(!msgs.length);
	      }).catch(reject);
	    });
	  };
	
	  Validator.prototype._addError = function _addError(name, msgs) {
	    this._errors[name] = msgs;
	  };
	
	  Validator.prototype._removeError = function _removeError(fields) {
	    var _this = this;
	
	    [].concat(fields).forEach(function (field) {
	      return delete _this._errors[field];
	    });
	  };
	
	  return Validator;
	})();
	
	module.exports = Validator;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var React = __webpack_require__(1),
	    ReactElement = __webpack_require__(56);
	
	var Promise = __webpack_require__(60).Promise,
	    uniq = function (array) {
	  return array.filter(function (item, idx) {
	    return array.indexOf(item) == idx;
	  });
	};
	
	var has = function (obj, key) {
	  return obj && ({}).hasOwnProperty.call(obj, key);
	};
	
	module.exports = (function (_React$Component) {
	  function ValidationContainer(props, context) {
	    _classCallCheck(this, ValidationContainer);
	
	    _React$Component.call(this, props, context);
	
	    this._handlers = [];
	
	    this._groups = Object.create(null);
	    this._fields = Object.create(null);
	
	    this.state = {
	      children: getChildren(props, this.getChildContext())
	    };
	  }
	
	  _inherits(ValidationContainer, _React$Component);
	
	  ValidationContainer.defaultProps = {
	    messages: Object.create(null)
	  };
	  ValidationContainer.propTypes = {
	    messages: React.PropTypes.object,
	    onValidationNeeded: React.PropTypes.func.isRequired
	  };
	  ValidationContainer.childContextTypes = {
	
	    onValidateField: React.PropTypes.func,
	    onValidateGroup: React.PropTypes.func,
	
	    messages: React.PropTypes.func,
	
	    register: React.PropTypes.func,
	    unregister: React.PropTypes.func,
	
	    listen: React.PropTypes.func
	  };
	
	  ValidationContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    this.setState({
	      children: getChildren(nextProps, this.getChildContext())
	    });
	  };
	
	  ValidationContainer.prototype.componentDidMount = function componentDidMount() {
	    this._emit();
	  };
	
	  ValidationContainer.prototype.componentDidUpdate = function componentDidUpdate() {
	    this._emit();
	  };
	
	  ValidationContainer.prototype.getChildContext = function getChildContext() {
	    var _this = this;
	
	    // cache the value to avoid the damn owner/parent context warnings. TODO: remove in 0.14
	    return this._context || (this._context = {
	
	      messages: this._messages.bind(this),
	
	      listen: function (fn) {
	        _this._handlers.push(fn);
	        return function () {
	          return _this._handlers.splice(_this._handlers.indexOf(fn), 1);
	        };
	      },
	
	      register: function (names, group, target) {
	        names = [].concat(names);
	
	        names.forEach(function (name) {
	          return _this.addField(name, group, target);
	        });
	
	        return function () {
	          return names.forEach(function (name) {
	            return _this.removeField(name, group);
	          });
	        };
	      },
	
	      onValidateField: function (field, event, target, args) {
	        _this.props.onValidationNeeded && _this.props.onValidationNeeded({ event: event, field: field, args: args, target: target });
	      },
	
	      onValidateGroup: function (group, event, target, args) {
	        var inputs = _this.fields(group);
	
	        inputs.forEach(function (field) {
	          _this.props.onValidationNeeded && _this.props.onValidationNeeded({ event: event, field: field, args: args, target: _this._fields[field] });
	        });
	      }
	    });
	  };
	
	  ValidationContainer.prototype.addField = function addField(name, group, target) {
	    var _this = this;
	
	    if (!name) return;
	
	    this._fields[name] = target;
	
	    if (!(!group || !group.length)) [].concat(group).forEach(function (grp) {
	      if (!has(_this._groups, grp)) return _this._groups[grp] = [name];
	
	      if (_this._groups[grp].indexOf(name) === -1) _this._groups[grp].push(name);
	    });
	  };
	
	  ValidationContainer.prototype.removeField = function removeField(name, group) {
	    var _this = this;
	
	    var remove = function (name, group) {
	      var idx = _this._groups[group].indexOf(name);
	
	      if (idx !== -1) _this._groups[group].splice(idx, 1);
	    };
	
	    if (!name) return;
	
	    if (group) return remove(name, group);
	
	    for (var key in this._groups) if (has(this._groups, key)) remove(name, key);
	
	    this._fields[name] = false;
	  };
	
	  ValidationContainer.prototype.render = function render() {
	    return this.state.children;
	  };
	
	  ValidationContainer.prototype.fields = function fields(groups) {
	    var _this = this;
	
	    var isGroup = !(!groups || !groups.length);
	
	    groups = [].concat(groups);
	
	    return isGroup ? uniq(groups.reduce(function (fields, group) {
	      return fields.concat(_this._groups[group]);
	    }, [])) : Object.keys(this._fields);
	  };
	
	  ValidationContainer.prototype._emit = function _emit() {
	    this._handlers.forEach(function (fn) {
	      return fn();
	    });
	  };
	
	  ValidationContainer.prototype._messages = function _messages(names, groups) {
	    var _this = this;
	
	    if (!names || !names.length) {
	      if (!groups || !groups.length) return _extends({}, this.props.messages);
	
	      names = this.fields(groups);
	    }
	
	    return [].concat(names).reduce(function (o, name) {
	      if (_this.props.messages[name]) o[name] = _this.props.messages[name];
	
	      return o;
	    }, {});
	  };
	
	  return ValidationContainer;
	})(React.Component);
	
	function getChildren(props, context) {
	
	  if (process.env.NODE_ENV !== "production") {
	    // this is to avoid the warning but its hacky so lets do it a less hacky way in production
	    return attachChildren(React.Children.only(props.children), context);
	  } else return props.children;
	}
	
	function attachChildren(children, context) {
	
	  if (typeof children === "string" || React.isValidElement(children)) return clone(children);
	
	  return React.Children.map(children, clone);
	
	  function clone(child) {
	    var props = child.props;
	
	    if (!React.isValidElement(child)) return child;
	
	    if (props.children) props = _extends({}, child.props, { children: attachChildren(props.children, context) });
	
	    return new ReactElement(child.type, child.key, child.ref, child._owner, _extends({}, child._context, context), props);
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule update
	 */
	
	'use strict';
	
	var assign = __webpack_require__(61);
	var keyOf = __webpack_require__(62);
	var invariant = __webpack_require__(63);
	
	function shallowCopy(x) {
	  if (Array.isArray(x)) {
	    return x.concat();
	  } else if (x && typeof x === 'object') {
	    return assign(new x.constructor(), x);
	  } else {
	    return x;
	  }
	}
	
	var COMMAND_PUSH = keyOf({$push: null});
	var COMMAND_UNSHIFT = keyOf({$unshift: null});
	var COMMAND_SPLICE = keyOf({$splice: null});
	var COMMAND_SET = keyOf({$set: null});
	var COMMAND_MERGE = keyOf({$merge: null});
	var COMMAND_APPLY = keyOf({$apply: null});
	
	var ALL_COMMANDS_LIST = [
	  COMMAND_PUSH,
	  COMMAND_UNSHIFT,
	  COMMAND_SPLICE,
	  COMMAND_SET,
	  COMMAND_MERGE,
	  COMMAND_APPLY
	];
	
	var ALL_COMMANDS_SET = {};
	
	ALL_COMMANDS_LIST.forEach(function(command) {
	  ALL_COMMANDS_SET[command] = true;
	});
	
	function invariantArrayCase(value, spec, command) {
	  ("production" !== process.env.NODE_ENV ? invariant(
	    Array.isArray(value),
	    'update(): expected target of %s to be an array; got %s.',
	    command,
	    value
	  ) : invariant(Array.isArray(value)));
	  var specValue = spec[command];
	  ("production" !== process.env.NODE_ENV ? invariant(
	    Array.isArray(specValue),
	    'update(): expected spec of %s to be an array; got %s. ' +
	    'Did you forget to wrap your parameter in an array?',
	    command,
	    specValue
	  ) : invariant(Array.isArray(specValue)));
	}
	
	function update(value, spec) {
	  ("production" !== process.env.NODE_ENV ? invariant(
	    typeof spec === 'object',
	    'update(): You provided a key path to update() that did not contain one ' +
	    'of %s. Did you forget to include {%s: ...}?',
	    ALL_COMMANDS_LIST.join(', '),
	    COMMAND_SET
	  ) : invariant(typeof spec === 'object'));
	
	  if (spec.hasOwnProperty(COMMAND_SET)) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      Object.keys(spec).length === 1,
	      'Cannot have more than one key in an object with %s',
	      COMMAND_SET
	    ) : invariant(Object.keys(spec).length === 1));
	
	    return spec[COMMAND_SET];
	  }
	
	  var nextValue = shallowCopy(value);
	
	  if (spec.hasOwnProperty(COMMAND_MERGE)) {
	    var mergeObj = spec[COMMAND_MERGE];
	    ("production" !== process.env.NODE_ENV ? invariant(
	      mergeObj && typeof mergeObj === 'object',
	      'update(): %s expects a spec of type \'object\'; got %s',
	      COMMAND_MERGE,
	      mergeObj
	    ) : invariant(mergeObj && typeof mergeObj === 'object'));
	    ("production" !== process.env.NODE_ENV ? invariant(
	      nextValue && typeof nextValue === 'object',
	      'update(): %s expects a target of type \'object\'; got %s',
	      COMMAND_MERGE,
	      nextValue
	    ) : invariant(nextValue && typeof nextValue === 'object'));
	    assign(nextValue, spec[COMMAND_MERGE]);
	  }
	
	  if (spec.hasOwnProperty(COMMAND_PUSH)) {
	    invariantArrayCase(value, spec, COMMAND_PUSH);
	    spec[COMMAND_PUSH].forEach(function(item) {
	      nextValue.push(item);
	    });
	  }
	
	  if (spec.hasOwnProperty(COMMAND_UNSHIFT)) {
	    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
	    spec[COMMAND_UNSHIFT].forEach(function(item) {
	      nextValue.unshift(item);
	    });
	  }
	
	  if (spec.hasOwnProperty(COMMAND_SPLICE)) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      Array.isArray(value),
	      'Expected %s target to be an array; got %s',
	      COMMAND_SPLICE,
	      value
	    ) : invariant(Array.isArray(value)));
	    ("production" !== process.env.NODE_ENV ? invariant(
	      Array.isArray(spec[COMMAND_SPLICE]),
	      'update(): expected spec of %s to be an array of arrays; got %s. ' +
	      'Did you forget to wrap your parameters in an array?',
	      COMMAND_SPLICE,
	      spec[COMMAND_SPLICE]
	    ) : invariant(Array.isArray(spec[COMMAND_SPLICE])));
	    spec[COMMAND_SPLICE].forEach(function(args) {
	      ("production" !== process.env.NODE_ENV ? invariant(
	        Array.isArray(args),
	        'update(): expected spec of %s to be an array of arrays; got %s. ' +
	        'Did you forget to wrap your parameters in an array?',
	        COMMAND_SPLICE,
	        spec[COMMAND_SPLICE]
	      ) : invariant(Array.isArray(args)));
	      nextValue.splice.apply(nextValue, args);
	    });
	  }
	
	  if (spec.hasOwnProperty(COMMAND_APPLY)) {
	    ("production" !== process.env.NODE_ENV ? invariant(
	      typeof spec[COMMAND_APPLY] === 'function',
	      'update(): expected spec of %s to be a function; got %s.',
	      COMMAND_APPLY,
	      spec[COMMAND_APPLY]
	    ) : invariant(typeof spec[COMMAND_APPLY] === 'function'));
	    nextValue = spec[COMMAND_APPLY](nextValue);
	  }
	
	  for (var k in spec) {
	    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
	      nextValue[k] = update(value[k], spec[k]);
	    }
	  }
	
	  return nextValue;
	}
	
	module.exports = update;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactElement
	 */
	
	'use strict';
	
	var ReactContext = __webpack_require__(64);
	var ReactCurrentOwner = __webpack_require__(65);
	
	var assign = __webpack_require__(61);
	var warning = __webpack_require__(66);
	
	var RESERVED_PROPS = {
	  key: true,
	  ref: true
	};
	
	/**
	 * Warn for mutations.
	 *
	 * @internal
	 * @param {object} object
	 * @param {string} key
	 */
	function defineWarningProperty(object, key) {
	  Object.defineProperty(object, key, {
	
	    configurable: false,
	    enumerable: true,
	
	    get: function() {
	      if (!this._store) {
	        return null;
	      }
	      return this._store[key];
	    },
	
	    set: function(value) {
	      ("production" !== process.env.NODE_ENV ? warning(
	        false,
	        'Don\'t set the %s property of the React element. Instead, ' +
	        'specify the correct value when initially creating the element.',
	        key
	      ) : null);
	      this._store[key] = value;
	    }
	
	  });
	}
	
	/**
	 * This is updated to true if the membrane is successfully created.
	 */
	var useMutationMembrane = false;
	
	/**
	 * Warn for mutations.
	 *
	 * @internal
	 * @param {object} element
	 */
	function defineMutationMembrane(prototype) {
	  try {
	    var pseudoFrozenProperties = {
	      props: true
	    };
	    for (var key in pseudoFrozenProperties) {
	      defineWarningProperty(prototype, key);
	    }
	    useMutationMembrane = true;
	  } catch (x) {
	    // IE will fail on defineProperty
	  }
	}
	
	/**
	 * Base constructor for all React elements. This is only used to make this
	 * work with a dynamic instanceof check. Nothing should live on this prototype.
	 *
	 * @param {*} type
	 * @param {string|object} ref
	 * @param {*} key
	 * @param {*} props
	 * @internal
	 */
	var ReactElement = function(type, key, ref, owner, context, props) {
	  // Built-in properties that belong on the element
	  this.type = type;
	  this.key = key;
	  this.ref = ref;
	
	  // Record the component responsible for creating this element.
	  this._owner = owner;
	
	  // TODO: Deprecate withContext, and then the context becomes accessible
	  // through the owner.
	  this._context = context;
	
	  if ("production" !== process.env.NODE_ENV) {
	    // The validation flag and props are currently mutative. We put them on
	    // an external backing store so that we can freeze the whole object.
	    // This can be replaced with a WeakMap once they are implemented in
	    // commonly used development environments.
	    this._store = {props: props, originalProps: assign({}, props)};
	
	    // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.
	    try {
	      Object.defineProperty(this._store, 'validated', {
	        configurable: false,
	        enumerable: false,
	        writable: true
	      });
	    } catch (x) {
	    }
	    this._store.validated = false;
	
	    // We're not allowed to set props directly on the object so we early
	    // return and rely on the prototype membrane to forward to the backing
	    // store.
	    if (useMutationMembrane) {
	      Object.freeze(this);
	      return;
	    }
	  }
	
	  this.props = props;
	};
	
	// We intentionally don't expose the function on the constructor property.
	// ReactElement should be indistinguishable from a plain object.
	ReactElement.prototype = {
	  _isReactElement: true
	};
	
	if ("production" !== process.env.NODE_ENV) {
	  defineMutationMembrane(ReactElement.prototype);
	}
	
	ReactElement.createElement = function(type, config, children) {
	  var propName;
	
	  // Reserved names are extracted
	  var props = {};
	
	  var key = null;
	  var ref = null;
	
	  if (config != null) {
	    ref = config.ref === undefined ? null : config.ref;
	    key = config.key === undefined ? null : '' + config.key;
	    // Remaining properties are added to a new props object
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) &&
	          !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }
	
	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }
	
	  // Resolve default props
	  if (type && type.defaultProps) {
	    var defaultProps = type.defaultProps;
	    for (propName in defaultProps) {
	      if (typeof props[propName] === 'undefined') {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  }
	
	  return new ReactElement(
	    type,
	    key,
	    ref,
	    ReactCurrentOwner.current,
	    ReactContext.current,
	    props
	  );
	};
	
	ReactElement.createFactory = function(type) {
	  var factory = ReactElement.createElement.bind(null, type);
	  // Expose the type on the factory and the prototype so that it can be
	  // easily accessed on elements. E.g. <Foo />.type === Foo.type.
	  // This should not be named `constructor` since this may not be the function
	  // that created the element, and it may not even be a constructor.
	  // Legacy hook TODO: Warn if this is accessed
	  factory.type = type;
	  return factory;
	};
	
	ReactElement.cloneAndReplaceProps = function(oldElement, newProps) {
	  var newElement = new ReactElement(
	    oldElement.type,
	    oldElement.key,
	    oldElement.ref,
	    oldElement._owner,
	    oldElement._context,
	    newProps
	  );
	
	  if ("production" !== process.env.NODE_ENV) {
	    // If the key on the original is valid, then the clone is valid
	    newElement._store.validated = oldElement._store.validated;
	  }
	  return newElement;
	};
	
	ReactElement.cloneElement = function(element, config, children) {
	  var propName;
	
	  // Original props are copied
	  var props = assign({}, element.props);
	
	  // Reserved names are extracted
	  var key = element.key;
	  var ref = element.ref;
	
	  // Owner will be preserved, unless ref is overridden
	  var owner = element._owner;
	
	  if (config != null) {
	    if (config.ref !== undefined) {
	      // Silently steal the ref from the parent.
	      ref = config.ref;
	      owner = ReactCurrentOwner.current;
	    }
	    if (config.key !== undefined) {
	      key = '' + config.key;
	    }
	    // Remaining properties override existing props
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) &&
	          !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }
	
	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }
	
	  return new ReactElement(
	    element.type,
	    key,
	    ref,
	    owner,
	    element._context,
	    props
	  );
	};
	
	/**
	 * @param {?object} object
	 * @return {boolean} True if `object` is a valid component.
	 * @final
	 */
	ReactElement.isValidElement = function(object) {
	  // ReactTestUtils is often used outside of beforeEach where as React is
	  // within it. This leads to two different instances of React on the same
	  // page. To identify a element from a different React instance we use
	  // a flag instead of an instanceof check.
	  var isElement = !!(object && object._isReactElement);
	  // if (isElement && !(object instanceof ReactElement)) {
	  // This is an indicator that you're using multiple versions of React at the
	  // same time. This will screw with ownership and stuff. Fix it, please.
	  // TODO: We could possibly warn here.
	  // }
	  return isElement;
	};
	
	module.exports = ReactElement;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	var babelHelpers = __webpack_require__(68);
	var React = __webpack_require__(1);
	var invariant = __webpack_require__(63);
	
	function customPropType(handler, propType, name) {
	
	  return function (props, propName, componentName, location) {
	
	    if (props[propName] !== undefined) {
	      if (!props[handler]) return new Error("You have provided a `" + propName + "` prop to " + "`" + name + "` without an `" + handler + "` handler. This will render a read-only field. " + "If the field should be mutable use `" + defaultKey(propName) + "`. Otherwise, set `" + handler + "`");
	
	      return propType && propType(props, propName, name, location);
	    }
	  };
	}
	
	var version = React.version.split(".").map(parseFloat);
	
	function getType(component) {
	  if (version[0] === 0 && version[1] >= 13) return component;
	
	  return component.type;
	}
	
	module.exports = function (Component, controlledValues, taps) {
	  var name = Component.displayName || Component.name || "Component",
	      types = {};
	
	  if (process.env.NODE_ENV !== "production" && getType(Component).propTypes) {
	    types = transform(controlledValues, function (obj, handler, prop) {
	      var type = getType(Component).propTypes[prop];
	
	      invariant(typeof handler === "string" && handler.trim().length, "Uncontrollable - [%s]: the prop `%s` needs a valid handler key name in order to make it uncontrollable", Component.displayName, prop);
	
	      obj[prop] = customPropType(handler, type, Component.displayName);
	      if (type !== undefined) {
	        obj[defaultKey(prop)] = type;
	      }
	    }, {});
	  }
	
	  name = name[0].toUpperCase() + name.substr(1);
	
	  taps = taps || {};
	
	  return React.createClass({
	
	    displayName: "Uncontrolled" + name,
	
	    propTypes: types,
	
	    getInitialState: function () {
	      var props = this.props,
	          keys = Object.keys(controlledValues);
	
	      return transform(keys, function (state, key) {
	        state[key] = props[defaultKey(key)];
	      }, {});
	    },
	
	    shouldComponentUpdate: function () {
	      //let the setState trigger the update
	      return !this._notifying;
	    },
	
	    render: function () {
	      var _this = this;
	
	      var props = {};
	
	      each(controlledValues, function (handle, prop) {
	
	        props[prop] = isProp(_this.props, prop) ? _this.props[prop] : _this.state[prop];
	
	        props[handle] = setAndNotify.bind(_this, prop);
	      });
	
	      props = babelHelpers._extends({}, this.props, props);
	
	      each(taps, function (val, key) {
	        return props[key] = chain(_this, val, props[key]);
	      });
	
	      return React.createElement(Component, props);
	    }
	  });
	
	  function setAndNotify(prop, value) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }
	
	    var handler = controlledValues[prop],
	        controlled = handler && isProp(this.props, prop),
	        args;
	
	    if (this.props[handler]) {
	      var _props$handler;
	
	      this._notifying = true;
	      (_props$handler = this.props[handler]).call.apply(_props$handler, [this, value].concat(args));
	      this._notifying = false;
	    }
	
	    this.setState((function () {
	      var _setState = {};
	      _setState[prop] = value;
	      return _setState;
	    })());
	
	    return !controlled;
	  }
	
	  function isProp(props, prop) {
	    return props[prop] !== undefined;
	  }
	};
	
	function defaultKey(key) {
	  return "default" + key.charAt(0).toUpperCase() + key.substr(1);
	}
	
	function chain(thisArg, a, b) {
	  return function chainedFunction() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    a && a.call.apply(a, [thisArg].concat(args));
	    b && b.call.apply(b, [thisArg].concat(args));
	  };
	}
	
	function transform(obj, cb, seed) {
	  each(obj, cb.bind(null, seed = seed || (Array.isArray(obj) ? [] : {})));
	  return seed;
	}
	
	function each(obj, cb, thisArg) {
	  if (Array.isArray(obj)) return obj.forEach(cb, thisArg);
	
	  for (var key in obj) if (has(obj, key)) cb.call(thisArg, obj[key], key, obj);
	}
	
	function has(o, k) {
	  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.babel;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Topological sorting function
	 *
	 * @param {Array} edges
	 * @returns {Array}
	 */
	
	module.exports = exports = function(edges){
	  return toposort(uniqueNodes(edges), edges)
	}
	
	exports.array = toposort
	
	function toposort(nodes, edges) {
	  var cursor = nodes.length
	    , sorted = new Array(cursor)
	    , visited = {}
	    , i = cursor
	
	  while (i--) {
	    if (!visited[i]) visit(nodes[i], i, [])
	  }
	
	  return sorted
	
	  function visit(node, i, predecessors) {
	    if(predecessors.indexOf(node) >= 0) {
	      throw new Error('Cyclic dependency: '+JSON.stringify(node))
	    }
	
	    if (visited[i]) return;
	    visited[i] = true
	
	    // outgoing edges
	    var outgoing = edges.filter(function(edge){
	      return edge[0] === node
	    })
	    if (i = outgoing.length) {
	      var preds = predecessors.concat(node)
	      do {
	        var child = outgoing[--i][1]
	        visit(child, nodes.indexOf(child), preds)
	      } while (i)
	    }
	
	    sorted[--cursor] = node
	  }
	}
	
	function uniqueNodes(arr){
	  var res = []
	  for (var i = 0, len = arr.length; i < len; i++) {
	    var edge = arr[i]
	    if (res.indexOf(edge[0]) < 0) res.push(edge[0])
	    if (res.indexOf(edge[1]) < 0) res.push(edge[1])
	  }
	  return res
	}


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   2.0.1
	 */
	
	(function() {
	    "use strict";
	
	    function $$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }
	
	    function $$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }
	
	    function $$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }
	
	    var $$utils$$_isArray;
	
	    if (!Array.isArray) {
	      $$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      $$utils$$_isArray = Array.isArray;
	    }
	
	    var $$utils$$isArray = $$utils$$_isArray;
	    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
	    function $$utils$$F() { }
	
	    var $$utils$$o_create = (Object.create || function (o) {
	      if (arguments.length > 1) {
	        throw new Error('Second argument not supported');
	      }
	      if (typeof o !== 'object') {
	        throw new TypeError('Argument must be an object');
	      }
	      $$utils$$F.prototype = o;
	      return new $$utils$$F();
	    });
	
	    var $$asap$$len = 0;
	
	    var $$asap$$default = function asap(callback, arg) {
	      $$asap$$queue[$$asap$$len] = callback;
	      $$asap$$queue[$$asap$$len + 1] = arg;
	      $$asap$$len += 2;
	      if ($$asap$$len === 2) {
	        // If len is 1, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        $$asap$$scheduleFlush();
	      }
	    };
	
	    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
	    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;
	
	    // test for web worker but not in IE10
	    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';
	
	    // node
	    function $$asap$$useNextTick() {
	      return function() {
	        process.nextTick($$asap$$flush);
	      };
	    }
	
	    function $$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });
	
	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }
	
	    // web worker
	    function $$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = $$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }
	
	    function $$asap$$useSetTimeout() {
	      return function() {
	        setTimeout($$asap$$flush, 1);
	      };
	    }
	
	    var $$asap$$queue = new Array(1000);
	
	    function $$asap$$flush() {
	      for (var i = 0; i < $$asap$$len; i+=2) {
	        var callback = $$asap$$queue[i];
	        var arg = $$asap$$queue[i+1];
	
	        callback(arg);
	
	        $$asap$$queue[i] = undefined;
	        $$asap$$queue[i+1] = undefined;
	      }
	
	      $$asap$$len = 0;
	    }
	
	    var $$asap$$scheduleFlush;
	
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	      $$asap$$scheduleFlush = $$asap$$useNextTick();
	    } else if ($$asap$$BrowserMutationObserver) {
	      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
	    } else if ($$asap$$isWorker) {
	      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
	    } else {
	      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
	    }
	
	    function $$$internal$$noop() {}
	    var $$$internal$$PENDING   = void 0;
	    var $$$internal$$FULFILLED = 1;
	    var $$$internal$$REJECTED  = 2;
	    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();
	
	    function $$$internal$$selfFullfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }
	
	    function $$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.')
	    }
	
	    function $$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        $$$internal$$GET_THEN_ERROR.error = error;
	        return $$$internal$$GET_THEN_ERROR;
	      }
	    }
	
	    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }
	
	    function $$$internal$$handleForeignThenable(promise, thenable, then) {
	       $$asap$$default(function(promise) {
	        var sealed = false;
	        var error = $$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            $$$internal$$resolve(promise, value);
	          } else {
	            $$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;
	
	          $$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	        if (!sealed && error) {
	          sealed = true;
	          $$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }
	
	    function $$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === $$$internal$$FULFILLED) {
	        $$$internal$$fulfill(promise, thenable._result);
	      } else if (promise._state === $$$internal$$REJECTED) {
	        $$$internal$$reject(promise, thenable._result);
	      } else {
	        $$$internal$$subscribe(thenable, undefined, function(value) {
	          $$$internal$$resolve(promise, value);
	        }, function(reason) {
	          $$$internal$$reject(promise, reason);
	        });
	      }
	    }
	
	    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
	      if (maybeThenable.constructor === promise.constructor) {
	        $$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        var then = $$$internal$$getThen(maybeThenable);
	
	        if (then === $$$internal$$GET_THEN_ERROR) {
	          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          $$$internal$$fulfill(promise, maybeThenable);
	        } else if ($$utils$$isFunction(then)) {
	          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          $$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }
	
	    function $$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
	      } else if ($$utils$$objectOrFunction(value)) {
	        $$$internal$$handleMaybeThenable(promise, value);
	      } else {
	        $$$internal$$fulfill(promise, value);
	      }
	    }
	
	    function $$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }
	
	      $$$internal$$publish(promise);
	    }
	
	    function $$$internal$$fulfill(promise, value) {
	      if (promise._state !== $$$internal$$PENDING) { return; }
	
	      promise._result = value;
	      promise._state = $$$internal$$FULFILLED;
	
	      if (promise._subscribers.length === 0) {
	      } else {
	        $$asap$$default($$$internal$$publish, promise);
	      }
	    }
	
	    function $$$internal$$reject(promise, reason) {
	      if (promise._state !== $$$internal$$PENDING) { return; }
	      promise._state = $$$internal$$REJECTED;
	      promise._result = reason;
	
	      $$asap$$default($$$internal$$publishRejection, promise);
	    }
	
	    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;
	
	      parent._onerror = null;
	
	      subscribers[length] = child;
	      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + $$$internal$$REJECTED]  = onRejection;
	
	      if (length === 0 && parent._state) {
	        $$asap$$default($$$internal$$publish, parent);
	      }
	    }
	
	    function $$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;
	
	      if (subscribers.length === 0) { return; }
	
	      var child, callback, detail = promise._result;
	
	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];
	
	        if (child) {
	          $$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }
	
	      promise._subscribers.length = 0;
	    }
	
	    function $$$internal$$ErrorObject() {
	      this.error = null;
	    }
	
	    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();
	
	    function $$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        $$$internal$$TRY_CATCH_ERROR.error = e;
	        return $$$internal$$TRY_CATCH_ERROR;
	      }
	    }
	
	    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = $$utils$$isFunction(callback),
	          value, error, succeeded, failed;
	
	      if (hasCallback) {
	        value = $$$internal$$tryCatch(callback, detail);
	
	        if (value === $$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }
	
	        if (promise === value) {
	          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
	          return;
	        }
	
	      } else {
	        value = detail;
	        succeeded = true;
	      }
	
	      if (promise._state !== $$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        $$$internal$$resolve(promise, value);
	      } else if (failed) {
	        $$$internal$$reject(promise, error);
	      } else if (settled === $$$internal$$FULFILLED) {
	        $$$internal$$fulfill(promise, value);
	      } else if (settled === $$$internal$$REJECTED) {
	        $$$internal$$reject(promise, value);
	      }
	    }
	
	    function $$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          $$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          $$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        $$$internal$$reject(promise, e);
	      }
	    }
	
	    function $$$enumerator$$makeSettledResult(state, position, value) {
	      if (state === $$$internal$$FULFILLED) {
	        return {
	          state: 'fulfilled',
	          value: value
	        };
	      } else {
	        return {
	          state: 'rejected',
	          reason: value
	        };
	      }
	    }
	
	    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
	      this._instanceConstructor = Constructor;
	      this.promise = new Constructor($$$internal$$noop, label);
	      this._abortOnReject = abortOnReject;
	
	      if (this._validateInput(input)) {
	        this._input     = input;
	        this.length     = input.length;
	        this._remaining = input.length;
	
	        this._init();
	
	        if (this.length === 0) {
	          $$$internal$$fulfill(this.promise, this._result);
	        } else {
	          this.length = this.length || 0;
	          this._enumerate();
	          if (this._remaining === 0) {
	            $$$internal$$fulfill(this.promise, this._result);
	          }
	        }
	      } else {
	        $$$internal$$reject(this.promise, this._validationError());
	      }
	    }
	
	    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
	      return $$utils$$isArray(input);
	    };
	
	    $$$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };
	
	    $$$enumerator$$Enumerator.prototype._init = function() {
	      this._result = new Array(this.length);
	    };
	
	    var $$$enumerator$$default = $$$enumerator$$Enumerator;
	
	    $$$enumerator$$Enumerator.prototype._enumerate = function() {
	      var length  = this.length;
	      var promise = this.promise;
	      var input   = this._input;
	
	      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
	        this._eachEntry(input[i], i);
	      }
	    };
	
	    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var c = this._instanceConstructor;
	      if ($$utils$$isMaybeThenable(entry)) {
	        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
	          entry._onerror = null;
	          this._settledAt(entry._state, i, entry._result);
	        } else {
	          this._willSettleAt(c.resolve(entry), i);
	        }
	      } else {
	        this._remaining--;
	        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
	      }
	    };
	
	    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var promise = this.promise;
	
	      if (promise._state === $$$internal$$PENDING) {
	        this._remaining--;
	
	        if (this._abortOnReject && state === $$$internal$$REJECTED) {
	          $$$internal$$reject(promise, value);
	        } else {
	          this._result[i] = this._makeResult(state, i, value);
	        }
	      }
	
	      if (this._remaining === 0) {
	        $$$internal$$fulfill(promise, this._result);
	      }
	    };
	
	    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
	      return value;
	    };
	
	    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;
	
	      $$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt($$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt($$$internal$$REJECTED, i, reason);
	      });
	    };
	
	    var $$promise$all$$default = function all(entries, label) {
	      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
	    };
	
	    var $$promise$race$$default = function race(entries, label) {
	      /*jshint validthis:true */
	      var Constructor = this;
	
	      var promise = new Constructor($$$internal$$noop, label);
	
	      if (!$$utils$$isArray(entries)) {
	        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }
	
	      var length = entries.length;
	
	      function onFulfillment(value) {
	        $$$internal$$resolve(promise, value);
	      }
	
	      function onRejection(reason) {
	        $$$internal$$reject(promise, reason);
	      }
	
	      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
	        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }
	
	      return promise;
	    };
	
	    var $$promise$resolve$$default = function resolve(object, label) {
	      /*jshint validthis:true */
	      var Constructor = this;
	
	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }
	
	      var promise = new Constructor($$$internal$$noop, label);
	      $$$internal$$resolve(promise, object);
	      return promise;
	    };
	
	    var $$promise$reject$$default = function reject(reason, label) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor($$$internal$$noop, label);
	      $$$internal$$reject(promise, reason);
	      return promise;
	    };
	
	    var $$es6$promise$promise$$counter = 0;
	
	    function $$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }
	
	    function $$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }
	
	    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;
	
	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise’s eventual value or the reason
	      why the promise cannot be fulfilled.
	
	      Terminology
	      -----------
	
	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.
	
	      A promise can be in one of three states: pending, fulfilled, or rejected.
	
	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.
	
	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.
	
	
	      Basic Usage:
	      ------------
	
	      ```js
	      var promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);
	
	        // on failure
	        reject(reason);
	      });
	
	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	
	      Advanced Usage:
	      ---------------
	
	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.
	
	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          var xhr = new XMLHttpRequest();
	
	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();
	
	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }
	
	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	
	      Unlike callbacks, promises are great composable primitives.
	
	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON
	
	        return values;
	      });
	      ```
	
	      @class Promise
	      @param {function} resolver
	      Useful for tooling.
	      @constructor
	    */
	    function $$es6$promise$promise$$Promise(resolver) {
	      this._id = $$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];
	
	      if ($$$internal$$noop !== resolver) {
	        if (!$$utils$$isFunction(resolver)) {
	          $$es6$promise$promise$$needsResolver();
	        }
	
	        if (!(this instanceof $$es6$promise$promise$$Promise)) {
	          $$es6$promise$promise$$needsNew();
	        }
	
	        $$$internal$$initializePromise(this, resolver);
	      }
	    }
	
	    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
	    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
	    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
	    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;
	
	    $$es6$promise$promise$$Promise.prototype = {
	      constructor: $$es6$promise$promise$$Promise,
	
	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.
	
	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```
	
	      Chaining
	      --------
	
	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.
	
	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });
	
	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	
	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```
	
	      Assimilation
	      ------------
	
	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.
	
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```
	
	      If the assimliated promise rejects, then the downstream promise will also reject.
	
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```
	
	      Simple Example
	      --------------
	
	      Synchronous Example
	
	      ```javascript
	      var result;
	
	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	
	      Errback Example
	
	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```
	
	      Promise Example;
	
	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```
	
	      Advanced Example
	      --------------
	
	      Synchronous Example
	
	      ```javascript
	      var author, books;
	
	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	
	      Errback Example
	
	      ```js
	
	      function foundBooks(books) {
	
	      }
	
	      function failure(reason) {
	
	      }
	
	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```
	
	      Promise Example;
	
	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```
	
	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	      then: function(onFulfillment, onRejection) {
	        var parent = this;
	        var state = parent._state;
	
	        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
	          return this;
	        }
	
	        var child = new this.constructor($$$internal$$noop);
	        var result = parent._result;
	
	        if (state) {
	          var callback = arguments[state - 1];
	          $$asap$$default(function(){
	            $$$internal$$invokeCallback(state, child, callback, result);
	          });
	        } else {
	          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	        }
	
	        return child;
	      },
	
	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.
	
	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }
	
	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }
	
	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```
	
	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	
	    var $$es6$promise$polyfill$$default = function polyfill() {
	      var local;
	
	      if (typeof global !== 'undefined') {
	        local = global;
	      } else if (typeof window !== 'undefined' && window.document) {
	        local = window;
	      } else {
	        local = self;
	      }
	
	      var es6PromiseSupport =
	        "Promise" in local &&
	        // Some of these methods are missing from
	        // Firefox/Chrome experimental implementations
	        "resolve" in local.Promise &&
	        "reject" in local.Promise &&
	        "all" in local.Promise &&
	        "race" in local.Promise &&
	        // Older version of the spec had a resolver object
	        // as the arg rather than a function
	        (function() {
	          var resolve;
	          new local.Promise(function(r) { resolve = r; });
	          return $$utils$$isFunction(resolve);
	        }());
	
	      if (!es6PromiseSupport) {
	        local.Promise = $$es6$promise$promise$$default;
	      }
	    };
	
	    var es6$promise$umd$$ES6Promise = {
	      'Promise': $$es6$promise$promise$$default,
	      'polyfill': $$es6$promise$polyfill$$default
	    };
	
	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(71)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
	    }
	}).call(this);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34), (function() { return this; }()), __webpack_require__(72)(module)))

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Object.assign
	 */
	
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
	
	'use strict';
	
	function assign(target, sources) {
	  if (target == null) {
	    throw new TypeError('Object.assign target cannot be null or undefined');
	  }
	
	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }
	
	    var from = Object(nextSource);
	
	    // We don't currently support accessors nor proxies. Therefore this
	    // copy cannot throw. If we ever supported this then we must handle
	    // exceptions and side-effects. We don't support symbols so they won't
	    // be transferred.
	
	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }
	
	  return to;
	}
	
	module.exports = assign;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule keyOf
	 */
	
	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without loosing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */
	var keyOf = function(oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};
	
	
	module.exports = keyOf;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */
	
	"use strict";
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if ("production" !== process.env.NODE_ENV) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactContext
	 */
	
	'use strict';
	
	var assign = __webpack_require__(61);
	var emptyObject = __webpack_require__(70);
	var warning = __webpack_require__(66);
	
	var didWarn = false;
	
	/**
	 * Keeps track of the current context.
	 *
	 * The context is automatically passed down the component ownership hierarchy
	 * and is accessible via `this.context` on ReactCompositeComponents.
	 */
	var ReactContext = {
	
	  /**
	   * @internal
	   * @type {object}
	   */
	  current: emptyObject,
	
	  /**
	   * Temporarily extends the current context while executing scopedCallback.
	   *
	   * A typical use case might look like
	   *
	   *  render: function() {
	   *    var children = ReactContext.withContext({foo: 'foo'}, () => (
	   *
	   *    ));
	   *    return <div>{children}</div>;
	   *  }
	   *
	   * @param {object} newContext New context to merge into the existing context
	   * @param {function} scopedCallback Callback to run with the new context
	   * @return {ReactComponent|array<ReactComponent>}
	   */
	  withContext: function(newContext, scopedCallback) {
	    if ("production" !== process.env.NODE_ENV) {
	      ("production" !== process.env.NODE_ENV ? warning(
	        didWarn,
	        'withContext is deprecated and will be removed in a future version. ' +
	        'Use a wrapper component with getChildContext instead.'
	      ) : null);
	
	      didWarn = true;
	    }
	
	    var result;
	    var previousContext = ReactContext.current;
	    ReactContext.current = assign({}, previousContext, newContext);
	    try {
	      result = scopedCallback();
	    } finally {
	      ReactContext.current = previousContext;
	    }
	    return result;
	  }
	
	};
	
	module.exports = ReactContext;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactCurrentOwner
	 */
	
	'use strict';
	
	/**
	 * Keeps track of the current owner.
	 *
	 * The current owner is the component who should own any components that are
	 * currently being constructed.
	 *
	 * The depth indicate how many composite components are above this render level.
	 */
	var ReactCurrentOwner = {
	
	  /**
	   * @internal
	   * @type {ReactComponent}
	   */
	  current: null
	
	};
	
	module.exports = ReactCurrentOwner;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule warning
	 */
	
	"use strict";
	
	var emptyFunction = __webpack_require__(69);
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = emptyFunction;
	
	if ("production" !== process.env.NODE_ENV) {
	  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }
	
	    if (format.length < 10 || /^[s\W]*$/.test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }
	
	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }
	
	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];});
	      console.warn(message);
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}
	
	module.exports = warning;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! Case - v1.2.1 - 2015-01-29
	* Copyright (c) 2015 Nathan Bubna; Licensed MIT, GPL */
	(function() {
	    "use strict";
	    var unicodes = function(s, prefix) {
	        prefix = prefix || '';
	        return s.replace(/(^|-)/g, '$1\\u'+prefix).replace(/,/g, '\\u'+prefix);
	    },
	    basicSymbols = unicodes('20-2F,3A-40,5B-60,7B-7E,A0-BF,D7,F7', '00'),
	    baseLowerCase = 'a-z'+unicodes('DF-F6,F8-FF', '00'),
	    baseUpperCase = 'A-Z'+unicodes('C0-D6,D8-DE', '00'),
	    improperInTitle = 'A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\\.?|Via',
	    regexps = function(symbols, lowers, uppers, impropers) {
	        symbols = symbols || basicSymbols;
	        lowers = lowers || baseLowerCase;
	        uppers = uppers || baseUpperCase;
	        impropers = impropers || improperInTitle;
	        return {
	            capitalize: new RegExp('(^|['+symbols+'])(['+lowers+'])', 'g'),
	            pascal: new RegExp('(^|['+symbols+'])+(['+lowers+uppers+'])', 'g'),
	            fill: new RegExp('['+symbols+']+(.|$)','g'),
	            sentence: new RegExp('(^\\s*|[\\?\\!\\.]+"?\\s+"?|,\\s+")(['+lowers+'])', 'g'),
	            improper: new RegExp('\\b('+impropers+')\\b', 'g'),
	            relax: new RegExp('([^'+uppers+'])(['+uppers+']*)(['+uppers+'])(?=['+lowers+']|$)', 'g'),
	            upper: new RegExp('^[^'+lowers+']+$'),
	            hole: /\s/,
	            room: new RegExp('['+symbols+']')
	        };
	    },
	    re = regexps(),
	    _ = {
	        re: re,
	        unicodes: unicodes,
	        regexps: regexps,
	        types: [],
	        up: String.prototype.toUpperCase,
	        low: String.prototype.toLowerCase,
	        cap: function(s) {
	            return _.up.call(s.charAt(0))+s.slice(1);
	        },
	        decap: function(s) {
	            return _.low.call(s.charAt(0))+s.slice(1);
	        },
	        fill: function(s, fill) {
	            return !s || fill == null ? s : s.replace(re.fill, function(m, next) {
	                return next ? fill + next : '';
	            });
	        },
	        prep: function(s, fill, pascal, upper) {
	            if (!s){ return s || ''; }
	            if (!upper && re.upper.test(s)) {
	                s = _.low.call(s);
	            }
	            if (!fill && !re.hole.test(s)) {
	                s = _.fill(s, ' ');
	            }
	            if (!pascal && !re.room.test(s)) {
	                s = s.replace(re.relax, _.relax);
	            }
	            return s;
	        },
	        relax: function(m, before, acronym, caps) {
	            return before + ' ' + (acronym ? acronym+' ' : '') + caps;
	        }
	    },
	    Case = {
	        _: _,
	        of: function(s) {
	            for (var i=0,m=_.types.length; i<m; i++) {
	                if (Case[_.types[i]](s) === s){ return _.types[i]; }
	            }
	        },
	        flip: function(s) {
	            return s.replace(/\w/g, function(l) {
	                return l == _.up.call(l) ? _.low.call(l) : _.up.call(l);
	            });
	        },
	        type: function(type, fn) {
	            Case[type] = fn;
	            _.types.push(type);
	        }
	    },
	    types = {
	        snake: function(s){ return Case.lower(s, '_'); },
	        constant: function(s){ return Case.upper(s, '_'); },
	        camel: function(s){ return _.decap(Case.pascal(s)); },
	        lower: function(s, fill) {
	            return _.fill(_.low.call(_.prep(s, fill)), fill);
	        },
	        upper: function(s, fill) {
	            return _.fill(_.up.call(_.prep(s, fill, false, true)), fill);
	        },
	        capital: function(s, fill) {
	            return _.fill(_.prep(s).replace(re.capitalize, function(m, border, letter) {
	                return border+_.up.call(letter);
	            }), fill);
	        },
	        pascal: function(s) {
	            return _.fill(_.prep(s, false, true).replace(re.pascal, function(m, border, letter) {
	                return _.up.call(letter);
	            }), '');
	        },
	        title: function(s) {
	            return Case.capital(s).replace(re.improper, function(small) {
	                return _.low.call(small);
	            });
	        },
	        sentence: function(s, names) {
	            s = Case.lower(s).replace(re.sentence, function(m, prelude, letter) {
	                return prelude + _.up.call(letter);
	            });
	            if (names) {
	                names.forEach(function(name) {
	                    s = s.replace(new RegExp('\\b'+Case.lower(name)+'\\b', "g"), _.cap);
	                });
	            }
	            return s;
	        }
	    };
	    
	    // TODO: Remove "squish" in a future breaking release.
	    types.squish = types.pascal;
	
	    for (var type in types) {
	        Case.type(type, types[type]);
	    }
	    // export Case (AMD, commonjs, or global)
	    var define = __webpack_require__(71);
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (typeof module === "object" && module.exports ? module.exports = Case : this.Case = Case), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	}).call(this);


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === "object") {
	    factory(exports);
	  } else {
	    factory(root.babelHelpers = {});
	  }
	})(this, function (global) {
	  var babelHelpers = global;
	
	  babelHelpers._extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];
	
	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }
	
	    return target;
	  };
	})

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyFunction
	 */
	
	function makeEmptyFunction(arg) {
	  return function() {
	    return arg;
	  };
	}
	
	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}
	
	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function() { return this; };
	emptyFunction.thatReturnsArgument = function(arg) { return arg; };
	
	module.exports = emptyFunction;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyObject
	 */
	
	"use strict";
	
	var emptyObject = {};
	
	if ("production" !== process.env.NODE_ENV) {
	  Object.freeze(emptyObject);
	}
	
	module.exports = emptyObject;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])
//# sourceMappingURL=app.js.map