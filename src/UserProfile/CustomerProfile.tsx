import React, { useEffect, useState } from "react";
import { IoList, IoHelpCircleOutline } from 'react-icons/io5';
import { ImProfile } from 'react-icons/im';
import { BsBoxArrowLeft } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

import './profileC.css';

interface Customer {
  id: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  email: string;
}

const CustomerProfilePage: React.FC = () => {
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
        const customersCollection = collection(firestore, 'customers');
        const q = query(customersCollection, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        const customers: Customer[] = [];

        querySnapshot.forEach((doc) => {
          const customerData = doc.data() as Customer;
          console.log('Customer Date of Birth:', customerData.dateOfBirth); // Check the date format
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

  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/HomePage');
  };

  return (
    <div>
      <h3>Hello, {currentUser ? currentUser.displayName : 'Guest'}</h3>
      <div className="main-container">
        <div className="left-nav">
          <Link to="/ordershistory">
            <IoList style={{ marginRight: '8px' }} /> My Orders
          </Link>
          <Link to="/customerdetails">
            <ImProfile style={{ marginRight: '8px' }} /> My Details
          </Link>
          <Link to="/NeedHelpPage">
            <IoHelpCircleOutline style={{ marginRight: '8px' }} />Need Help
          </Link>
          <Link to='./Welcome'>
            <BsBoxArrowLeft style={{ marginRight: '8px' }} /> Sign Out
          </Link>
          <FaHome onClick={goToHomePage} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
