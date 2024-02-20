import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ShopPage from '../shopPage';
import AddProductForm from '../addproduct';

const TopPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>(''); // Add state to store shopName if needed

  useEffect(() => {
    const auth = getAuth();
    // This listener manages authentication state changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in, set the user ID.
        setUserId(user.uid);
        // Optionally, set shopName here if you have it associated with the user in some way
        // For simplicity, this example assumes a static shopName or retrieved from somewhere
        setShopName("Your Shop Name");
      } else {
        // If user is not logged in, reset the user ID to null.
        setUserId(null);
        setShopName('');
      }
    });
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Only render ShopPage and AddProductForm if userId is not null, indicating a user is logged in.
  return userId ? (
    <div>
      {shopName && <AddProductForm shopName={shopName} categoryName="tops" />}
    </div>
  ) : (
    <div>Loading or user not logged in...</div>
  );
};

export default TopPage;
