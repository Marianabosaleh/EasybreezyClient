import React, { useEffect, useState } from 'react';
import { getFavoriteItems, removeFromFavorites } from '../firebase';
import { getAuth } from 'firebase/auth';
import './FavoritesPage.css';
import IconNav from '../components/iconNav';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import CartHandler from '../Categories/carthandler';


const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = getAuth();

  useEffect(() => {
    setIsLoading(true);
    const fetchFavorites = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const items = await getFavoriteItems(userId);
          const uniqueItems = Array.from(new Map(items.map((item: { id: any; }) => [item.id, item])).values());
          setFavorites(uniqueItems);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        setError('Failed to fetch favorites');
        console.error('Error fetching favorites:', error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(() => {
      fetchFavorites();
    }, 1000);

  }, [auth]);

  const handleRemoveFromFavorites = async (index: number) => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        await removeFromFavorites(userId, index);
        // Remove the item from the local state using the index
        const updatedFavorites = [...favorites];
        updatedFavorites.splice(index, 1); // This removes the item at the specified index
        setFavorites(updatedFavorites);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      setError('Failed to remove item from favorites');
      console.error('Error removing item from favorites:', (error as Error ).message);
    } finally {
      setIsLoading(false);
    }
    
};


 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="favorites-page">
      <h1>Favorites</h1>
      <div className="favorites-list">
        {favorites.length > 0 ? (
          favorites.map((item, index) => (
            <div key={item.id} className="favorite-item">
              <div className="favorite-details">
                <img src={item.imageSrc} alt={item.name} className="favorite-image" />
                <span className="favorite-name">{item.name}</span>
                <span className="favorite-price">${item.price}</span>
              </div>
                        <div className="button-container">

              <button onClick={() => handleRemoveFromFavorites(index)} className="remove-button">Remove</button>
              <CartHandler product={item} /> {/* Add to Cart button */}
              </div>

            </div>
          ))
        ) : (
          <div className="no-favorites">
            <HeartBrokenIcon style={{ fontSize: 60, color: 'grey' }} />
        
          </div>
        )}
      </div>
      <IconNav />
    </div>
  );
  
};

export default FavoritesPage;
