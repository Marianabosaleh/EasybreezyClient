// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { updateProfile } from "firebase/auth";
import { deleteDoc , getFirestore, collection, addDoc,  query, where, getDocs, doc , getDoc , setDoc , serverTimestamp } from "firebase/firestore";
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

    // Correctly create a cart document for the agent with the user's UID as the ID
    const cartRef = doc(db, 'carts', user.uid); // Reference to the cart document with the user's UID
    const cartData = {
      items: [], // Initialize with an empty items array
    };
    await setDoc(cartRef, cartData); // Use setDoc to explicitly set the document

    // Correctly create a favorites document for the agent with the user's UID as the ID
    const favoritesRef = doc(db, 'favorites', user.uid); // Reference to the favorites document with the user's UID
    const favoritesData = {
      items: [], // Initialize with an empty items array
    };
    await setDoc(favoritesRef, favoritesData); // Use setDoc to explicitly set the document

    // Correctly create a shop document with the user's UID as the ID
    const shopRef = doc(db, 'shops', user.uid); // Create a reference to the shop document with the user's UID
    const shopData = {
      shopName: shopName,
      description: description,
      agentId: user.uid,
      products: [], // Initialize with an empty products array
    };
    await setDoc(shopRef, shopData); // Use setDoc to explicitly set the document

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

    // Assuming each agent document in Firestore contains a shopName field
    let shopName = "";
    querySnapshot.forEach((doc) => {
      // Assuming 'shopName' is a field in your agents' documents
      shopName = doc.data().shopName;
    });

    console.log('Successfully signed in:', user);

    // Return both user and shopName in an object
    return { user, shopName };
  } catch (error) {
    console.error("Login error: ", error.message);
    throw error; // Rethrow error for handling in UI
  }
}







/////////////////////////////////////////////////////////////////////////////////////


export async function addProductToCat(id , name, imageSrc, description, price, categoryName) {
  try {
    const auth = getAuth();
const currentUser = auth.currentUser;

if (!currentUser) {
  console.error('User is not authenticated');
  throw new Error('User is not authenticated');
}

const userId = currentUser.uid;// This is the authenticated user's ID

    // Creating the structured product object with userId
    const productData = {
      id:id,
      name: name,
      imageSrc: imageSrc,
      description: description,
      price: price,
      userId: userId,
    };

    // Adding the product to the specified category in the database
    await addDoc(collection(db, categoryName), productData);
    console.log("Product added successfully");
  } catch (error) {
    console.error(`Error adding ${categoryName} product: `, error.message);
    throw error; // Rethrow error for handling in UI
  }
}


export async function addProductToShop(productData) {
  try {
    const auth = getAuth(); // Get the authentication instance
    const currentUser = auth.currentUser; // Get the currently authenticated user

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const userId = currentUser.uid; // Get the user ID

    // Reference the user's shop document using the user's UID
    const shopRef = doc(db, 'shops', userId);
    
    // Check if the shop document exists, if not, throw an error (shops should be created at registration)
    let shopDoc = await getDoc(shopRef);
    if (!shopDoc.exists()) {
      throw new Error('Shop does not exist. Please ensure the shop is created during agent registration.');
    }

    // Check if shop data or products are undefined
    if (!shopDoc.data() || !shopDoc.data().products) {
      throw new Error('Shop data or products are undefined');
    }

    // Update the shop with the new product
    const updatedShop = {
      ...shopDoc.data(),
      products: [...shopDoc.data().products, productData] // Add the new product data to the existing products array
    };
    await setDoc(shopRef, updatedShop);

    console.log('Product added to shop successfully');
  } catch (error) {
    console.error('Error adding product to shop:', error.message);
    throw error;
  }
}

