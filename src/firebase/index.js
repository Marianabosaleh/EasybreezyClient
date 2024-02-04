// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqbFucDCEEEDj_7ZA7XKn3SDkm0sywueE",
  authDomain: "easybreezy-30c56.firebaseapp.com",
  databaseURL:
    "https://easybreezy-30c56-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "easybreezy-30c56",
  storageBucket: "easybreezy-30c56.appspot.com",
  messagingSenderId: "82293457281",
  appId: "1:82293457281:web:f6ee8aac99e90bb56e2880",
  measurementId: "G-DW80T097S1",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export function Registercustomer(firstName, lastName, dateOfBirth, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      }).then(() => {
        try {
          const db = getFirestore();
          const usersCollection = collection(db, 'users');
          const userData = {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth
          };
          addDoc(usersCollection, userData)
            .then(() => {
              console.log("User data added successfully");
            })
            .catch((error) => {
              console.error("Error adding user data: ", error);
            });
        } catch (error) {
          console.error("Error accessing Firestore: ", error);
        }
      }).catch((error) => {
        console.error("Error updating profile: ", error);
      });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
     
      console.error("Registration error: ", errorMessage);
    });
}

export function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error("Login error: ", errorMessage);
    });
}