import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { format } from 'date-fns';
import { FaHome } from 'react-icons/fa';

interface Customer {
  id: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  email: string;
}

const CustomerDetailsPage: React.FC = () => {
  const [matchingCustomers, setMatchingCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      const auth = getAuth();
      if (currentUser) {
        const firestore = getFirestore();
        const customersCollection = collection(firestore, 'customers'); // Update collection name
        const q = query(customersCollection, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        const customers: Customer[] = [];

        querySnapshot.forEach((doc) => {
          const customerData = doc.data() as Customer;
          customers.push({
            id: doc.id,
            dateOfBirth: customerData.dateOfBirth,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
          });
        });

        setMatchingCustomers(customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentUser]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const formatDate = (dateString: string) => {
    try {
      const formattedDate = format(new Date(dateString), 'MMMM dd, yyyy');
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  function goToHomePage() {
    // Perform redirection here
    window.location.href = '/HomePage'; 
  }
  return (
    <div className="matching-customers">
      {matchingCustomers.map((customer) => (
        <div key={customer.id} className="customer" onClick={() => handleCustomerSelect(customer)}>
          <p>First Name: {customer.firstName}</p>
          <p>Last Name: {customer.lastName}</p>
          <p>Date of Birth: {formatDate(customer.dateOfBirth)}</p>
          <p>Email: {customer.email}</p>
        </div>
      ))}
      {selectedCustomer && (
        <div className="selected-customer">
          <p>First Name: {selectedCustomer.firstName}</p>
          <p>Last Name: {selectedCustomer.lastName}</p>
          <p>Email: {selectedCustomer.email}</p>
          <p>Date of Birth: {formatDate(selectedCustomer.dateOfBirth)}</p>
        </div>
      )}
      <FaHome onClick={goToHomePage} style={{ cursor: 'pointer' }} />
      </div>
  );
};

export default CustomerDetailsPage;