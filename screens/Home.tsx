import React, { useLayoutEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
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
//npx react-native run-android
dayjs.extend(customParseFormat);

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const [connectedInfo, setConnectedInfo] = useState<{ mac: string; name: string } | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  const totalAmount = records.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Dashboard',
      headerStyle: {
        backgroundColor: '#2196F3', // Blue background
      },
      headerTintColor: '#fff', // White back button and title
      headerTitleStyle: {
      fontWeight: 'bold',
      },
      // eslint-disable-next-line react/no-unstable-nested-components
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
            return dateB.valueOf() - dateA.valueOf(); // Newest first
          });
          setRecords(loadedRecords);
        } else {
          setRecords([]);
        }
      };

      init();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header Summary Card */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('EmployeeForm')} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{records.length}</Text>
          <Text style={styles.statLabel}>Total Records</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹ {totalAmount}</Text>
          <Text style={styles.statLabel}>Total Amount</Text>
        </View>
      </View>

      {/* Records List */}
      <FlatList
        data={records}
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

      {/* Footer */}
      <Text
        style={[
          styles.footer,
          connectedInfo ? styles.connected : styles.disconnected,
        ]}
      >
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
});
