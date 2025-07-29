import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { printSampleReceipt } from './Printer';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ref, update, getDatabase, set } from 'firebase/database';
import app from './firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployeeForm'>;

const EmployeeForm: React.FC<Props> = ({ route, navigation }) => {
  const {
    id = '',
    name: initialName = '',
    amount: initialAmount = '',
    receiver: initialReceiver = '',
    mobile: initialMobile = '',
    paymentMode: initialPaymentMode = 'Cash',
    status: initialStatus = 'Pending',
    date,
    mode = 'add',
  } = route.params || {};

  const isEditMode = mode === 'edit';

  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : '');
  const [receiver, setReceiver] = useState(initialReceiver);
  const [mobile, setMobile] = useState(initialMobile);
  const [paymentMode, setPaymentMode] = useState(initialPaymentMode);
  const [status, setStatus] = useState(initialStatus);
  const [showPreview, setShowPreview] = useState(isEditMode);
  const [isEditing, setIsEditing] = useState(!isEditMode);
  const [connectedInfo, setConnectedInfo] = useState<{ mac: string; name: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const reconnectPrinter = async () => {
        const savedMac = await AsyncStorage.getItem('printer_mac');
        const savedName = await AsyncStorage.getItem('printer_name');
        if (savedMac) {
          try {
            await BLEPrinter.init();
            await BLEPrinter.connectPrinter(savedMac);
            setConnectedInfo({ mac: savedMac, name: savedName || 'Unknown Device' });
            (global as any).printerConnected = true;
          } catch (err) {
            console.error('❌ Reconnect failed:', err);
            setConnectedInfo(null);
            (global as any).printerConnected = false;
          }
        } else {
          setConnectedInfo(null);
          (global as any).printerConnected = false;
        }
      };

      reconnectPrinter();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Donation',
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
          <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 16, color: 'green' }}>🟢 Printer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 16 }}>🔌 Connect</Text>
          </TouchableOpacity>
        ),
    });
  }, [navigation, connectedInfo]);

  const formatDate = (inputDate: Date): string => {
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
    let hours = inputDate.getHours();
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, '0');
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  const currentDate = date ? formatDate(new Date()) : formatDate(new Date());

  const validateFields = () => {
    if (!name.trim() || !amount.trim() || !receiver.trim()) {
      Alert.alert('Validation Error', 'Name, Amount and Receiver are required.');
      return false;
    }

    if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
      Alert.alert('Validation Error', 'Invalid 10-digit mobile number.');
      return false;
    }

    return true;
  };

  const handleAddOrEdit = async () => {
    if (!validateFields()) return;

    const formData = {
      name: name.trim(),
      amount: parseFloat(amount) || 0,
      receiver: receiver.trim(),
      mobile: mobile.trim(),
      paymentMode,
      status,
      date: currentDate,
    };

    const db = getDatabase(app);

    try {
      if (isEditMode && id) {
        const donationRef = ref(db, `/donations/${id}`);
        await update(donationRef, formData);
        Alert.alert('✅ Updated Successfully');
      } else {
        const donationId = uuidv4();
        await set(ref(db, `/donations/${donationId}`), formData);
        Alert.alert('✅ Donation Added Successfully', '', [
          {
            text: 'OK',
            onPress: () => {
              setIsEditing(false);
              setShowPreview(true);
            },
          },
        ]);
        return;
      }

      setIsEditing(false);
      setShowPreview(true);
    } catch (error: any) {
      console.error('❌ Firebase Error:', error?.message ?? error);
      Alert.alert('Error', `Failed to save donation: ${error?.message ?? 'Unknown error'}`);
    }
  };

  const handlePrint = async () => {
    if (!validateFields()) return;

    if (!(global as any).printerConnected) {
      Alert.alert('Printer Error', 'Printer not connected!');
      return;
    }

    const success = await printSampleReceipt(name, currentDate, amount, receiver, mobile, paymentMode, status);
    if (success) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {isEditing && (
          <>
            <Text style={styles.label}>Donor Name *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Donation Amount *</Text>
            <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />

            <Text style={styles.label}>Received By *</Text>
            <TextInput style={styles.input} value={receiver} onChangeText={setReceiver} />

            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.label}>Payment Mode</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={paymentMode} onValueChange={setPaymentMode} style={styles.picker}>
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Online" value="Online" />
                <Picker.Item label="Cheque" value="Cheque" />
              </Picker>
            </View>

            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Paid" value="Paid" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddOrEdit}>
              <Text style={styles.buttonText}>{isEditMode ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </>
        )}

        {!isEditing && showPreview && (
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>=====================================</Text>
            <Text style={styles.previewCenter}>THE MAHARASHTRA AYYAPPA</Text>
            <Text style={styles.previewCenter}>SEVA SANGHAM (REGD.)</Text>
            <Text style={styles.previewText}>-------------------------------------</Text>
            <Text style={styles.previewCenter}>Regd. No: MAH-373/Thane</Text>
            <Text style={styles.previewCenter}>- Mohone</Text>
            <Text style={styles.previewCenter}>|| Swamiye Saranam Ayyappa ||</Text>
            <Text style={styles.previewText}>=====================================</Text>

            <Text style={styles.previewLine}>Name     : {name}</Text>
            <Text style={styles.previewLine}>Date     : {currentDate}</Text>
            <Text style={styles.previewLine}>Amount   : Rs {amount}</Text>
            <Text style={styles.previewLine}>Receiver : {receiver}</Text>
            <Text style={styles.previewLine}>Payment  : {paymentMode}</Text>
            <Text style={styles.previewLine}>Status   : {status}</Text>

            <Text style={styles.previewText}>-------------------------------------</Text>
            <Text style={styles.previewCenter}>Thank you for your support!</Text>
            <Text style={styles.previewText}>=====================================</Text>

            <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
              <Text style={styles.printButtonText}>🖨️ Print</Text>
            </TouchableOpacity>

            {isEditMode && (
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(true);
                  setShowPreview(false);
                }}
                style={{
                  marginTop: 10,
                  alignSelf: 'flex-end',
                  backgroundColor: '#2196F3',
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 18 }}>✏️</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

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

export default EmployeeForm;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    color: '#000',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 52,
    color: '#000',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    marginVertical: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  previewBox: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  previewText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  previewCenter: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000',
    fontFamily: 'monospace',
  },
  previewLine: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'monospace',
    marginVertical: 1,
  },
  printButton: {
    marginTop: 12,
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 6,
  },
  printButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
  },
  connected: {
    color: 'green',
  },
  disconnected: {
    color: 'red',
  },
});
