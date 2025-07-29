// firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDzycGWhEnOZ7G9t-OKYByuk6yZ_SiGsbU',
  authDomain: 'collection-ffc18.firebaseapp.com',
  databaseURL: 'https://collection-ffc18-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'collection-ffc18',
  storageBucket: 'collection-ffc18.appspot.com',
  messagingSenderId: '51274876801',
  appId: '1:51274876801:web:5c1bdce654ddcd785aca80',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default app;
