import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './style.css';
import shoes from './shoes.jpg';
import T_SHIRT from './tops.jpg';
import bottoms from './bottoms.jpg'
import accessories from './accessories.jpg'

import { FaHeart, FaUser, FaShoppingCart, FaHome, FaSearch } from 'react-icons/fa';
import IconNav from '../components/iconNav';
interface Agent {
  userTypeAgent: string;
}

interface Customer {
  userTypeCustomer: string;
}

const HomePage: React.FC = () => {
  const [matchingAgents, setMatchingAgents] = useState<Agent[]>([]);
  const [matchingCustomers, setMatchingCustomers] = useState<Customer[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
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

  useEffect(() => {
    fetchAgents();
  }, [currentUser]);

  const fetchAgents = async () => {
    try {
      const auth = getAuth();
      if (currentUser) {
        const firestore = getFirestore();
        const agentsCollection = collection(firestore, 'agents');
        const agentsQuery = query(agentsCollection, where('email', '==', currentUser.email));
        const agentsSnapshot = await getDocs(agentsQuery);

        if (!agentsSnapshot.empty) {
          // User is an agent, fetch and set matching agents logic
          const agents: Agent[] = [];

          agentsSnapshot.forEach((doc) => {
            const agentData = doc.data() as Agent;
            agents.push({
              userTypeAgent: agentData.userTypeAgent,
              // ... (other agent properties)
            });
          });

          setMatchingAgents(agents);
        } else {
          // User is not an agent, check in 'customers' collection
          const customersCollection = collection(firestore, 'customers');
          const customersQuery = query(customersCollection, where('email', '==', currentUser.email));
          const customersSnapshot = await getDocs(customersQuery);

          if (!customersSnapshot.empty) {
            // User is a customer, fetch and set matching customers logic
            const customers: Customer[] = [];

            customersSnapshot.forEach((doc) => {
              const customerData = doc.data() as Customer;
              customers.push({
                userTypeCustomer: customerData.userTypeCustomer,
                // ... (other customer properties)
              });
            });

            setMatchingCustomers(customers);
          } else {
            console.log('User is neither agent nor customer.');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching agents/customers:', error);
    }
  };

  return (
    <div className="HomePage">
      <div className='Home'><h1>Welcome to Our Shopping Website!</h1></div>
      {/* Categories */}
      <div className="categories-row">
        {/* Shoes category */}
        <Link to="/ShoePage" className="category-container">
          <img src={shoes} alt="shoes" className="category-image" />
          <p className="category-name">Shoes</p>
        </Link>
        {/* Bottoms category */}
        <Link to="/BottomsPage" className="category-container">
          <img src={bottoms} alt="bottoms" className="category-image" />
          <p className="category-name">Bottoms</p>
        </Link>
      </div>
      <div className="categories-row">
        {/* Accessories category */}
        <Link to="/AccessoriesPage" className="category-container">
          <img src={accessories} alt="Accessories" className="category-image" />
          <p className="category-name">Accessories</p>
        </Link>
        {/* Tops category */}
        <Link to="/TopsPage" className="category-container">
          <img src={T_SHIRT} alt="tops" className="category-image" />
          <p className="category-name">Tops</p>
        </Link>
      </div>

      <IconNav/>
    </div>
  );
};
export default HomePage;


