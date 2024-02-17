import React, { useEffect, useState } from 'react';
import { getCartItems, removeFromCart } from '../firebase'; // Import the function to fetch cart items
import { getAuth } from 'firebase/auth'; // Import getAuth function from firebase/auth
import { FaHome } from 'react-icons/fa';
import { FaMoneyCheck } from "react-icons/fa";
import './CartPage.css'; // Import the CSS file

const CartPage: React.FC = () => {
  // State to store cart items
  const [cartItems, setCartItems] = useState<any[]>([]);
  // Get the authentication instance
  const auth = getAuth();
  // Keep track of selected items
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  // New state for "Select All" checkbox
  const [selectAll, setSelectAll] = useState(false);
  // State to store total price
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Fetch cart items from Firestore when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Get the current user from the authentication instance
        const currentUser = auth.currentUser;

        // Check if user is authenticated
        if (currentUser) {
          const userId = currentUser.uid;
          // Fetch cart items using the user ID
          const items = await getCartItems(userId);
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

  // Update total price when selected items change
  useEffect(() => {
    calculateTotal();
  }, [selectedItems]);

  // Function to calculate the total price of selected items
  const calculateTotal = () => {
    const total = selectedItems.reduce((acc, index) => acc + cartItems[index].price, 0);
    setTotalPrice(total);
  };

  // Function to handle removing an item from the cart
  const handleRemoveFromCart = async (index: number) => {
    console.log('Removing item at index:', index);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        // Remove item from the cart
        await removeFromCart(userId, index);
        // Update cart items after removing
        const updatedItems = await getCartItems(userId);
        setCartItems(updatedItems);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error removing item from cart:', (error as Error).message);
    }
  };

  // Check if cart is empty
  if (cartItems.length === 0) {
    return <div className="cart-page">No items in the cart</div>;
  }

  // Function to navigate to the home page
  const goToHomePage = () => {
    window.location.href = '/HomePage';
  };
  const goToPaymentPage = () => {
    window.location.href = '/paymentmethod';
  };

  // Function to handle checkbox change for individual items
  const handleCheckboxChange = (index: number) => {
    const isSelected = selectedItems.includes(index);
    const updatedSelection = isSelected
      ? selectedItems.filter((itemIndex) => itemIndex !== index)
      : [...selectedItems, index];
    setSelectedItems(updatedSelection);
  };

  // Function to handle checkbox change for "Select All"
  const handleSelectAllChange = () => {
    const allItemIndexes = cartItems.map((_, index) => index);
    setSelectedItems(selectAll ? [] : allItemIndexes);
    setSelectAll(!selectAll);
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}></div>
      {/* List of cart items */}
      <ul className="cart-list">
        {cartItems.map((item, index) => (
          <li key={index} className="cart-item">
            <div className="cart-details">
              <span className="cart-name">{item.name}</span>
              <span className="cart-price">${item.price}</span>
              {/* Display the product image */}
              <img src={item.imageSrc} alt={item.name} className="cart-image" />
            </div>
            {/* Checkbox for each item */}
            <input
              type="checkbox"
              checked={selectedItems.includes(index)}
              onChange={() => handleCheckboxChange(index)}
              className="custom-checkbox"
            />
            {/* Remove button for each item */}
            <button className="remove-button" onClick={() => handleRemoveFromCart(index)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* "Select All" checkbox */}
      <div className="select-all">
      <input
        type="checkbox"
        checked={selectAll}
        onChange={handleSelectAllChange}
        className="custom-checkbox"
      /> select All
      </div>
      <br></br>
      {/* Display total price */}
      <div className="total-price" style={{ fontWeight: 'bold', fontSize: '15px' }}>
      Total Price: ${totalPrice.toFixed(2)}
      </div>
      {/* Home button */}
      <FaHome style={{ cursor: 'pointer', marginTop: '20px', height: '25px', width: '35px' }} onClick={goToHomePage} />
      <button className="checkout-button" onClick={goToPaymentPage}> CHECKOUT </button>
    </div>
  );
};

export default CartPage;
