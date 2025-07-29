"use strict";
exports.__esModule = true;
// firebaseConfig.ts
var app_1 = require("firebase/app");
var firebaseConfig = {
    apiKey: 'AIzaSyDzycGWhEnOZ7G9t-OKYByuk6yZ_SiGsbU',
    authDomain: 'collection-ffc18.firebaseapp.com',
    databaseURL: 'https://collection-ffc18-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'collection-ffc18',
    storageBucket: 'collection-ffc18.appspot.com',
    messagingSenderId: '51274876801',
    appId: '1:51274876801:web:5c1bdce654ddcd785aca80'
};
var app = app_1.getApps().length === 0 ? app_1.initializeApp(firebaseConfig) : app_1.getApp();
exports["default"] = app;
