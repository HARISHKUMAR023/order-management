// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDaDqK6DpYFMip13BrR_LmScVWKROA-qjI",

  authDomain: "naturestore-36eae.firebaseapp.com",

  projectId: "naturestore-36eae",

  storageBucket: "naturestore-36eae.appspot.com",

  messagingSenderId: "312266928390",

  appId: "1:312266928390:web:06b3c7bb23eba6d7606e87"

};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };