import firebase from '@firebase/app';
import '@firebase/firestore';

const config = {
  apiKey: 'AIzaSyBH1Yi8raHMVaX4VxqcTgfRDHf7BY3xODg',
  authDomain: 'usabl-f0ec1.firebaseapp.com',
  databaseURL: 'https://usabl-f0ec1.firebaseio.com',
  projectId: 'usabl-f0ec1',
  storageBucket: 'usabl-f0ec1.appspot.com',
  messagingSenderId: '294663209085'
};
firebase.initializeApp(config);

export let db = firebase.firestore();

firebase
  .firestore()
  .enablePersistence()
  .then(function() {
    db = firebase.firestore();
  })
  .catch(err => {
    console.error(err.code, err);
    return firebase.firestore();
  });
