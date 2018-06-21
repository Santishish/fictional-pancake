import firebase from 'firebase';
import  'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDGvdwAP4z1QzLFwkPQ3RFI3C2JJ6JahiU",
    authDomain: "react-firestore-revents.firebaseapp.com",
    databaseURL: "https://react-firestore-revents.firebaseio.com",
    projectId: "react-firestore-revents",
    storageBucket: "react-firestore-revents.appspot.com",
    messagingSenderId: "832443834925"
};

firebase.initializeApp(firebaseConfig);
const firestore =  firebase.firestore();
const settings = {
    timestampsInSnapshots: true
};
firestore.settings(settings);

export default firebase;
