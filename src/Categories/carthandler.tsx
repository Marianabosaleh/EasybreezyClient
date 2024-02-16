import React from 'react';
import { addToCart } from '../firebase';

interface CartHandlerProps {
  product: any;
}

const CartHandler: React.FC<CartHandlerProps> = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      await addToCart(product); // No need to pass userId
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
    <button onClick={handleAddToCart}>Add to Cart</button>
  );
};

export default CartHandler;
