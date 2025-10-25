// printer.tsx
import { Alert } from 'react-native';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';

export const printSampleReceipt = async (
  name: string,
  date: string,
  amount: string,
  receiver: string,
  mobile: string,
  paymentMode: string,
  status: string,
  serialNumber?: string // ✅ Added serial number parameter
): Promise<boolean> => {

  const printText = `
================================
    THE MAHARASHTRA AYYAPPA 
      SEVA SANGHAM (REGD.) 
    Regd. No: MAH-373/Thane    
           Mohone          
--------------------------------
 || Swamiye Saranam Ayyappa ||
================================
Serial No  : ${serialNumber ?? 'N/A'}
Name       : ${name}
Date       : ${date}
Amount     : Rs ${amount}
Receiver   : ${receiver}
Payment    : ${paymentMode}
Status     : ${status}
--------------------------------
  Thank you for your support!
================================
`;

  try {
    await BLEPrinter.printText(printText);
    Alert.alert('✅ Printed Successfully');
    return true;
  } catch (err) {
    console.error('❌ Print Error:', err);
    Alert.alert('Print Failed', 'Unable to print. Please check printer connection.');
    return false;
  }
};
