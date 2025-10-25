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
var picker_1 = require("@react-native-picker/picker");
var Printer_1 = require("./Printer");
var react_native_thermal_receipt_printer_1 = require("react-native-thermal-receipt-printer");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var native_1 = require("@react-navigation/native");
var database_1 = require("firebase/database");
var firebaseConfig_1 = require("./firebaseConfig");
var uuid_1 = require("uuid");
var EmployeeForm = function (_a) {
    var route = _a.route, navigation = _a.navigation;
    var _b = route.params || {}, _c = _b.id, id = _c === void 0 ? '' : _c, _d = _b.serialNumber, initialSerialNumber = _d === void 0 ? '' : _d, _e = _b.name, initialName = _e === void 0 ? '' : _e, _f = _b.amount, initialAmount = _f === void 0 ? '' : _f, _g = _b.receiver, initialReceiver = _g === void 0 ? '' : _g, _h = _b.mobile, initialMobile = _h === void 0 ? '' : _h, _j = _b.paymentMode, initialPaymentMode = _j === void 0 ? 'Cash' : _j, _k = _b.status, initialStatus = _k === void 0 ? 'Pending' : _k, _l = _b.date, initialDate = _l === void 0 ? '' : _l, // ✅ incoming date from Home
    _m = _b.mode, // ✅ incoming date from Home
    mode = _m === void 0 ? 'add' : _m;
    var isEditMode = mode === 'edit';
    var _o = react_1.useState(initialName), name = _o[0], setName = _o[1];
    var _p = react_1.useState(initialSerialNumber || ''), serialNumber = _p[0], setSerialNumber = _p[1];
    var _q = react_1.useState(initialAmount ? String(initialAmount) : ''), amount = _q[0], setAmount = _q[1];
    var _r = react_1.useState(initialReceiver), receiver = _r[0], setReceiver = _r[1];
    var _s = react_1.useState(initialMobile), mobile = _s[0], setMobile = _s[1];
    var _t = react_1.useState(initialPaymentMode), paymentMode = _t[0], setPaymentMode = _t[1];
    var _u = react_1.useState(initialStatus), status = _u[0], setStatus = _u[1];
    var _v = react_1.useState(isEditMode), showPreview = _v[0], setShowPreview = _v[1];
    var _w = react_1.useState(!isEditMode), isEditing = _w[0], setIsEditing = _w[1];
    var _x = react_1.useState(null), connectedInfo = _x[0], setConnectedInfo = _x[1];
    var _y = react_1.useState(false), loading = _y[0], setLoading = _y[1];
    var _z = react_1.useState(false), printing = _z[0], setPrinting = _z[1];
    var _0 = react_1.useState(initialDate || ''), date = _0[0], setDate = _0[1]; // ✅ Store the correct date
    // ✅ Generate unique serial number with date
    var generateSerialNumber = function () {
        var now = new Date();
        var datePart = "" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
        var randomPart = Math.floor(1000 + Math.random() * 9000); // random 4-digit
        return "SN-" + datePart + "-" + randomPart;
    };
    react_1.useEffect(function () {
        if (!isEditMode && !serialNumber) {
            var newSN = generateSerialNumber();
            setSerialNumber(newSN);
            var now = new Date();
            setDate(getCurrentDateTime());
        }
    }, [isEditMode, serialNumber, date]);
    native_1.useFocusEffect(react_1.useCallback(function () {
        var reconnectPrinter = function () { return __awaiter(void 0, void 0, void 0, function () {
            var savedMac, savedName, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, async_storage_1["default"].getItem('printer_mac')];
                    case 1:
                        savedMac = _a.sent();
                        return [4 /*yield*/, async_storage_1["default"].getItem('printer_name')];
                    case 2:
                        savedName = _a.sent();
                        if (!savedMac) return [3 /*break*/, 8];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.init()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, react_native_thermal_receipt_printer_1.BLEPrinter.connectPrinter(savedMac)];
                    case 5:
                        _a.sent();
                        setConnectedInfo({ mac: savedMac, name: savedName || 'Unknown Device' });
                        global.printerConnected = true;
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        console.error('❌ Reconnect failed:', err_1);
                        setConnectedInfo(null);
                        global.printerConnected = false;
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        setConnectedInfo(null);
                        global.printerConnected = false;
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        reconnectPrinter();
    }, []));
    react_1.useLayoutEffect(function () {
        navigation.setOptions({
            title: 'Donation',
            headerStyle: { backgroundColor: '#2196F3' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerRight: function () {
                return connectedInfo ? (react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return navigation.navigate('Setting'); }, style: { marginRight: 10 } },
                    react_1["default"].createElement(react_native_1.Text, { style: { fontSize: 16, color: 'green' } }, "\uD83D\uDFE2 Printer"))) : (react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return navigation.navigate('Setting'); }, style: { marginRight: 10 } },
                    react_1["default"].createElement(react_native_1.Text, { style: { fontSize: 16 } }, "\uD83D\uDD0C Connect")));
            }
        });
    }, [navigation, connectedInfo]);
    var formatDate = function (inputDate) {
        var day = String(inputDate.getDate()).padStart(2, '0');
        var month = String(inputDate.getMonth() + 1).padStart(2, '0');
        var year = inputDate.getFullYear();
        var hours = inputDate.getHours();
        var minutes = String(inputDate.getMinutes()).padStart(2, '0');
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        var formattedHours = String(hours).padStart(2, '0');
        return day + "-" + month + "-" + year + " " + formattedHours + ":" + minutes + " " + ampm;
    };
    var getCurrentDateTime = function () { return formatDate(new Date()); };
    var validateFields = function () {
        if (!name.trim() || !amount.trim() || !receiver.trim()) {
            react_native_1.Alert.alert('Validation Error', 'Name, Amount and Receiver are required.');
            return false;
        }
        if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
            react_native_1.Alert.alert('Validation Error', 'Invalid 10-digit mobile number.');
            return false;
        }
        return true;
    };
    var handleAddOrEdit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, db, donationRef, donationId, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!validateFields())
                        return [2 /*return*/];
                    setLoading(true);
                    formData = {
                        serialNumber: serialNumber,
                        name: name.trim(),
                        amount: parseFloat(amount) || 0,
                        receiver: receiver.trim(),
                        mobile: mobile.trim(),
                        paymentMode: paymentMode,
                        status: status,
                        date: date
                    };
                    db = database_1.getDatabase(firebaseConfig_1["default"]);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    if (!(isEditMode && id)) return [3 /*break*/, 3];
                    donationRef = database_1.ref(db, "/donations/" + id);
                    return [4 /*yield*/, database_1.update(donationRef, formData)];
                case 2:
                    _c.sent();
                    react_native_1.Alert.alert('✅ Updated Successfully');
                    return [3 /*break*/, 5];
                case 3:
                    donationId = uuid_1.v4();
                    return [4 /*yield*/, database_1.set(database_1.ref(db, "/donations/" + donationId), formData)];
                case 4:
                    _c.sent();
                    react_native_1.Alert.alert('✅ Donation Added Successfully', '', [
                        {
                            text: 'OK',
                            onPress: function () {
                                setIsEditing(false);
                                setShowPreview(true);
                            }
                        },
                    ]);
                    return [2 /*return*/];
                case 5:
                    setIsEditing(false);
                    setShowPreview(true);
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _c.sent();
                    console.error('❌ Firebase Error:', (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _a !== void 0 ? _a : error_1);
                    react_native_1.Alert.alert('Error', "Failed to save donation: " + ((_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _b !== void 0 ? _b : 'Unknown error'));
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handlePrint = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validateFields())
                        return [2 /*return*/];
                    if (!global.printerConnected) {
                        react_native_1.Alert.alert('Printer Error', 'Printer not connected!');
                        return [2 /*return*/];
                    }
                    setPrinting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, Printer_1.printSampleReceipt(name, date, // ✅ Use correct stored date
                        amount, receiver, mobile, paymentMode, status, serialNumber)];
                case 2:
                    success = _a.sent();
                    if (success) {
                        navigation.navigate('Home');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    setPrinting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditClick = function () {
        // ✅ Only update date when user clicks ✏️ to edit
        var updatedDate = getCurrentDateTime();
        setDate(updatedDate);
        setIsEditing(true);
        setShowPreview(false);
    };
    return (react_1["default"].createElement(react_native_1.View, { style: styles.wrapper },
        react_1["default"].createElement(react_native_1.ScrollView, { contentContainerStyle: styles.container },
            isEditing && (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Serial Number"),
                react_1["default"].createElement(react_native_1.TextInput, { style: [styles.input, { backgroundColor: '#f2f2f2' }], value: serialNumber, editable: false }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Date"),
                react_1["default"].createElement(react_native_1.TextInput, { style: [styles.input, { backgroundColor: '#f2f2f2' }], value: date, editable: false }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Donor Name *"),
                react_1["default"].createElement(react_native_1.TextInput, { style: styles.input, value: name, onChangeText: setName }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Donation Amount *"),
                react_1["default"].createElement(react_native_1.TextInput, { style: styles.input, value: amount, onChangeText: setAmount, keyboardType: "numeric" }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Received By *"),
                react_1["default"].createElement(react_native_1.TextInput, { style: styles.input, value: receiver, onChangeText: setReceiver }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Mobile"),
                react_1["default"].createElement(react_native_1.TextInput, { style: styles.input, value: mobile, onChangeText: setMobile, keyboardType: "phone-pad", maxLength: 10 }),
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Payment Mode"),
                react_1["default"].createElement(react_native_1.View, { style: styles.pickerWrapper },
                    react_1["default"].createElement(picker_1.Picker, { selectedValue: paymentMode, onValueChange: setPaymentMode, style: styles.picker },
                        react_1["default"].createElement(picker_1.Picker.Item, { label: "Cash", value: "Cash" }),
                        react_1["default"].createElement(picker_1.Picker.Item, { label: "Online", value: "Online" }),
                        react_1["default"].createElement(picker_1.Picker.Item, { label: "Cheque", value: "Cheque" }))),
                react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Status"),
                react_1["default"].createElement(react_native_1.View, { style: styles.pickerWrapper },
                    react_1["default"].createElement(picker_1.Picker, { selectedValue: status, onValueChange: setStatus, style: styles.picker },
                        react_1["default"].createElement(picker_1.Picker.Item, { label: "Pending", value: "Pending" }),
                        react_1["default"].createElement(picker_1.Picker.Item, { label: "Paid", value: "Paid" }))),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [styles.button, loading && { backgroundColor: '#aaa' }], onPress: handleAddOrEdit, disabled: loading },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.buttonText }, loading ? 'Please wait...' : isEditMode ? 'Save' : 'Add')))),
            !isEditing && showPreview && (react_1["default"].createElement(react_native_1.View, { style: styles.previewBox },
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewText }, "====================================="),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewCenter }, "THE MAHARASHTRA AYYAPPA"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewCenter }, "SEVA SANGHAM (REGD.)"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewCenter }, "Regd. No: MAH-373/Thane."),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewCenter }, "Mohone"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewText }, "-------------------------------------"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewCenter }, "|| Swamiye Saranam Ayyappa ||"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewText }, "====================================="),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewLine },
                    "Serial No : ",
                    serialNumber),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewLine },
                    "Name      : ",
                    name),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewLine },
                    "Date      : ",
                    date),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewLine },
                    "Amount    : Rs ",
                    amount),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewLine },
                    "Receiver  : ",
                    receiver),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewLine },
                    "Payment   : ",
                    paymentMode),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewLine },
                    "Status    : ",
                    status),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewText }, "-------------------------------------"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewCenter }, "Thank you for your support!"),
                react_1["default"].createElement(react_native_1.Text, { style: styles.previewText }, "====================================="),
                react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [styles.printButton, printing && { backgroundColor: '#aaa' }], onPress: handlePrint, disabled: printing },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.printButtonText }, printing ? 'Printing...' : '🖨️ Print')),
                isEditMode && (react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: handleEditClick, style: styles.editIcon },
                    react_1["default"].createElement(react_native_1.Text, { style: { color: '#fff', fontSize: 18 } }, "\u270F\uFE0F")))))),
        react_1["default"].createElement(react_native_1.Text, { style: [styles.footer, connectedInfo ? styles.connected : styles.disconnected] }, connectedInfo
            ? "\uD83D\uDDA8 Connected to: " + connectedInfo.name + " (" + connectedInfo.mac + ")"
            : '🔌 No printer connected')));
};
exports["default"] = EmployeeForm;
var styles = react_native_1.StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' },
    container: { padding: 20, paddingBottom: 40 },
    label: { marginTop: 12, marginBottom: 4, fontWeight: 'bold', color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, color: '#000' },
    pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12, overflow: 'hidden' },
    picker: { height: 52, color: '#000' },
    button: { backgroundColor: '#2196F3', padding: 12, borderRadius: 6, marginVertical: 16 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    previewBox: { backgroundColor: '#f5f5f5', padding: 14, borderRadius: 8, marginTop: 10 },
    previewText: { fontSize: 14, color: '#000', textAlign: 'center', fontFamily: 'monospace' },
    previewCenter: { textAlign: 'center', fontWeight: 'bold', fontSize: 15, color: '#000', fontFamily: 'monospace' },
    previewLine: { fontSize: 15, color: '#000', fontFamily: 'monospace', marginVertical: 1 },
    printButton: { marginTop: 12, backgroundColor: '#FF9800', padding: 10, borderRadius: 6 },
    printButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    editIcon: {
        marginTop: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#2196F3',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: { textAlign: 'center', fontSize: 14, padding: 12, backgroundColor: '#f9f9f9', borderColor: '#ddd' },
    connected: { color: 'green' },
    disconnected: { color: 'red' }
});
