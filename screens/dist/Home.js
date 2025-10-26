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
// src/screens/Home.tsx
var react_1 = require("react");
var react_native_1 = require("react-native");
var native_1 = require("@react-navigation/native");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var react_native_thermal_receipt_printer_1 = require("react-native-thermal-receipt-printer");
var firebaseConfig_1 = require("./firebaseConfig");
var database_1 = require("firebase/database");
var dayjs_1 = require("dayjs");
var customParseFormat_1 = require("dayjs/plugin/customParseFormat");
var react_native_modal_datetime_picker_1 = require("react-native-modal-datetime-picker");
var react_native_fs_1 = require("react-native-fs");
var xlsx_1 = require("xlsx");
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
dayjs_1["default"].extend(customParseFormat_1["default"]);
var Home = function (_a) {
    var navigation = _a.navigation;
    var _b = react_1.useState(null), connectedInfo = _b[0], setConnectedInfo = _b[1];
    var _c = react_1.useState([]), records = _c[0], setRecords = _c[1];
    var _d = react_1.useState([]), filteredRecords = _d[0], setFilteredRecords = _d[1];
    var _e = react_1.useState(''), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = react_1.useState(null), startDate = _f[0], setStartDate = _f[1];
    var _g = react_1.useState(null), endDate = _g[0], setEndDate = _g[1];
    var _h = react_1.useState(false), isStartPickerVisible = _h[0], setStartPickerVisible = _h[1];
    var _j = react_1.useState(false), isEndPickerVisible = _j[0], setEndPickerVisible = _j[1];
    var _k = react_1.useState(false), filterModalVisible = _k[0], setFilterModalVisible = _k[1];
    var _l = react_1.useState(null), tempStartDate = _l[0], setTempStartDate = _l[1];
    var _m = react_1.useState(null), tempEndDate = _m[0], setTempEndDate = _m[1];
    var _o = react_1.useState(false), downloadModalVisible = _o[0], setDownloadModalVisible = _o[1];
    var _p = react_1.useState('xlsx'), downloadFormat = _p[0], setDownloadFormat = _p[1];
    var _q = react_1.useState(true), loading = _q[0], setLoading = _q[1];
    var totalAmount = filteredRecords.reduce(function (sum, item) { return sum + parseFloat(item.amount); }, 0);
    react_1.useLayoutEffect(function () {
        navigation.setOptions({
            title: 'Dashboard',
            headerStyle: { backgroundColor: '#2196F3' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
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
                                    setFilteredRecords(function (prev) { return prev.filter(function (item) { return item.id !== id; }); });
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
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, async_storage_1["default"].getItem('printer_mac')];
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
                                return dateB.valueOf() - dateA.valueOf();
                            });
                            setRecords(loadedRecords);
                        }
                        else {
                            setRecords([]);
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        init();
    }, []));
    var clearFilters = function () {
        // setSearchQuery('');
        setStartDate(null);
        setEndDate(null);
        setTempStartDate(null);
        setTempEndDate(null);
        setFilterModalVisible(false);
    };
    react_1.useEffect(function () {
        var filtered = records;
        if (searchQuery.trim()) {
            var lowerText_1 = searchQuery.toLowerCase();
            filtered = filtered.filter(function (item) {
                return item.name.toLowerCase().includes(lowerText_1) ||
                    item.date.toLowerCase().includes(lowerText_1) ||
                    item.status.toLowerCase().includes(lowerText_1) ||
                    (item.serialNumber && item.serialNumber.toString().toLowerCase().includes(lowerText_1));
            });
        }
        if (startDate && endDate) {
            filtered = filtered.filter(function (item) {
                var recordDate = dayjs_1["default"](item.date, 'DD-MM-YYYY hh:mm A');
                return (recordDate.isAfter(dayjs_1["default"](startDate).startOf('day').subtract(1, 'minute')) &&
                    recordDate.isBefore(dayjs_1["default"](endDate).endOf('day').add(1, 'minute')));
            });
        }
        setFilteredRecords(filtered);
    }, [searchQuery, startDate, endDate, records]);
    var handleDownload = function () { return __awaiter(void 0, void 0, void 0, function () {
        var ws, wb, wbout, now, dateTime, path, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (filteredRecords.length === 0) {
                        react_native_1.Alert.alert('No Data', 'No records available to download.');
                        return [2 /*return*/];
                    }
                    if (!(downloadFormat === 'xlsx')) return [3 /*break*/, 2];
                    ws = xlsx_1["default"].utils.json_to_sheet(filteredRecords);
                    wb = xlsx_1["default"].utils.book_new();
                    xlsx_1["default"].utils.book_append_sheet(wb, ws, 'Donations');
                    wbout = xlsx_1["default"].write(wb, { type: 'base64', bookType: 'xlsx' });
                    now = new Date();
                    dateTime = "" + now.getFullYear() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + "_" + now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0') + now.getSeconds().toString().padStart(2, '0');
                    path = react_native_fs_1["default"].DownloadDirectoryPath + "/donations_" + dateTime + ".xlsx";
                    return [4 /*yield*/, react_native_fs_1["default"].writeFile(path, wbout, 'base64')];
                case 1:
                    _a.sent();
                    react_native_1.Alert.alert('Success', "File saved to: " + path);
                    return [3 /*break*/, 2];
                case 2:
                    setDownloadModalVisible(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    react_native_1.Alert.alert('Error', 'Download failed.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(react_native_1.View, { style: styles.container },
        react_1["default"].createElement(react_native_1.View, { style: styles.searchRow },
            react_1["default"].createElement(react_native_1.TextInput, { style: styles.searchInput, placeholder: "Search by Name, Date or Status", value: searchQuery, onChangeText: setSearchQuery }),
            react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () {
                    setTempStartDate(startDate);
                    setTempEndDate(endDate);
                    setFilterModalVisible(true);
                }, style: styles.filterButton },
                react_1["default"].createElement(react_native_1.Text, { style: { fontSize: 18 } }, "\uD83D\uDD3D"))),
        react_1["default"].createElement(react_native_1.Modal, { visible: filterModalVisible, transparent: true, animationType: "slide" },
            react_1["default"].createElement(react_native_1.View, { style: styles.modalOverlay },
                react_1["default"].createElement(react_native_1.View, { style: styles.modalContent },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.modalTitle }, "Filter by Date"),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "Start Date"),
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return setStartPickerVisible(true); }, style: styles.dateInput },
                        react_1["default"].createElement(react_native_1.Text, null, tempStartDate ? dayjs_1["default"](tempStartDate).format('DD-MM-YYYY') : 'Start Date')),
                    react_1["default"].createElement(react_native_1.Text, { style: styles.label }, "End Date"),
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return setEndPickerVisible(true); }, style: styles.dateInput },
                        react_1["default"].createElement(react_native_1.Text, null, tempEndDate ? dayjs_1["default"](tempEndDate).format('DD-MM-YYYY') : 'End Date')),
                    react_1["default"].createElement(react_native_1.View, { style: styles.modalButtonRow },
                        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.modalBtn, onPress: function () {
                                setStartDate(tempStartDate);
                                setEndDate(tempEndDate);
                                setFilterModalVisible(false);
                            } },
                            react_1["default"].createElement(react_native_1.Text, { style: { color: 'white' } }, "Apply")),
                        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [styles.modalBtn, { backgroundColor: '#ccc' }], onPress: function () { return setFilterModalVisible(false); } },
                            react_1["default"].createElement(react_native_1.Text, null, "Cancel")),
                        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [styles.modalBtn, { backgroundColor: 'tomato' }], onPress: clearFilters },
                            react_1["default"].createElement(react_native_1.Text, { style: { color: 'white' } }, "Clear"))))),
            react_1["default"].createElement(react_native_modal_datetime_picker_1["default"], { isVisible: isStartPickerVisible, mode: "date", onConfirm: function (date) {
                    setTempStartDate(date);
                    setStartPickerVisible(false);
                }, onCancel: function () { return setStartPickerVisible(false); } }),
            react_1["default"].createElement(react_native_modal_datetime_picker_1["default"], { isVisible: isEndPickerVisible, mode: "date", onConfirm: function (date) {
                    setTempEndDate(date);
                    setEndPickerVisible(false);
                }, onCancel: function () { return setEndPickerVisible(false); } })),
        react_1["default"].createElement(react_native_1.View, { style: styles.card },
            react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return navigation.navigate('EmployeeForm'); }, style: styles.addButton },
                react_1["default"].createElement(react_native_1.Text, { style: styles.addButtonText }, "+")),
            react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return setDownloadModalVisible(true); }, style: [styles.addButton, { backgroundColor: '#4CAF50' }] },
                react_1["default"].createElement(react_native_1.Text, { style: styles.downloadButtonText }, "\u2193")),
            react_1["default"].createElement(react_native_1.View, { style: styles.stat },
                react_1["default"].createElement(react_native_1.Text, { style: styles.statValue }, filteredRecords.length),
                react_1["default"].createElement(react_native_1.Text, { style: styles.statLabel }, "Total Records")),
            react_1["default"].createElement(react_native_1.View, { style: styles.stat },
                react_1["default"].createElement(react_native_1.Text, { style: styles.statValue },
                    "\u20B9 ",
                    totalAmount),
                react_1["default"].createElement(react_native_1.Text, { style: styles.statLabel }, "Total Amount"))),
        loading ? (react_1["default"].createElement(react_native_1.View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
            react_1["default"].createElement(react_native_1.ActivityIndicator, { size: "large", color: "#2196F3" }),
            react_1["default"].createElement(react_native_1.Text, null, "Loading records..."))) : filteredRecords.length === 0 ? (react_1["default"].createElement(react_native_1.View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
            react_1["default"].createElement(react_native_1.Text, null, "No records found."))) : (react_1["default"].createElement(react_native_1.FlatList, { data: filteredRecords, keyExtractor: function (item) { return item.id; }, renderItem: function (_a) {
                var _b;
                var item = _a.item, index = _a.index;
                return (react_1["default"].createElement(react_native_1.View, { style: styles.recordCardWrapper },
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.deleteIcon, onPress: function () { return handleDelete(item.id); } },
                        react_1["default"].createElement(react_native_1.Text, { style: { fontSize: 18, color: 'red' } }, "\uD83D\uDDD1")),
                    react_1["default"].createElement(react_native_1.View, { style: styles.recordCard },
                        react_1["default"].createElement(react_native_1.View, { style: styles.indexCircle },
                            react_1["default"].createElement(react_native_1.Text, { style: styles.indexText }, index + 1)),
                        react_1["default"].createElement(react_native_1.View, { style: styles.recordContent },
                            react_1["default"].createElement(react_native_1.Text, { style: styles.recordTitle }, item.name),
                            react_1["default"].createElement(react_native_1.Text, { style: styles.recordBy },
                                "Serial No: ", (_b = item.serialNumber) !== null && _b !== void 0 ? _b : '—'),
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
                                var _a;
                                return navigation.navigate('EmployeeForm', {
                                    id: item.id,
                                    serialNumber: (_a = item.serialNumber) !== null && _a !== void 0 ? _a : '',
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
            } })),
        react_1["default"].createElement(react_native_1.Text, { style: [styles.footer, connectedInfo ? styles.connected : styles.disconnected] }, connectedInfo
            ? "\uD83D\uDDA8 Connected to: " + connectedInfo.name + " (" + connectedInfo.mac + ")"
            : '🔌 No printer connected'),
        react_1["default"].createElement(react_native_1.Modal, { visible: downloadModalVisible, transparent: true, animationType: "slide" },
            react_1["default"].createElement(react_native_1.View, { style: styles.modalOverlay },
                react_1["default"].createElement(react_native_1.View, { style: styles.modalContent },
                    react_1["default"].createElement(react_native_1.Text, { style: styles.modalTitle }, "Select Download Format"),
                    react_1["default"].createElement(react_native_1.TouchableOpacity, { onPress: function () { return setDownloadFormat('xlsx'); }, style: styles.radioRow },
                        react_1["default"].createElement(react_native_1.Text, { style: styles.radioCircle }, downloadFormat === 'xlsx' ? '🔘' : '⚪'),
                        react_1["default"].createElement(react_native_1.Text, { style: styles.radioLabel }, "Excel (.xlsx)")),
                    react_1["default"].createElement(react_native_1.View, { style: styles.modalButtonRow },
                        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: styles.modalBtn, onPress: handleDownload },
                            react_1["default"].createElement(react_native_1.Text, { style: { color: 'white' } }, "Download")),
                        react_1["default"].createElement(react_native_1.TouchableOpacity, { style: [styles.modalBtn, { backgroundColor: '#ccc' }], onPress: function () { return setDownloadModalVisible(false); } },
                            react_1["default"].createElement(react_native_1.Text, null, "Cancel"))))))));
};
exports["default"] = Home;
var styles = react_native_1.StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
    headerRightContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
    iconButton: { marginRight: 10, padding: 5 },
    iconText: { fontSize: 18 },
    connectedText: { fontSize: 16, color: 'green' },
    footer: { textAlign: 'center', fontSize: 14, marginTop: 10, marginBottom: 10 },
    connected: { color: 'green' },
    disconnected: { color: 'red' },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2
    },
    stat: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#2196F3' },
    statLabel: { fontSize: 12, color: '#888' },
    recordCardWrapper: { position: 'relative', marginBottom: 10 },
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
    indexText: { color: '#fff', fontWeight: 'bold' },
    recordContent: { flex: 1 },
    recordTitle: { fontWeight: 'bold', fontSize: 16 },
    recordDate: { fontSize: 12, color: '#555' },
    recordBy: { fontSize: 12, color: '#999' },
    amountText: { fontWeight: 'bold', color: 'green', fontSize: 14, paddingHorizontal: 4 },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    addButtonText: { fontSize: 30, color: '#fff', lineHeight: 30 },
    downloadButtonText: { fontSize: 30, color: '#fff', lineHeight: 35, marginTop: -5 },
    deleteIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 4
    },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        borderColor: '#ccc',
        borderWidth: 1
    },
    filterButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        width: '85%',
        padding: 20,
        borderRadius: 10,
        elevation: 5
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    modalBtn: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#2196F3',
        alignItems: 'center'
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        height: 50,
        justifyContent: 'center'
    },
    label: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
        marginTop: 10
    },
    dateText: {
        fontSize: 16,
        color: '#000'
    },
    radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    radioCircle: { fontSize: 22, marginRight: 8 },
    radioLabel: { fontSize: 16 }
});
