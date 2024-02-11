// CartPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css'; // Import the CSS file

interface CartItem {
  name: string;
  price: number;
}

const CartPage: React.FC<{ cart?: CartItem[]; removeFromCart: (index: number) => void }> = ({ cart = [], removeFromCart }) => {
  // Check if cart is empty
  if (cart.length === 0) {
    return <div className="cart-page">No items in the cart</div>;
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <ul className="cart-list">
        {cart.map((item, index) => (
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
