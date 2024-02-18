import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MdOutlineAddHome, MdPayment } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';

interface PaymentFormProps {
  cartItems: any[]; // Change 'any[]' to the actual type of your cart items
  totalPrice: number;
}

interface PaymentDetails {
  visaNumber: string;
  cvv: string;
  expirationDate: string;
}

interface AddressDetails {
  street: string;
  city: string;
  zipCode: string;
}

interface OrderDetails {
  items: {
    description: string;
    imageSrc: string;
    name: string;
    price: number;
  }[];
  totalPrice: number;
  customer: {
    email: string;
    visaNumber: string;
  };
  address: {
    city: string;
    street: string;
    zip: string;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({ cartItems, totalPrice }) => {
  // State variables for form fields
  const [visaNumber, setVisaNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  // State to store whether the order has been successfully placed
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Get the authentication instance and the currently authenticated user
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // State to store submitted data
  const [submittedData, setSubmittedData] = useState<{
    payment: PaymentDetails | null;
    address: AddressDetails | null;
  }>({
    payment: null,
    address: null,
  });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks for CVV, expiration date, and required fields
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

    try {
      // Firestore collection reference for orders
      const ordersCollectionRef = collection(getFirestore(), 'orders');

      // Create an OrderDetails object with data from the form
      const orderDetails: OrderDetails = {
        items: cartItems.map(item => ({
          description: item.name,
          imageSrc: item.imageSrc,
          name: item.name,
          price: item.price,
        })),
        totalPrice: totalPrice,
        customer: {
          email: currentUser && currentUser.email ? currentUser.email : 'unknown@example.com',
          visaNumber: visaNumber,
        },
        address: {
          city: city,
          street: street,
          zip: zipCode,
        },
      };

      // Add the order to the Firestore collection
      const orderDocRef = await addDoc(ordersCollectionRef, orderDetails);

    // Set orderPlaced to true after successful order placement
    setOrderPlaced(true);
      console.log('Order placed successfully!', orderDocRef.id);

      // Clear form fields after submission
      setSubmittedData({
        payment: {
          visaNumber: '',
          cvv: '',
          expirationDate: '',
        },
        address: {
          street: '',
          city: '',
          zipCode: '',
        },
      });

      console.log('Payment and address data updated in Firestore!');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  // Fetch payment and address details from Firestore when the component mounts
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      // Firestore document references for payment and address details
      const paymentsDocRef = doc(getFirestore(), 'payments', 'paymentDetails');
      const addressesDocRef = doc(getFirestore(), 'addresses', 'addressDetails');

      // Fetch data from Firestore
      const paymentDetails = (await getDoc(paymentsDocRef)).data() as PaymentDetails;
      const addressDetails = (await getDoc(addressesDocRef)).data() as AddressDetails;

      // Update the state with the fetched data
      if (paymentDetails || addressDetails) {
        setSubmittedData({
          payment: paymentDetails,
          address: addressDetails,
        });
      }
    };

    fetchPaymentDetails();
  }, []);

  // Navigate to the home page
  const goToHomePage = () => {
    window.location.href = '/HomePage';
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Payment section */}
        <label>
          <br />
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MdPayment style={{ marginRight: '8px', fontSize: '24px', fontWeight: 'bold' }} />
              <span style={{ fontSize: '19px' }}>Payment</span>
            </div>
          </div>
          <br />
          <i className="fas fa-credit-card"></i> Visa Number: <br />
          <input type="text" value={visaNumber} onChange={(e) => setVisaNumber(e.target.value)} />
        </label>
        <br />
        <label>
          <i className="fas fa-lock"></i> CVV:
          <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={3} />
        </label>
        <br />
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
            <MdOutlineAddHome style={{ marginRight: '8px', fontSize: '25px', fontWeight: 'bold' }} />
            <span style={{ fontSize: '19px' }}>Shipping Address</span>
          </div>
        </div>
        <br />
        <label>
          <i className="fas fa-map-marker-alt"></i> Street:
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
        </label>
        <br />
        <label>
          <i className="fas fa-city"></i> City:
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <br />
        <label>
          <i className="fas fa-mail-bulk"></i> Zip Code:
          <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </label>
        <br />
        <br />
        <button type="submit">Place Order</button>
      </form>
       {/* Display success message when order is successfully placed */}
       {orderPlaced && <p>Order placed successfully!</p>}

      <br />
      <FaHome
        onClick={goToHomePage}
        style={{ cursor: 'pointer', marginTop: '20px', height: '25px', width: '35px' }}
      />
    </div>
  );
};

export default PaymentForm;
