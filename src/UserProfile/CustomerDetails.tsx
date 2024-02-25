import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { format } from 'date-fns';
import { FaHome } from 'react-icons/fa';
import './profileC.css'; // Assuming the same CSS file is applicable

interface Customer {
  id: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  email: string;
}

const CustomerDetailsPage: React.FC = () => {
  const [matchingCustomers, setMatchingCustomers] = useState<Customer[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (currentUser) {
        const firestore = getFirestore();
        const customersCollection = collection(firestore, 'customers');
        const q = query(customersCollection, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        const customers = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Customer[];
        setMatchingCustomers(customers);
      }
    };

    fetchCustomers();
  }, [currentUser]);

  const formatDate = (dateString: string) => format(new Date(dateString), 'MMMM dd, yyyy');

  return (
    <div className="main-container">
      <div className="agent-details-container"> {/* Use the same container class for consistency */}
        {matchingCustomers.map((customer) => (
          <div key={customer.id} className="agent-details"> {/* Use the same details class for styling */}
            <h2>{customer.firstName} {customer.lastName}</h2> {/* Combine names for a concise header */}
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Date of Birth:</strong> {formatDate(customer.dateOfBirth)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
