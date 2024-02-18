import React, { useEffect, useState } from 'react';
import { getCartItems, removeFromCart } from '../firebase';
import { getAuth } from 'firebase/auth';
import { FaHome } from 'react-icons/fa';
import './CartPage.css';
import PaymentForm from '../UserProfile/Payment';

const CartPage: React.FC = () => {
  // State for cart items, user authentication, selected items, select all checkbox, total price, and checkout status
  const [cartItems, setCartItems] = useState<any[]>([]);
  const auth = getAuth();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isCheckoutClicked, setIsCheckoutClicked] = useState(false);

  // Fetch cart items when component mounts or user authentication changes
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const items = await getCartItems(userId);
          setCartItems(items);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error(
          'Error fetching cart items:',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    };

    fetchCartItems();
  }, [auth]);

  // Recalculate total price when selected items change
  useEffect(() => {
    calculateTotal();
  }, [selectedItems]);

  // Calculate the total price of selected items
  const calculateTotal = () => {
    const total = selectedItems.reduce(
      (acc, index) => acc + cartItems[index].price,
      0
    );
    setTotalPrice(total);
  };

  // Remove item from cart and update the cart items
  const handleRemoveFromCart = async (index: number) => {
    console.log('Removing item at index:', index);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        await removeFromCart(userId, index);
        const updatedItems = await getCartItems(userId);
        setCartItems(updatedItems);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error removing item from cart:', (error as Error).message);
    }
  };

  // Navigate to the home page
  const goToHomePage = () => {
    window.location.href = '/HomePage';
  };

  // Set checkout clicked state to true
  const handleCheckoutClick = () => {
    setIsCheckoutClicked(true);
  };

  // Toggle checkbox selection for a specific item
  const handleCheckboxChange = (index: number) => {
    const isSelected = selectedItems.includes(index);
    const updatedSelection = isSelected
      ? selectedItems.filter((itemIndex) => itemIndex !== index)
      : [...selectedItems, index];
    setSelectedItems(updatedSelection);
  };

  // Get the count of selected items
  const getSelectedItemsCount = () => selectedItems.length;

  // Toggle select all checkbox
  const handleSelectAllChange = () => {
    const allItemIndexes = cartItems.map((_, index) => index);
    setSelectedItems(selectAll ? [] : allItemIndexes);
    setSelectAll(!selectAll);
  };

  // Render the cart page
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}></div>
      <ul className="cart-list">
        {/* Render each item in the cart */}
        {cartItems.map((item, index) => (
          <li key={index} className="cart-item">
            <div className="cart-details">
              <span className="cart-name">{item.name}</span>
              <span className="cart-price">${item.price}</span>
              <img src={item.imageSrc} alt={item.name} className="cart-image" />
            </div>
            <input
              type="checkbox"
              checked={selectedItems.includes(index)}
              onChange={() => handleCheckboxChange(index)}
              className="custom-checkbox"
            />
            <button className="remove-button" onClick={() => handleRemoveFromCart(index)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* Select All checkbox */}
      <div className="select-all">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAllChange}
          className="custom-checkbox"
        /> Select All
      </div>
      <br></br>
      {/* Total price */}
      <div className="total-price" style={{ fontWeight: 'bold', fontSize: '15px' }}>
        Total Price: ${totalPrice.toFixed(2)}
      </div>
      {/* Home button */}
      <FaHome style={{ cursor: 'pointer', marginTop: '25px', height: '30px', width: '55px' }} onClick={goToHomePage} />
      {/* Checkout button */}
      <button className="checkout-button" onClick={handleCheckoutClick}> CHECKOUT ({getSelectedItemsCount()}) </button>
      {/* Conditionally render PaymentForm only when checkout is clicked */}
      {isCheckoutClicked && (
      <PaymentForm cartItems={cartItems.filter((_, index) => selectedItems.includes(index))} totalPrice={totalPrice} />
      )}
      
    </div>
  );
};

export default CartPage;
