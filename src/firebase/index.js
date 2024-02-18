// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc,  query, where, getDocs, doc , getDoc , setDoc , serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// import { getAuth } from "firebase/auth";



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
    // Basic data validation
    if (!firstName || !lastName || !dateOfBirth || !email || !password) {
      throw new Error("All fields are required for registration.");
    }

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

    // Automatically create a cart for the customer
    const cartData = {
      items: [],
    };
    await addDoc(collection(db, 'carts'), { userId: user.uid, cartData });

    // Automatically create a cart for the customer
    const orderData = {
      items: [],
    };
    await addDoc(collection(db, 'orders'), { userId: user.uid, orderData });

    // Automatically create a favorites collection for the customer
    const favoritesData = {
      items: [],
    };
    await addDoc(collection(db, 'favorites'), { userId: user.uid, favoritesData });

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

// Function to register a new agent
export async function registerAgent(firstName, lastName, dateOfBirth, email, password, shopName, description) {
  try {
    // Basic data validation
    if (!firstName || !lastName || !dateOfBirth || !email || !password || !shopName || !description) {
      throw new Error("All fields are required for registration.");
    }

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with first and last name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Add agent data to the "agents" collection in Firestore
    const agentData = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      email: email,
      userType: "Agent",
      shopName: shopName,
      description: description,
    };
    await addDoc(collection(db, 'agents'), agentData);

    // Automatically create a cart for the agent
    const cartData = {
      items: [],
    };
    await addDoc(collection(db, 'carts'), { userId: user.uid, cartData });
    // Automatically create a favorites collection for the customer
    const favoritesData = {
      items: [],
    };
    await addDoc(collection(db, 'favorites'), { userId: user.uid, favoritesData });


    console.log("Agent registered successfully");
    return user;
  } catch (error) {
    console.error("Registration error: ", error.message);
    throw error; // Rethrow error for handling in UI
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

export async function addProduct(name, imageSrc, description, price, categoryName) {
  try {
    const productData = {
      name: name,
      imageSrc: imageSrc,
      description: description,
      price: price,
    };
    await addDoc(collection(db, categoryName), productData); // Use the provided category name
    console.log("Product added successfully");
  } catch (error) {
    console.error(`Error adding ${categoryName} product: `, error.message);
    throw error; // Rethrow error for handling in UI
  }
}

// ///////////////////////////////////////////////////////////////////////////////////////////


export async function addToCart(productData) {
  try {
    const auth = getAuth(); // Get the authentication instance
    const currentUser = auth.currentUser; // Get the currently authenticated user

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const userId = currentUser.uid; // Get the user ID

    // Reference the user's cart document using the user's UID
    const cartRef = doc(db, 'carts', userId);
    
    // Check if the cart document exists, create it if it doesn't
    let cartDoc = await getDoc(cartRef);
    if (!cartDoc.exists()) {
      // Cart document doesn't exist, create it
      const initialCartData = { items: [] };
      await setDoc(cartRef, initialCartData);

      // Fetch the newly created cart document
      cartDoc = await getDoc(cartRef);
    }

    // Log the cart data to see if it's correctly fetched
    console.log('Cart data:', cartDoc.data());

    // Check if cart data or items are undefined
    if (!cartDoc.data() || !cartDoc.data().items) {
      throw new Error('Cart data or items are undefined');
    }

    // Update the cart with the new item
    const updatedCart = {
      items: [...cartDoc.data().items, productData]
    };
    await setDoc(cartRef, updatedCart);

    console.log('Item added to cart successfully');
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
    throw error;
  }
}

// Function to remove item from cart
export async function removeFromCart(userId, index) {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      throw new Error('Cart does not exist');
    }

    const updatedCartItems = cartDoc.data().items.filter((_, i) => i !== index);
    await setDoc(cartRef, { items: updatedCartItems });

    console.log('Item removed from cart successfully');
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    throw error;
  }
}


