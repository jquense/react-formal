'use strict';

exports.__esModule = true;
exports.types = exports.Input = exports.Select = exports.Number = exports.Date = exports.Bool = undefined;

var _wrapWithDefaults = require('../util/wrapWithDefaults');

var _wrapWithDefaults2 = _interopRequireDefault(_wrapWithDefaults);

var _Bool = require('./Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _Date = require('./Date');

var _Date2 = _interopRequireDefault(_Date);

var _Number = require('./Number');

var _Number2 = _interopRequireDefault(_Number);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localDt = 'datetime-local';

var types = Object.create(null);

types[''] = types.text = types.string = (0, _wrapWithDefaults2.default)(_Input2.default, { type: 'text' });

types.number = _Number2.default;

types.date = types.time = types.datetime = types[localDt] = _Date2.default;

types.array = types.listbox = (0, _wrapWithDefaults2.default)(_Select2.default, { multiple: true });

types.bool = types.boolean = _Bool2.default;

types.textarea = (0, _wrapWithDefaults2.default)(_Input2.default, { tagName: 'textarea' });

types.select = _Select2.default;

exports.Bool = _Bool2.default;
exports.Date = _Date2.default;
exports.Number = _Number2.default;
exports.Select = _Select2.default;
exports.Input = _Input2.default;
exports.types = types;