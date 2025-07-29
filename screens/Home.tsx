import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';
import { RootStackParamList } from '../App';
import app from './firebaseConfig';
import { getDatabase, ref, get, remove } from 'firebase/database';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


dayjs.extend(customParseFormat);

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const [connectedInfo, setConnectedInfo] = useState<{ mac: string; name: string } | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const totalAmount = filteredRecords.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Dashboard',
      headerStyle: { backgroundColor: '#2196F3' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerRight: () =>
        connectedInfo ? (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
              <Text style={styles.connectedText}>🟢 Printer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.iconButton}>
            <Text style={styles.iconText}>🔌 Connect</Text>
          </TouchableOpacity>
        ),
    });
  }, [navigation, connectedInfo]);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Record', 'Are you sure you want to delete this record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = getDatabase(app);
            await remove(ref(db, `/donations/${id}`));
            setRecords((prev) => prev.filter((item) => item.id !== id));
            setFilteredRecords((prev) => prev.filter((item) => item.id !== id));
          } catch (error) {
            console.error('Delete failed:', error);
            Alert.alert('Error', 'Failed to delete the record.');
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const savedMac = await AsyncStorage.getItem('printer_mac');
        const savedName = await AsyncStorage.getItem('printer_name');
        if (savedMac) {
          try {
            await BLEPrinter.init();
            await BLEPrinter.connectPrinter(savedMac);
            setConnectedInfo({ mac: savedMac, name: savedName || 'Unknown Device' });
          } catch (err) {
            console.error('❌ Reconnect failed:', err);
            setConnectedInfo(null);
            Alert.alert('Reconnect Failed', 'Could not reconnect to the saved printer.');
          }
        } else {
          setConnectedInfo(null);
        }

        const db = getDatabase(app);
        const snapshot = await get(ref(db, '/donations'));
        const firebaseData = snapshot.val();
        if (firebaseData) {
          const loadedRecords = Object.keys(firebaseData).map((key) => ({
            id: key,
            ...firebaseData[key],
          }));
          loadedRecords.sort((a, b) => {
            const dateA = dayjs(a.date, 'DD-MM-YYYY hh:mm A');
            const dateB = dayjs(b.date, 'DD-MM-YYYY hh:mm A');
            return dateB.valueOf() - dateA.valueOf();
          });
          setRecords(loadedRecords);
        } else {
          setRecords([]);
        }
      };

      init();
    }, [])
  );
  const clearFilters = () => {
  // setSearchQuery('');
  setStartDate(null);
  setEndDate(null);
  setTempStartDate(null);
  setTempEndDate(null);
  setFilterModalVisible(false);
};

  useEffect(() => {
    let filtered = records;

    if (searchQuery.trim()) {
      const lowerText = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerText) ||
          item.date.toLowerCase().includes(lowerText) ||
          item.status.toLowerCase().includes(lowerText)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const recordDate = dayjs(item.date, 'DD-MM-YYYY hh:mm A');
        return (
          recordDate.isAfter(dayjs(startDate).startOf('day').subtract(1, 'minute')) &&
          recordDate.isBefore(dayjs(endDate).endOf('day').add(1, 'minute'))
        );
      });
    }

    setFilteredRecords(filtered);
  }, [searchQuery, startDate, endDate, records]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name, Date or Status"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={() => {
            setTempStartDate(startDate);
            setTempEndDate(endDate);
            setFilterModalVisible(true);
          }}
          style={styles.filterButton}
        >
          <Text style={{ fontSize: 18 }}>🔽</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Date</Text>

            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity onPress={() => setStartPickerVisible(true)} style={styles.dateInput}>
              <Text>{tempStartDate ? dayjs(tempStartDate).format('DD-MM-YYYY') : 'Start Date'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity onPress={() => setEndPickerVisible(true)} style={styles.dateInput}>
              <Text>{tempEndDate ? dayjs(tempEndDate).format('DD-MM-YYYY') : 'End Date'}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setStartDate(tempStartDate);
                  setEndDate(tempEndDate);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={{ color: 'white' }}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: 'tomato' }]} onPress={clearFilters}>
                <Text style={{ color: 'white' }}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isStartPickerVisible}
          mode="date"
          onConfirm={(date) => {
            setTempStartDate(date);
            setStartPickerVisible(false);
          }}
          onCancel={() => setStartPickerVisible(false)}
        />
        <DateTimePickerModal
          isVisible={isEndPickerVisible}
          mode="date"
          onConfirm={(date) => {
            setTempEndDate(date);
            setEndPickerVisible(false);
          }}
          onCancel={() => setEndPickerVisible(false)}
        />
      </Modal>

      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('EmployeeForm')} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{filteredRecords.length}</Text>
          <Text style={styles.statLabel}>Total Records</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹ {totalAmount}</Text>
          <Text style={styles.statLabel}>Total Amount</Text>
        </View>
      </View>

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.recordCardWrapper}>
            <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDelete(item.id)}>
              <Text style={{ fontSize: 18, color: 'red' }}>🗑</Text>
            </TouchableOpacity>

            <View style={styles.recordCard}>
              <View style={styles.indexCircle}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>

              <View style={styles.recordContent}>
                <Text style={styles.recordTitle}>{item.name}</Text>
                <Text style={styles.recordDate}>Date: {item.date}</Text>
                <Text style={styles.recordBy}>Received: {item.receiver}</Text>
                <Text style={styles.recordBy}>Status: {item.status}</Text>
              </View>

              <Text style={styles.amountText}>₹ {item.amount}  </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EmployeeForm', {
                    id: item.id,
                    name: item.name,
                    date: item.date,
                    amount: item.amount.toString(),
                    receiver: item.receiver,
                    mobile: item.mobile,
                    paymentMode: item.paymentMode,
                    status: item.status,
                    mode: 'edit',
                  })
                }
              >
                <Text style={{ fontSize: 18 }}>🖨</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={[styles.footer, connectedInfo ? styles.connected : styles.disconnected]}>
        {connectedInfo
          ? `🖨 Connected to: ${connectedInfo.name} (${connectedInfo.mac})`
          : '🔌 No printer connected'}
      </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  iconButton: {
    marginRight: 10,
    padding: 5,
  },
  iconText: {
    fontSize: 18,
  },
  connectedText: {
    fontSize: 16,
    color: 'green',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  connected: {
    color: 'green',
  },
  disconnected: {
    color: 'red',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  recordCardWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    elevation: 1,
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  indexText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recordContent: {
    flex: 1,
  },
  recordTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordDate: {
    fontSize: 12,
    color: '#555',
  },
  recordBy: {
    fontSize: 12,
    color: '#999',
  },
  amountText: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 14,
    paddingHorizontal: 4,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 30,
  },
  deleteIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '85%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 50, // Increased height
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    marginTop: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
});
