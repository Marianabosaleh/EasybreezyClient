import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import ShopPage from '../shopPage';
import AddProductForm from '../addproduct';

const AgentShoesPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false); // Set loading to false regardless of user's presence
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Now accurately represents loading state
  }

  if (!userId) {
    // Improved handling for no user logged in
    // You might consider redirecting to a login page or showing a login link here
    return <div>Please log in to view this page.</div>;
  }

  return <ShopPage shopId={userId} categoryName="shoes" />;
};
export default AgentShoesPage;
