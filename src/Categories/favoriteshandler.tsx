import React from 'react';
import { addToFavorites } from '../firebase';

interface FavoritesHandlerProps {
  product: any;
}

const FavoitesHandler: React.FC<FavoritesHandlerProps> = ({ product }) => {
  const handleAddTofavorites = async () => {
    try {
      await addToFavorites(product); // No need to pass userId
      console.log('Product added to cart successfully');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding product to cart:', error.message);
      } else {
        console.error('Unknown error occurred while adding product to cart');
      }
    }
  };

  return (           
    <button onClick={handleAddTofavorites}>Add to Favorites</button>
  );
};

export default FavoitesHandler;
