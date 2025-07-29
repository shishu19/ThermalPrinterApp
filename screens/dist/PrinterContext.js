"use strict";
exports.__esModule = true;
exports.usePrinter = exports.PrinterProvider = void 0;
var react_1 = require("react");
var PrinterContext = react_1.createContext(null);
exports.PrinterProvider = function (_a) {
    var children = _a.children;
    var _b = react_1.useState(''), macAddress = _b[0], setMacAddress = _b[1];
    var _c = react_1.useState(false), connected = _c[0], setConnected = _c[1];
    return (react_1["default"].createElement(PrinterContext.Provider, { value: { macAddress: macAddress, connected: connected, setMacAddress: setMacAddress, setConnected: setConnected } }, children));
};
exports.usePrinter = function () {
    var context = react_1.useContext(PrinterContext);
    if (!context) {
        throw new Error('usePrinter must be used within a PrinterProvider');
    }
    return context;
};
