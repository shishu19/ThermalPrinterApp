// App.tsx
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Setting from './screens/Setting';
import EmployeeForm from './screens/EmployeeForm';
import { PrinterProvider } from './screens/PrinterContext';
import { RootStackParamList } from './types';
import 'react-native-get-random-values';


const Stack = createNativeStackNavigator<RootStackParamList>(); // 👈 use typed stack

const App = () => {
  return (
    <PrinterProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="EmployeeForm" component={EmployeeForm} />
        </Stack.Navigator>
      </NavigationContainer>
    </PrinterProvider>
  );
};

export default App;
