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

      // Set submitted data
      setSubmittedData({
        payment: {
          visaNumber,
          cvv,
          expirationDate,
        },
        address: {
          street,
          city,
          zipCode,
        },
      });

      // Reset form fields
      setVisaNumber('');
      setCvv('');
      setExpirationDate('');
      setStreet('');
      setCity('');
      setZipCode('');

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
        <label>
        <br></br>
        <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
        <MdPayment style={{ marginRight: '8px', fontSize: '24px', fontWeight: 'bold' }} /> Payment
        </div><br></br>
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
        <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
       <MdOutlineAddHome style={{ marginRight: '8px', fontSize: '24px', fontWeight: 'bold' }} />Address
        </div><br></br>
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
        <button type="submit">Save</button>
      </form>
      <br></br>
      <FaHome onClick={goToHomePage} style={{ cursor: 'pointer' }} />
      {submittedData.payment && submittedData.address && (
        <div>
          <h2>Submitted Payment Data:</h2>
          <p>Visa Number: {submittedData.payment.visaNumber}</p>
          <p>CVV: {submittedData.payment.cvv}</p>
          <p>Expiration Date: {submittedData.payment.expirationDate}</p>

          <h2>Submitted Address Data:</h2>
          <p>Street: {submittedData.address.street}</p>
          <p>City: {submittedData.address.city}</p>
          <p>Zip Code: {submittedData.address.zipCode}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
