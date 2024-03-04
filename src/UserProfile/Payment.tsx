import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MdOutlineAddHome, MdPayment } from 'react-icons/md';

// Define types/interfaces for better code organization
interface PaymentFormProps {
  cartItems: CartItem[]; 
  totalPrice: number;
}

interface CartItem {
  userId: any;
  agentUserId: string;
  description: string;
  imageSrc: string;
  name: string;
  price: number;
}

interface OrderDetails {
  items: CartItem[];
  totalPrice: number;
  customer: {
    email: string;
  };
  address: {
    city: string;
    street: string;
    zip: string;
  };
  userId: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ cartItems, totalPrice }) => {
  // State variables to manage form input values and order placement status
  const [visaNumber, setVisaNumber] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  // Get the authentication instance and the currently authenticated user
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation checks for Visa number, CVV, expiration date, and required fields
    if (!/^\d+$/.test(visaNumber)) {
      alert('Please enter a valid Visa number with only numbers.');
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      alert('Please enter a valid 3-digit CVV.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      alert('Please enter a valid expiration date in the format MM/YY.');
      return;
    }

    if (!visaNumber || !cvv || !expirationDate || !street || !city || !zipCode) {
      alert('Please fill in all the required fields.');
      return;
    }

    // Group cart items by user ID for order creation
    const groupedItems = cartItems.reduce((acc: Record<string, CartItem[]>, item: CartItem) => {
      const userId = item.userId;
      acc[userId] = acc[userId] || [];
      acc[userId].push(item);
      return acc;
    }, {});

    try {
      // Create orders for each user with grouped items
      for (const [userId, items] of Object.entries(groupedItems)) {
        const orderDetails: OrderDetails = {
          items: cartItems.map(item => ({
            ...item,
            userId: item.userId, // Ensure this is included and correct
          })),
          totalPrice,
          customer: {
            email: currentUser?.email || '',
          },
          address: {
            city,
            street,
            zip: zipCode,
          },
          userId
        };
        
        // Add order details to Firestore collection 'orders'
        await addDoc(collection(getFirestore(), 'orders'), orderDetails);
      }

      // Set orderPlaced to true and optionally clear form fields
      setOrderPlaced(true);
      console.log('Orders placed successfully!');
    } catch (error) {
      console.error('Error placing orders:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Payment section */}
        <label>
          {/* Payment icon and title */}
          <br />
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MdPayment style={{ marginRight: '8px', fontSize: '24px', fontWeight: 'bold' }} />
              <span style={{ fontSize: '19px' }}>Payment</span>
            </div>
          </div>
          <br />
          {/* Visa number input */}
          <i className="fas fa-credit-card"></i> Visa Number: <br />
          <input type="text" value={visaNumber} onChange={(e) => setVisaNumber(e.target.value)} />
        </label>
        <br />
        {/* CVV input */}
        <label>
          <i className="fas fa-lock"></i> CVV:
          <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={3} />
        </label>
        <br />
       {/* Expiration date input */}
      <label>
       <i className="far fa-calendar-alt"></i> Expiration Date:
        <input
        type="text"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        maxLength={5}
       />
      </label>
        <br />
        <br />

        {/* Address section */}
        <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Shipping icon and title */}
            <MdOutlineAddHome style={{ marginRight: '8px', fontSize: '25px', fontWeight: 'bold' }} />
            <span style={{ fontSize: '19px' }}>Shipping Address</span>
          </div>
        </div>
        <br />
        {/* Street input */}
        <label>
          <i className="fas fa-map-marker-alt"></i> Street:
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
        </label>
        <br />
        {/* City input */}
        <label>
          <i className="fas fa-city"></i> City:
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <br />
        {/* Zip Code input */}
        <label>
          <i className="fas fa-mail-bulk"></i> Zip Code:
          <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </label>
        <br />
        <br />
        {/* Submit button for placing the order */}
        <button type="submit">Place Order</button>
      </form>
      {/* Display success message when the order is successfully placed */}
      {orderPlaced && <p>Order placed successfully!</p>}

      <br />
    </div>
  );
};

export default PaymentForm;
