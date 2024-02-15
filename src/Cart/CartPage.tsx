import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems } from '../firebase'; // Import the function to fetch cart items
import './CartPage.css'; // Import the CSS file

const CartPage: React.FC<{ removeFromCart: (index: number) => void }> = ({ removeFromCart }) => {
  const [cartItems, setCartItems] = useState<any[]>([]); // State to store cart items

  // Fetch cart items from Firestore when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Replace 'userId' with the actual user ID obtained from authentication
        const userId = 'userId'; // You need to implement logic to get the user ID
        const items = await getCartItems(userId);
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchCartItems();
  }, []);

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
            </div>
            <button className="remove-button" onClick={() => removeFromCart(index)}>Remove</button>
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
