import React, { useState } from 'react';
import { addToCart } from '../firebase';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './style.css'; // Assuming this is where your .favorite-button-container and .favorite-button classes are defined

interface CartHandlerProps {
  product: any; // Assuming product has an 'id' property
}

const CartHandler: React.FC<CartHandlerProps> = ({ product }) => {
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product); // Adjust according to your addToCart function requirements
      console.log('Product added to cart successfully');
      setIsInCart(true); // Assuming you want to toggle the icon upon adding to cart
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding product to cart:', error.message);
      } else {
        console.error('Unknown error occurred while adding product to cart');
      }
    }
  };

  return (
   
      <button onClick={handleAddToCart} className="cart-button"> {/* Reuse the styling */}
        {isInCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
      </button>
  );
};

export default CartHandler;
