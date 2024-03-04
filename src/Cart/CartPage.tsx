import React, { useEffect, useState } from 'react';
import { getCartItems, removeFromCart } from '../firebase';
import { getAuth } from 'firebase/auth';
import './CartPage.css';
import PaymentForm from '../UserProfile/Payment';
import IconNav from '../components/iconNav';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

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
    console.log("Cart Items:", cartItems);
    console.log("Selected Items:", selectedItems);
    calculateTotal(selectedItems, cartItems); // Pass the selectedItems and cartItems to calculateTotal
  }, [selectedItems, cartItems]);

  // Remove item from cart and update the cart items
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

  // Toggle checkbox selection for a specific item
  const handleCheckboxChange = (index: number) => {
    const isSelected = selectedItems.includes(index);
    const updatedSelection = isSelected
      ? selectedItems.filter((itemIndex) => itemIndex !== index)
      : [...selectedItems, index];
    setSelectedItems(updatedSelection);
  };

  // Toggle select all checkbox
  const handleSelectAllChange = () => {
    const allItemIndexes = cartItems.map((_, index) => index);
    setSelectedItems(selectAll ? [] : allItemIndexes);
    setSelectAll(!selectAll);
  };

 // Calculate the total price
const calculateTotal = (selectedItems: number[], cartItems: any[]) => {
  const total = selectedItems.reduce((acc, index) => {
    // Ensure that cartItems[index] exists before accessing its properties
    if (cartItems[index]) {
      return acc + parseFloat(cartItems[index].price);
    }
    return acc;
  }, 0);
  setTotalPrice(total);
};


  // Render the cart page
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}></div>
      {cartItems.length > 0 ? (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="cart-details">
                  <img src={item.imageSrc} alt={item.name} className="cart-image" />
                  <div className="cart-info">
                    <span className="cart-name">{item.name}</span>
                    <span className="cart-price">${item.price}</span>
                  </div>
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
          <div className="select-all">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
              className="custom-checkbox"
            /> Select All
          </div>
          <div className="total-price">
            Total Price: ${totalPrice.toFixed(2)}
          </div>
          <button className="checkout-button" onClick={() => setIsCheckoutClicked(true)}>
            CHECKOUT 
          </button>
          {isCheckoutClicked && (
            <PaymentForm cartItems={cartItems.filter((_, index) => selectedItems.includes(index))} totalPrice={totalPrice} />
          )}
        </>
      ) : (
        <div className="empty-cart-message">
          <RemoveShoppingCartIcon style={{ fontSize: 60, color: 'gray', margin: '20px' }} />
          <p>Your cart is empty</p>
        </div>
      )}
      <IconNav />
    </div>
  );
};
export default CartPage;

