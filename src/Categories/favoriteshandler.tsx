import React, { useState } from 'react';
import { addToFavorites, iconremoveFromFavorites } from '../firebase';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './style.css';

interface FavoritesHandlerProps {
  product: any; // Assuming product has an 'id' property
}

const FavoritesHandler: React.FC<FavoritesHandlerProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Assuming removeFromFavorites now requires productId
        await iconremoveFromFavorites(product.id);
        console.log('Product removed from favorites successfully');
      } else {
        // Assuming addToFavorites now requires the whole product object or just productId
        await addToFavorites(product);
        console.log('Product added to favorites successfully');
      }
      setIsFavorite(!isFavorite); // Toggle the favorite state
    } catch (error) {
      console.error('Error toggling product favorite status:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
   
    <button onClick={handleToggleFavorite} className="favorite-button">
      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </button>
 
  );
};

export default FavoritesHandler;