export async function getCartItems(userId) {
  try {
    // Reference the user's cart document using the user's UID
    const cartRef = doc(db, 'carts', userId);
    
    // Fetch the cart document
    let cartDoc = await getDoc(cartRef);

    // Check if the cart document exists
    if (!cartDoc.exists()) {
      // Cart document doesn't exist, create it
      const initialCartData = { items: [] };
      await setDoc(cartRef, initialCartData);

      // Fetch the newly created cart document
      cartDoc = await getDoc(cartRef);
    }

    // Return the array of items in the cart
    return cartDoc.data().items || [];
  } catch (error) {
    console.error('Error fetching cart items:', error.message);
    throw error;
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////// 

// Function to add item to favorites
export async function addToFavorites(productData) {
  try {
    const auth = getAuth(); // Get the authentication instance
    const currentUser = auth.currentUser; // Get the currently authenticated user

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const userId = currentUser.uid; // Get the user ID

    // Reference the user's favorites document using the user's UID
    const favoritesRef = doc(db, 'favorites', userId);
    
    // Check if the favorites document exists, create it if it doesn't
    let favoritesDoc = await getDoc(favoritesRef);
    if (!favoritesDoc.exists()) {
      // Favorites document doesn't exist, create it
      const initialFavoritesData = { items: [] };
      await setDoc(favoritesRef, initialFavoritesData);

      // Fetch the newly created favorites document
      favoritesDoc = await getDoc(favoritesRef);
    }

    // Log the favorites data to see if it's correctly fetched
    console.log('Favorites data:', favoritesDoc.data());

    // Check if favorites data or items are undefined
    if (!favoritesDoc.data() || !favoritesDoc.data().items) {
      throw new Error('Favorites data or items are undefined');
    }

    // Update the favorites with the new item
    const updatedFavorites = {
      items: [...favoritesDoc.data().items, productData]
    };
    await setDoc(favoritesRef, updatedFavorites);

    console.log('Item added to favorites successfully');
  } catch (error) {
    console.error('Error adding item to favorites:', error.message);
    throw error;
  }
}

// Function to remove item from favorites
export async function removeFromFavorites(userId, index) {
  try {
    // Reference the user's favorites document using the user's UID
    const favoritesRef = doc(db, 'favorites', userId);
    const favoritesDoc = await getDoc(favoritesRef);

    if (!favoritesDoc.exists()) {
      throw new Error('Favorites document does not exist');
    }

    const updatedFavoritesItems = favoritesDoc.data().items.filter((_, i) => i !== index);
    await setDoc(favoritesRef, { items: updatedFavoritesItems });

    console.log('Item removed from favorites successfully');
  } catch (error) {
    console.error('Error removing item from favorites:', error.message);
    throw error;
  }
}

// Function to get favorite items
export async function getFavoriteItems(userId) {
  try {
    // Reference the user's favorites document using the user's UID
    const favoritesRef = doc(db, 'favorites', userId);
    
    // Fetch the favorites document
    let favoritesDoc = await getDoc(favoritesRef);

    // Check if the favorites document exists
    if (!favoritesDoc.exists()) {
      // Favorites document doesn't exist, create it
      const initialFavoritesData = { items: [] };
      await setDoc(favoritesRef, initialFavoritesData);

      // Fetch the newly created favorites document
      favoritesDoc = await getDoc(favoritesRef);
    }

    // Return the array of items in favorites
    return favoritesDoc.data().items || [];
  } catch (error) {
    console.error('Error fetching favorite items:', error.message);
    throw error;
  }
}
// Function to add an order to Firestore
export const addOrder = async (userId, selectedProducts) => {
  const db = getFirestore();

  try {
    // Create a new order document with user ID, timestamp, and selected products
    const orderDocRef = await addDoc(collection(db, 'users', userId, 'orders'), {
      userId: userId,
      timestamp: serverTimestamp(),
      products: selectedProducts,
    });

    console.log('Order added with ID: ', orderDocRef.id);
  } catch (error) {
    console.error('Error adding order: ', error);
    throw new Error('Failed to add order to Firestore');
  }
};