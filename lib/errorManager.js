'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = errorManager;

var _universalPromise = require('universal-promise');

var _universalPromise2 = _interopRequireDefault(_universalPromise);

var _errToJSON = require('./util/errToJSON');

var _errToJSON2 = _interopRequireDefault(_errToJSON);

var _paths = require('./util/paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isValidationError = function isValidationError(err) {
  return err && err.name === 'ValidationError';
};

function errorManager(handleValidation) {
  function validatePath(name, context, errors) {
    return _universalPromise2.default.resolve(handleValidation(name, context)).then(function (validationError) {
      if (!validationError) return true;

      if (!isValidationError(validationError)) throw validationError;

      (0, _errToJSON2.default)(validationError, errors);
    });
  }

  return {
    collect: function collect(paths) {
      var pristineErrors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments[2];

      paths = (0, _paths.reduce)([].concat(paths));

      var errors = _extends({}, pristineErrors);
      var nextErrors = errors;
      var workDone = false;

      var validations = paths.map(function (path) {
        nextErrors = (0, _paths.trim)(path, nextErrors);

        if (errors !== nextErrors) {
          workDone = true;
        }

        return validatePath(path, options, nextErrors);
      });

      return _universalPromise2.default.all(validations).then(function (results) {
        if (!workDone && results.every(Boolean)) return pristineErrors;

        return nextErrors;
      });
    }
  };
}
module.exports = exports['default'];