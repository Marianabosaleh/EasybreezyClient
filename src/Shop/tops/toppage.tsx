import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ShopPage from '../shopPage';

const AgentTopsPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Manage loading state
  const navigate = useNavigate(); // For redirecting users

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false); // Update loading state
      if (user) {
        setUserId(user.uid); // Set user ID if logged in
      } else {
        // If no user is logged in, redirect or manage accordingly
        navigate('/login'); // Example redirection to login page
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  return (
    // Only render ShopPage if not loading and user ID is available
    userId ? <ShopPage shopId={userId} categoryName="Tops" /> : null
  );
};

export default AgentTopsPage;
