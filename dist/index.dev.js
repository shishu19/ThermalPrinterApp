"use strict";

var _reactNative = require("react-native");

var _App = _interopRequireDefault(require("./App"));

var _app = require("./app.json");

require("react-native-get-random-values");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @format
 */
// eslint-disable-next-line no-undef
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;

_reactNative.AppRegistry.registerComponent(_app.name, function () {
  return _App["default"];
});