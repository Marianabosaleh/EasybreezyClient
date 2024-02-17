import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavoriteItems, removeFromFavorites } from '../firebase'; // Import the function to fetch favorites items
import { getAuth } from 'firebase/auth'; // Import getAuth function from firebase/auth
import './FavoritesPage.css'; // Import the CSS file

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]); // State to store favorites items
  const auth = getAuth(); // Get the authentication instance

  // Fetch favorites items from Firestore when the component mounts
  useEffect(() => {
    const fetchFavoritesItems = async () => {
      try {
        // Get the current user from the authentication instance
        const currentUser = auth.currentUser;

        // Check if user is authenticated
        if (currentUser) {
          const userId = currentUser.uid; // Obtain the user ID
          const items = await getFavoriteItems(userId); // Fetch favorites items using the user ID
          setFavorites(items);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching favorites items:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchFavoritesItems();
  }, [auth]); // Include auth as a dependency to re-run the effect when authentication state changes

  const handleRemoveFromFavorites = async (index: number) => {
    console.log('Removing item at index:', index);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        await removeFromFavorites(userId, index);
        // Update favorites items after removing
        const updatedItems = await getFavoriteItems(userId);
        setFavorites(updatedItems);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error removing item from favorites:', (error as Error).message); // Type assertion here
    }
  };

  // Check if favorites is empty
  if (favorites.length === 0) {
    return <div className="favorites-page">No items in favorites</div>;
  }

  return (
    <div className="favorites-page">
      <h1>Favorites</h1>
      <ul className="favorites-list">
        {favorites.map((item, index) => (
          <li key={index} className="favorite-item">
            <div className="favorite-details">
              <span className="favorite-name">{item.name}</span>
              <span className="favorite-price">${item.price}</span>
              {/* Display the product image */}
              <img src={item.imageSrc} alt={item.name} className="favorite-image" />
            </div>
            <button className="favorite-button" onClick={() => handleRemoveFromFavorites(index)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* You can add more content or styling here */}
    </div>
  );
};

export default FavoritesPage;
