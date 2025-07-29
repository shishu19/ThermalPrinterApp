"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var native_1 = require("@react-navigation/native");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var react_native_thermal_receipt_printer_1 = require("react-native-thermal-receipt-printer");
var firebaseConfig_1 = require("./firebaseConfig");
var database_1 = require("firebase/database");
var dayjs_1 = require("dayjs");
var customParseFormat_1 = require("dayjs/plugin/customParseFormat");
//npx react-native run-android
dayjs_1["default"].extend(customParseFormat_1["default"]);
var Home = function (_a) {
    var navigation = _a.navigation;
    var _b = react_1.useState(null), connectedInfo = _b[0], setConnectedInfo = _b[1];
    var _c = react_1.useState([]), records = _c[0], setRecords = _c[1];
    var totalAmount = records.reduce(function (sum, item) { return sum + parseFloat(item.amount); }, 0);
    react_1.useLayoutEffect(function () {
        navigation.setOptions({
            title: 'Dashboard',
            headerStyle: {
                backgroundColor: '#2196F3'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            },
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: function () {
                return connectedInfo ? (react_1["default"].createElement(react_native_1.View, { style: styles.headerRightContainer },
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return navigation.navigate('Setting'); } },
                        react_1["default"].createElement(react_native_1.Text, { style: styles.connectedText }, "\uD83D\uDFE2 Printer")))) : (react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return navigation.navigate('Setting'); }, style: styles.iconButton },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.iconText }, "\uD83D\uDD0C Connect")));
            }
        });
    }, [navigation, connectedInfo]);
    var handleDelete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            react_native_1.Alert.alert('Delete Record', 'Are you sure you want to delete this record?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: function () { return __awaiter(void 0, void 0, void 0, function () {
                        var db, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    db = database_1.getDatabase(firebaseConfig_1["default"]);
                                    return [4 /*yield*/, database_1.remove(database_1.ref(db, "/donations/" + id))];
                                case 1:
                                    _a.sent();
                                    setRecords(function (prev) { return prev.filter(function (item) { return item.id !== id; }); });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    console.error('Delete failed:', error_1);
                                    react_native_1.Alert.alert('Error', 'Failed to delete the record.');
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }
                },
            ]);
            return [2 /*return*/];
        });
    }); };
    native_1.useFocusEffect(react_1.useCallback(function () {
        var init = function () { return __awaiter(void 0, void 0, void 0, function () {
            var savedMac, savedName, err_1, db, snapshot, firebaseData, loadedRecords;
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
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        console.error('❌ Reconnect failed:', err_1);
                        setConnectedInfo(null);
                        react_native_1.Alert.alert('Reconnect Failed', 'Could not reconnect to the saved printer.');
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        setConnectedInfo(null);
                        _a.label = 9;
                    case 9:
                        db = database_1.getDatabase(firebaseConfig_1["default"]);
                        return [4 /*yield*/, database_1.get(database_1.ref(db, '/donations'))];
                    case 10:
                        snapshot = _a.sent();
                        firebaseData = snapshot.val();
                        if (firebaseData) {
                            loadedRecords = Object.keys(firebaseData).map(function (key) { return (__assign({ id: key }, firebaseData[key])); });
                            loadedRecords.sort(function (a, b) {
                                var dateA = dayjs_1["default"](a.date, 'DD-MM-YYYY hh:mm A');
                                var dateB = dayjs_1["default"](b.date, 'DD-MM-YYYY hh:mm A');
                                return dateB.valueOf() - dateA.valueOf(); // Newest first
                            });
                            setRecords(loadedRecords);
                        }
                        else {
                            setRecords([]);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        init();
    }, []));
    return (react_1["default"].createElement(react_native_1.View, { style: styles.container },
        react_1["default"].createElement(react_native_1.View, { style: styles.card },
            react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return navigation.navigate('EmployeeForm'); }, style: styles.addButton },
                react_1["default"].createElement(react_native_1.Text, { style: styles.addButtonText }, "+")),
            react_1["default"].createElement(react_native_1.View, { style: styles.stat },
                react_1["default"].createElement(react_native_1.Text, { style: styles.statValue }, records.length),
                react_1["default"].createElement(react_native_1.Text, { style: styles.statLabel }, "Total Records")),
            react_1["default"].createElement(react_native_1.View, { style: styles.stat },
                react_1["default"].createElement(react_native_1.Text, { style: styles.statValue },
                    "\u20B9 ",
                    totalAmount),
                react_1["default"].createElement(react_native_1.Text, { style: styles.statLabel }, "Total Amount"))),
        react_1["default"].createElement(react_native_1.FlatList, { data: records, keyExtractor: function (item) { return item.id; }, renderItem: function (_a) {
                var item = _a.item, index = _a.index;
                return (react_1["default"].createElement(react_native_1.View, { style: styles.recordCardWrapper },
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.deleteIcon, onPress: function () { return handleDelete(item.id); } },
                        react_1["default"].createElement(react_native_1.Text, { style: { fontSize: 18, color: 'red' } }, "\uD83D\uDDD1")),
                    react_1["default"].createElement(react_native_1.View, { style: styles.recordCard },
                        react_1["default"].createElement(react_native_1.View, { style: styles.indexCircle },
                            react_1["default"].createElement(react_native_1.Text, { style: styles.indexText }, index + 1)),
                        react_1["default"].createElement(react_native_1.View, { style: styles.recordContent },
                            react_1["default"].createElement(react_native_1.Text, { style: styles.recordTitle }, item.name),
                            react_1["default"].createElement(react_native_1.Text, { style: styles.recordDate },
                                "Date: ",
                                item.date),
                            react_1["default"].createElement(react_native_1.Text, { style: styles.recordBy },
                                "Received: ",
                                item.receiver),
                            react_1["default"].createElement(react_native_1.Text, { style: styles.recordBy },
                                "Status: ",
                                item.status)),
                        react_1["default"].createElement(react_native_1.Text, { style: styles.amountText },
                            "\u20B9 ",
                            item.amount,
                            "  "),
                        react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () {
                                return navigation.navigate('EmployeeForm', {
                                    id: item.id,
                                    name: item.name,
                                    date: item.date,
                                    amount: item.amount.toString(),
                                    receiver: item.receiver,
                                    mobile: item.mobile,
                                    paymentMode: item.paymentMode,
                                    status: item.status,
                                    mode: 'edit'
                                });
                            } },
                            react_1["default"].createElement(react_native_1.Text, { style: { fontSize: 18 } }, "\uD83D\uDDA8")))));
            } }),
        react_1["default"].createElement(react_native_1.Text, { style: [
                styles.footer,
                connectedInfo ? styles.connected : styles.disconnected,
            ] }, connectedInfo
            ? "\uD83D\uDDA8 Connected to: " + connectedInfo.name + " (" + connectedInfo.mac + ")"
            : '🔌 No printer connected')));
};
exports["default"] = Home;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5'
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    iconButton: {
        marginRight: 10,
        padding: 5
    },
    iconText: {
        fontSize: 18
    },
    connectedText: {
        fontSize: 16,
        color: 'green'
    },
    footer: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10
    },
    connected: {
        color: 'green'
    },
    disconnected: {
        color: 'red'
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2
    },
    stat: {
        flex: 1,
        alignItems: 'center'
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2196F3'
    },
    statLabel: {
        fontSize: 12,
        color: '#888'
    },
    recordCardWrapper: {
        position: 'relative',
        marginBottom: 10
    },
    recordCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        elevation: 1
    },
    indexCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    indexText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recordContent: {
        flex: 1
    },
    recordTitle: {
        fontWeight: 'bold',
        fontSize: 16
    },
    recordDate: {
        fontSize: 12,
        color: '#555'
    },
    recordBy: {
        fontSize: 12,
        color: '#999'
    },
    amountText: {
        fontWeight: 'bold',
        color: 'green',
        fontSize: 14,
        paddingHorizontal: 4
    },
    addButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    addButtonText: {
        fontSize: 30,
        color: '#fff',
        lineHeight: 30
    },
    deleteIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 4
    }
});
