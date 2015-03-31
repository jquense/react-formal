var fake = {};
(function (global) {
  (function (global) {
    var babelHelpers = global.babelHelpers = {};

    babelHelpers.inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) subClass.__proto__ = superClass;
    };

    babelHelpers.applyConstructor = function (Constructor, args) {
      var instance = Object.create(Constructor.prototype);
      var result = Constructor.apply(instance, args);
      return result != null && (typeof result == "object" || typeof result == "function") ? result : instance;
    };

    babelHelpers.taggedTemplateLiteralLoose = function (strings, raw) {
      strings.raw = raw;
      return strings;
    };

    babelHelpers.interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj;
    };

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
  })(typeof global === "undefined" ? self : global);
})(fake);

module.exports = fake.babelHelpers;