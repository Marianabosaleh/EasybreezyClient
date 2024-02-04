import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  // Your Firebase configuration
};

const app = initializeApp(firebaseConfig);
const _analytics = getAnalytics(app); // Rename analytics to _analytics or remove if not needed
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
