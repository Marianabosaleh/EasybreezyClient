import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems, removeFromCart } from '../firebase'; // Import the function to fetch cart items
import { getAuth } from 'firebase/auth'; // Import getAuth function from firebase/auth
import './CartPage.css'; // Import the CSS file

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]); // State to store cart items
  const auth = getAuth(); // Get the authentication instance

  // Fetch cart items from Firestore when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Get the current user from the authentication instance
        const currentUser = auth.currentUser;

        // Check if user is authenticated
        if (currentUser) {
          const userId = currentUser.uid; // Obtain the user ID
          const items = await getCartItems(userId); // Fetch cart items using the user ID
          setCartItems(items);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchCartItems();
  }, [auth]); // Include auth as a dependency to re-run the effect when authentication state changes

  const handleRemoveFromCart = async (index: number) => {
    console.log('Removing item at index:', index);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        await removeFromCart(userId, index);
        // Update cart items after removing
        const updatedItems = await getCartItems(userId);
        setCartItems(updatedItems);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error removing item from cart:', (error as Error).message); // Type assertion here
    }
  };
  // Check if cart is empty
  if (cartItems.length === 0) {
    return <div className="cart-page">No items in the cart</div>;
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <ul className="cart-list">
        {cartItems.map((item, index) => (
          <li key={index} className="cart-item">
            <div className="cart-details">
              <span className="cart-name">{item.name}</span>
              <span className="cart-price">${item.price}</span>
              {/* Display the product image */}
              <img src={item.imageSrc} alt={item.name} className="cart-image" />
            </div>
            <button className="remove-button" onClick={() => handleRemoveFromCart(index)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* Adding a button to redirect to the homepage */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/HomePage">
          <button>Go to Homepage</button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
