"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_thermal_receipt_printer_1 = require("react-native-thermal-receipt-printer");
var async_storage_1 = require("@react-native-async-storage/async-storage");
// import { printSampleReceipt } from './printer';
var Setting = function () {
    var _a = react_1.useState([]), printers = _a[0], setPrinters = _a[1];
    var _b = react_1.useState(''), macAddress = _b[0], setMacAddress = _b[1];
    var _c = react_1.useState(''), deviceName = _c[0], setDeviceName = _c[1];
    var _d = react_1.useState(false), connected = _d[0], setConnected = _d[1];
    var requestPermissions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var granted, allGranted, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(react_native_1.Platform.OS === 'android')) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, react_native_1.PermissionsAndroid.requestMultiple([
                            react_native_1.PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                            react_native_1.PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                            react_native_1.PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        ])];
                case 2:
                    granted = _a.sent();
                    allGranted = Object.values(granted).every(function (p) { return p === react_native_1.PermissionsAndroid.RESULTS.GRANTED; });
                    if (!allGranted) {
                        react_native_1.Alert.alert('Permission Denied', 'Bluetooth permissions are required to scan and connect to printers.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.warn('Permission error:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var scanPrinters = function () { return __awaiter(void 0, void 0, void 0, function () {
        var deviceList, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.getDeviceList()];
                case 2:
                    deviceList = _a.sent();
                    setPrinters(deviceList);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Scan error:', err_1);
                    react_native_1.Alert.alert('Scan Failed', 'Could not get printer list.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var connectToPrinter = function (address, name) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.connectPrinter(address)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, async_storage_1["default"].setItem('printer_mac', address)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, async_storage_1["default"].setItem('printer_name', name)];
                case 3:
                    _a.sent();
                    setMacAddress(address);
                    setDeviceName(name);
                    setConnected(true);
                    react_native_1.Alert.alert('Connected', "Printer connected:\n" + name + "\n(" + address + ")");
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Connection error:', error_2);
                    react_native_1.Alert.alert('Failed', 'Unable to connect to printer.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Function to print a test receipt not use
    var printTest = function () {
        if (!connected) {
            react_native_1.Alert.alert('Printer Not Connected', 'Please connect to a printer first.');
            return;
        }
        react_native_thermal_receipt_printer_1.BLEPrinter.printText("\n=========================\n        XY STORE\n     123 Main Street\n      Phone: +91-987\n=========================\nItem        Qty   Price\n-------------------------\nMilk         2    25.00\nBread        1    30.00\nButter       1    45.00\nEggs         1    60.00\n-------------------------\nSubtotal              \nGST 5%                \n-------------------------\nGrand Total           \n=========================\n     THANK YOU VISIT\n=========================\n      ");
    };
    react_1.useEffect(function () {
        var init = function () { return __awaiter(void 0, void 0, void 0, function () {
            var savedMac, savedName, err_2, devices, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, requestPermissions()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 13, , 14]);
                        return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.init()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, async_storage_1["default"].getItem('printer_mac')];
                    case 4:
                        savedMac = _a.sent();
                        return [4 /*yield*/, async_storage_1["default"].getItem('printer_name')];
                    case 5:
                        savedName = _a.sent();
                        if (!(savedMac && savedName)) return [3 /*break*/, 11];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 11]);
                        return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.connectPrinter(savedMac)];
                    case 7:
                        _a.sent();
                        setMacAddress(savedMac);
                        setDeviceName(savedName);
                        setConnected(true);
                        return [3 /*break*/, 11];
                    case 8:
                        err_2 = _a.sent();
                        console.warn('Auto-reconnect failed:', err_2);
                        return [4 /*yield*/, async_storage_1["default"].removeItem('printer_mac')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, async_storage_1["default"].removeItem('printer_name')];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 11: return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.getDeviceList()];
                    case 12:
                        devices = _a.sent();
                        setPrinters(devices);
                        return [3 /*break*/, 14];
                    case 13:
                        err_3 = _a.sent();
                        console.error('Initialization failed:', err_3);
                        react_native_1.Alert.alert('Error', 'Failed to initialize printer module.');
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        }); };
        init();
    }, []);
    return (react_1["default"].createElement(react_native_1.ScrollView, { contentContainerStyle: styles.container },
        react_1["default"].createElement(react_native_1.Text, { style: styles.title }, "Printer Settings"),
        react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Available Printers:"),
        printers.length > 0 ? (printers.map(function (printer, index) { return (react_1["default"].createElement(react_native_1.TouchableOpacity, { key: index, style: styles.printerItem, onPress: function () { return connectToPrinter(printer.inner_mac_address, printer.device_name); } },
            react_1["default"].createElement(react_native_1.Text, { style: styles.printerName }, printer.device_name),
            react_1["default"].createElement(react_native_1.Text, { style: styles.macAddress }, printer.inner_mac_address))); })) : (react_1["default"].createElement(react_native_1.Text, { style: { marginBottom: 10 } }, "No printers found. Please scan again.")),
        react_1["default"].createElement(react_native_1.Text, { style: { textAlign: 'center', color: connected ? 'green' : 'red', marginVertical: 10 } }, connected
            ? "\uD83D\uDDA8 Connected to " + deviceName + " (" + macAddress + ")"
            : '🔌 Printer not connected'),
        react_1["default"].createElement(react_native_1.View, { style: styles.button },
            react_1["default"].createElement(react_native_1.Button, { title: "Rescan Printers", onPress: scanPrinters }))));
};
var styles = react_native_1.StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: '#FFF'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        marginBottom: 10
    },
    printerItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10
    },
    printerName: {
        fontSize: 16,
        fontWeight: '600'
    },
    macAddress: {
        fontSize: 13,
        color: '#555',
        marginTop: 4
    },
    button: {
        marginVertical: 10
    }
});
exports["default"] = Setting;
