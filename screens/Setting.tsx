import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { printSampleReceipt } from './printer';

const Setting: React.FC = () => {
  const [printers, setPrinters] = useState<any[]>([]);
  const [macAddress, setMacAddress] = useState<string>('');
  const [deviceName, setDeviceName] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        const allGranted = Object.values(granted).every(p => p === PermissionsAndroid.RESULTS.GRANTED);
        if (!allGranted) {
          Alert.alert('Permission Denied', 'Bluetooth permissions are required to scan and connect to printers.');
        }
      } catch (error) {
        console.warn('Permission error:', error);
      }
    }
  };

  const scanPrinters = async () => {
    try {
      await BLEPrinter.init();
      const deviceList = await BLEPrinter.getDeviceList();
      setPrinters(deviceList);
    } catch (err) {
      console.error('Scan error:', err);
      Alert.alert('Scan Failed', 'Could not get printer list.');
    }
  };

  const connectToPrinter = async (address: string, name: string) => {
    try {
      await BLEPrinter.connectPrinter(address);
      await AsyncStorage.setItem('printer_mac', address);
      await AsyncStorage.setItem('printer_name', name);

      setMacAddress(address);
      setDeviceName(name);
      setConnected(true);

      Alert.alert('Connected', `Printer connected:\n${name}\n(${address})`);
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Failed', 'Unable to connect to printer.');
    }
  };

  // Function to print a test receipt not use
  const printTest = () => {
    if (!connected) {
      Alert.alert('Printer Not Connected', 'Please connect to a printer first.');
      return;
    }

    BLEPrinter.printText(
      `
=========================
        XY STORE
     123 Main Street
      Phone: +91-987
=========================
Item        Qty   Price
-------------------------
Milk         2    25.00
Bread        1    30.00
Butter       1    45.00
Eggs         1    60.00
-------------------------
Subtotal              
GST 5%                
-------------------------
Grand Total           
=========================
     THANK YOU VISIT
=========================
      `
    );
  };

  useEffect(() => {
    const init = async () => {
      await requestPermissions();

      try {
        await BLEPrinter.init();

        const savedMac = await AsyncStorage.getItem('printer_mac');
        const savedName = await AsyncStorage.getItem('printer_name');

        if (savedMac && savedName) {
          try {
            await BLEPrinter.connectPrinter(savedMac);
            setMacAddress(savedMac);
            setDeviceName(savedName);
            setConnected(true);
          } catch (err) {
            console.warn('Auto-reconnect failed:', err);
            await AsyncStorage.removeItem('printer_mac');
            await AsyncStorage.removeItem('printer_name');
          }
        }

        const devices = await BLEPrinter.getDeviceList();
        setPrinters(devices);
      } catch (err) {
        console.error('Initialization failed:', err);
        Alert.alert('Error', 'Failed to initialize printer module.');
      }
    };

    init();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BLE Thermal Printer App</Text>

      <Text style={styles.label}>Available Printers:</Text>
      {printers.length > 0 ? (
        printers.map((printer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.printerItem}
            onPress={() => connectToPrinter(printer.inner_mac_address, printer.device_name)}
          >
            <Text style={styles.printerName}>{printer.device_name}</Text>
            <Text style={styles.macAddress}>{printer.inner_mac_address}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ marginBottom: 10 }}>No printers found. Please scan again.</Text>
      )}

      <Text style={{ textAlign: 'center', color: connected ? 'green' : 'red', marginVertical: 10 }}>
        {connected
          ? `🖨 Connected to ${deviceName} (${macAddress})`
          : '🔌 Printer not connected'}
      </Text>

      {/* {connected && (
        <View style={styles.button}>
          <Button title="Print Test Bill" onPress={printSampleReceipt} color="#28A745" />
        </View>

        // <TouchableOpacity onPress={printSampleReceipt} style={styles.iconButton}>
        //               <Text style={styles.iconText}>🖨</Text>
        //             </TouchableOpacity>
      )} */}

      <View style={styles.button}>
        <Button title="Rescan Printers" onPress={scanPrinters} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  printerItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  printerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  macAddress: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  button: {
    marginVertical: 10,
  },
});

export default Setting;