export async function removeProductFromShop(userId, index) {
  try {
    const shopRef = doc(db, 'shops', userId);
    const shopDoc = await getDoc(shopRef);

    if (!shopDoc.exists()) {
      throw new Error('Shop does not exist');
    }

    // Filter out the product to be removed based on its index
    const updatedProducts = shopDoc.data().products.filter((_, i) => i !== index);
    await setDoc(shopRef, { products: updatedProducts });

    console.log('Product removed from shop successfully');
  } catch (error) {
    console.error('Error removing product from shop:', error.message);
    throw error;
  }
}


export async function getShopProducts(userId) {
  try {
    // Reference the user's shop document using the user's UID
    const shopRef = doc(db, 'shops', userId);
    
    // Fetch the shop document
    let shopDoc = await getDoc(shopRef);

    // Check if the shop document exists
    if (!shopDoc.exists()) {
      // Shop document doesn't exist, initialize it with empty products
      const initialShopData = { products: [] };
      await setDoc(shopRef, initialShopData);

      // Fetch the newly created shop document
      shopDoc = await getDoc(shopRef);
    }

    // Return the array of products in the shop
    return shopDoc.data().products || [];
  } catch (error) {
    console.error('Error fetching shop products:', error.message);
    throw error;
  }
}

export async function iconremoveFromFavorites(productId) {
  try {
    const auth = getAuth(); // Get the authentication instance
    const currentUser = auth.currentUser; // Get the currently authenticated user

    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    const userId = currentUser.uid; // Get the user ID

    // Reference the user's favorites document using the user's UID
    const favoritesRef = doc(db, 'favorites', userId);
    const favoritesDoc = await getDoc(favoritesRef);

    if (!favoritesDoc.exists()) {
      throw new Error('Favorites document does not exist');
    }

    // Assuming productData contains an 'id' property
    const existingItems = favoritesDoc.data().items;
    const filteredItems = existingItems.filter(item => item.id !== productId);

    // Update the favorites document without the removed item
    await setDoc(favoritesRef, { items: filteredItems });

    console.log('Item removed from favorites successfully');
  } catch (error) {
    console.error('Error removing item from favorites:', error.message);
    throw error;
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
export const addOrder = async (orderDetails) => {
  const db = getFirestore();

  try {
    // Assuming `orderDetails` includes customer's userId, agent's userId, selected products, and other relevant info
    const orderDocRef = await addDoc(collection(db, 'orders'), {
      ...orderDetails,
      timestamp: serverTimestamp(), // Ensure the order has a timestamp
    });

    console.log('Order added with ID: ', orderDocRef.id);
  } catch (error) {
    console.error('Error adding order: ', error);
    throw new Error('Failed to add order to Firestore');
  }
};

// Function for agents to retrieve their orders
export const getOrdersForAgent = async (agentUserId) => {
  const db = getFirestore();
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where("agentUserId", "==", agentUserId)); // Ensure you're matching against the agent's userId

  try {
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders for agent:', error);
    throw new Error('Failed to fetch orders');
  }
};
const categoriesCollectionRef = collection(getFirestore(), 'categories');

const removeProductFromCat = async (productId, category) => {
  try {
    if (!productId || !category) {
      throw new Error('productId and category are required parameters');
    }

    console.log(`Removing product ${productId} from category ${category}`);

    // Reference the correct collection based on the chosen category
    const categoryCollectionRef = collection(db, category);

    // Find the document with the given product ID
    const categoryQuery = query(categoryCollectionRef, where('id', '==', productId));
    const categorySnapshot = await getDocs(categoryQuery);

    console.log(`Found ${categorySnapshot.size} matching documents`);

    // Delete the document if it exists
    if (!categorySnapshot.empty) {
      const categoryDoc = categorySnapshot.docs[0];
      console.log(`Deleting document with ID: ${categoryDoc.id}`);
      await deleteDoc(doc(categoryCollectionRef, categoryDoc.id));
      console.log(`Product removed from category successfully`);
    } else {
      console.log('No matching document found');
    }
  } catch (error) {
    console.error('Error removing product from category:', error);
    throw error; // Throw the error for handling in the calling function
  }
};

export { removeProductFromCat };
