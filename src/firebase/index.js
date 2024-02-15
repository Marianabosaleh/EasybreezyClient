// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc,  query, where, getDocs } from "firebase/firestore";
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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(); // Get the authentication instance
const db = getFirestore(); // Get the Firestore instance

// Function to register a new customer
export async function Registercustomer(firstName, lastName, dateOfBirth, email, password) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with first and last name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Add user data to the "customers" collection in Firestore
    const userData = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      email: email,
      userType: "Customer" 
    };
    await addDoc(collection(db, 'customers'), userData);

    console.log("User registered successfully as customer");
    return user;
  } catch (error) {
    console.error("Registration error: ", error.message);
    throw error; // Rethrow error for handling in UI
  }
}


export async function loginCustomer(email, password) {
  try {
    const db = getFirestore();
    
    // Check if the provided email exists in the customers collection
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Email not found. Please check your email and try again.");
    }
    
    // If the email exists, proceed with logging in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Successfully signed in:', user);
    return user;
  } catch (error) {
    console.error("Login error: ", error.message);
    throw error; // Rethrow error for handling in UI
  }
}
// Firebase.ts

export async function registerAgent(firstName, lastName, dateOfBirth, email, password, description) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    const shopName = await createShopForAgent(user.uid, description); // Create a function to associate a shop with the agent
    
    const agentData = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      email: email,
      userType: "Agent",
      shopName: shopName, // Include the shop name in the agent data
      description: description,
    };
    await addDoc(collection(db, 'agents'), agentData);

    console.log("Agent registered successfully");
    return shopName; // Return the shop name after successful registration
  } catch (error) {
    console.error("Registration error: ", error.message);
    throw error;
  }
}

async function createShopForAgent(agentId, description) {
  try {
    // Logic to create a shop associated with the agent
    // For example, you can create a new document in a 'shops' collection and return its ID
    const shopId = 'your_generated_shop_id';
    return shopId;
  } catch (error) {
    console.error("Error creating shop:", error.message);
    throw error;
  }
}

// Login an agent
export async function loginAgent(email, password) {
  try {
    // Check if the provided email exists in the agents collection
    const agentsRef = collection(db, 'agents');
    const q = query(agentsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Email not found. Please check your email and try again.");
    }

    // If the email exists, proceed with logging in the agent
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Successfully signed in:', user);
    return user;
  } catch (error) {
    console.error("Login error: ", error.message);
    throw error; // Rethrow error for handling in UI
  }

}

export async function addProduct(name, imageSrc, description, price, categoryName, shopName) {
  try {
    const productData = {
      name: name,
      imageSrc: imageSrc,
      description: description,
      price: price,
      shopName: shopName // Include the shop name in the product data
    };
    await addDoc(collection(db, categoryName), productData); // Use the provided category name
    console.log("Product added successfully");
  } catch (error) {
    console.error(`Error adding ${categoryName} product: `, error.message);
    throw error; // Rethrow error for handling in UI
  }
}

export { getFirestore };

