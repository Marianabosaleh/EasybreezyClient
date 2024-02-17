import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { MdOutlineAddHome, MdPayment } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';

// Define a type for the payment details
interface PaymentDetails {
  visaNumber: string;
  cvv: string;
  expirationDate: string;
}

// Define a type for the address details
interface AddressDetails {
  street: string;
  city: string;
  zipCode: string;
}

const PaymentForm: React.FC = () => {
  // State to hold user input for payment
  const [visaNumber, setVisaNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  // State to hold user input for address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  // State to hold submitted payment and address data
  const [submittedData, setSubmittedData] = useState<{ payment: PaymentDetails | null, address: AddressDetails | null }>({
    payment: null,
    address: null,
  });

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CVV (should be exactly 3 numbers)
    if (!/^\d{3}$/.test(cvv)) {
      alert('Please enter a valid 3-digit CVV.');
      return;
    }

    // Validate Expiration Date (should be in the format MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      alert('Please enter a valid expiration date in the format MM/YY.');
      return;
    }

    // Check if any payment or address field is empty
    if (!visaNumber || !cvv || !expirationDate || !street || !city || !zipCode) {
      alert('Please fill in all the required fields.');
      return;
    }

    try {
      // Get a reference to the 'payments' collection in Firestore
      const paymentsCollectionRef = collection(getFirestore(), 'payments');

      // Update the payment details with the new information
      await setDoc(doc(paymentsCollectionRef, 'paymentDetails'), {
        visaNumber,
        cvv,
        expirationDate,
      });

      // Get a reference to the 'addresses' collection in Firestore
      const addressesCollectionRef = collection(getFirestore(), 'addresses');

      // Update the address details with the new information
      await setDoc(doc(addressesCollectionRef, 'addressDetails'), {
        street,
        city,
        zipCode,
      });

      // Remove the user-entered details from the state
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
      console.error('Error updating payment and address data:', error);
    }
  };

  // Function to retrieve submitted payment and address data on component mount
  useEffect(() => {
    // Retrieve data from the 'payments' collection in Firestore
    const fetchPaymentDetails = async () => {
      const paymentsDocRef = doc(getFirestore(), 'payments', 'paymentDetails');
      const paymentDetails = (await getDoc(paymentsDocRef)).data() as PaymentDetails;

      // Retrieve data from the 'addresses' collection in Firestore
      const addressesDocRef = doc(getFirestore(), 'addresses', 'addressDetails');
      const addressDetails = (await getDoc(addressesDocRef)).data() as AddressDetails;

      if (paymentDetails || addressDetails) {
        setSubmittedData({
          payment: paymentDetails,
          address: addressDetails,
        });
      }
    };

    fetchPaymentDetails();
  }, []);

  const goToHomePage = () => {
    window.location.href = '/HomePage';
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Payment section */}
        <label>
          <br></br>
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <MdPayment style={{ marginRight: '8px', fontSize: '24px', fontWeight: 'bold' }} />
          <span style={{ fontSize: '19px' }}>Payment</span>
          </div>          
          </div>
          <br></br>
          <i className="fas fa-credit-card"></i> Visa Number: <br></br>
          <input
            type="text"
            value={visaNumber}
            onChange={(e) => setVisaNumber(e.target.value)}
          />
        </label>
        <br />
        <label>
          <i className="fas fa-lock"></i> CVV:
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength={3}
          />
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
        <br></br><br></br>

        {/* Address section */}
        <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <MdOutlineAddHome style={{ marginRight: '8px', fontSize: '25px', fontWeight: 'bold' }} />
        <span style={{ fontSize: '19px' }}>Shipping Address</span>
        </div>
        </div>
        <br></br>
        <label>
          <i className="fas fa-map-marker-alt"></i> Street:
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </label>
        <br />
        <label>
          <i className="fas fa-city"></i> City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <br />
        <label>
          <i className="fas fa-mail-bulk"></i> Zip Code:
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </label>
        <br />
        <br></br>
        <button type="submit">Place Order</button>
      </form>
      <br></br>
      <FaHome onClick={goToHomePage} style={{ cursor: 'pointer', marginTop: '20px', height: '25px', width: '35px' }} />
    </div>
  );
};

export default PaymentForm;