// import { db } from './firestore'; // Assuming you have a separate file for Firestore initialization
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { updateProfile } from "firebase/auth";
// import { getFirestore, collection, addDoc,  query, where, getDocs } from "firebase/firestore";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";



// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDqbFucDCEEEDj_7ZA7XKn3SDkm0sywueE",
//   authDomain: "easybreezy-30c56.firebaseapp.com",
//   databaseURL:
//     "https://easybreezy-30c56-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "easybreezy-30c56",
//   storageBucket: "easybreezy-30c56.appspot.com",
//   messagingSenderId: "82293457281",
//   appId: "1:82293457281:web:f6ee8aac99e90bb56e2880",
//   measurementId: "G-DW80T097S1",
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(); // Get the authentication instance
// const db = getFirestore(); // Get the Firestore instance
// // Function to add shoes to the Firestore database
// export async function addShoes() {
//     try {
//       const shoes = [
//         {
//           name: "Nike Air Max",
//           description: "Lightweight and breathable sneakers with Air Max cushioning.",
//           price: "$120"
//         },
//         {
//           name: "Adidas Ultraboost",
//           description: "Comfortable running shoes with responsive Boost cushioning.",
//           price: "$180"
//         },
        
//         // Add more shoes here...
//       ];
  
//       // Loop through each shoe and add it to Firestore
//       shoes.forEach(async (shoe) => {
//         await addDoc(collection(db, 'products'), shoe);
//       });
  
//       console.log("Shoes added successfully");
//     } catch (error) {
//       console.error("Error adding shoes:", error.message);
//       throw error; // Rethrow error for handling in UI
//     }
//   }

  
// // Function to add a new product to Firestore
// export async function addProduct(productData) {
//   try {
//     const productRef = await db.collection('products').add(productData);
//     console.log('Product added with ID: ', productRef.id);
//     return productRef.id;
//   } catch (error) {
//     console.error('Error adding product: ', error);
//     throw error;
//   }
// }

// // Function to update an existing product in Firestore
// export async function updateProduct(productId, updatedData) {
//   try {
//     await db.collection('products').doc(productId).update(updatedData);
//     console.log('Product updated successfully');
//   } catch (error) {
//     console.error('Error updating product: ', error);
//     throw error;
//   }
// }

// // Function to delete a product from Firestore
// export async function deleteProduct(productId) {
//   try {
//     await db.collection('products').doc(productId).delete();
//     console.log('Product deleted successfully');
//   } catch (error) {
//     console.error('Error deleting product: ', error);
//     throw error;
//   }
// }

// // Function to fetch all products from Firestore
// // Function to fetch all products from Firestore
// export async function getAllProducts() {
//     try {
//       const querySnapshot = await db.collection('products').get(); // Ensure db is the Firestore instance
//       const products = [];
//       querySnapshot.forEach((doc) => {
//         products.push({ id: doc.id, ...doc.data() });
//       });
//       return products;
//     } catch (error) {
//       console.error('Error fetching products: ', error);
//       throw error;
//     }
//   }
