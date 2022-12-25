import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyA33W-J7-O692X2Lk-I_O5smKbIq3fa7ZA',
  authDomain: 'fyp-ubit-18101044.firebaseapp.com',
  projectId: 'fyp-ubit-18101044',
  storageBucket: 'fyp-ubit-18101044.appspot.com',
  messagingSenderId: '462535594769',
  appId: '1:462535594769:web:2560432faec30f707872b0',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
