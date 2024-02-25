import React, { useEffect, useState } from 'react';
import { getFavoriteItems, removeFromFavorites } from '../firebase';
import { getAuth } from 'firebase/auth';
import './FavoritesPage.css';
import IconNav from '../components/iconNav';

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

    fetchFavorites();
  }, [auth]);

  const handleRemoveFromFavorites = async (productId: string) => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        await removeFromFavorites(userId, productId);
        setFavorites(favorites.filter(item => item.id !== productId));
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      setError('Failed to remove item from favorites');
      console.error('Error removing item from favorites:', (error as Error).message);
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
        {favorites.map(item => (
          <div key={item.id} className="favorite-item">
            <span className="favorite-name">{item.name}</span>
            <span className="favorite-price">${item.price}</span>
            <img src={item.imageSrc} alt={item.name} className="favorite-image" />
            <button onClick={() => handleRemoveFromFavorites(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      <IconNav />
    </div>
  );
};

export default FavoritesPage;
