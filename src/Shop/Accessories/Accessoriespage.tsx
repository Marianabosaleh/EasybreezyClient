import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import ShopPage from '../shopPage';
import AddProductForm from '../addproduct';

const AgentAccessoriesPage  = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return userId ? (
    <ShopPage userId={userId} categoryName="accessories" />
  ) : (
    <div>Loading or user not logged in...</div>
  );
};

export default AgentAccessoriesPage;
