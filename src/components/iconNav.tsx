import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { FaHeart, FaUser, FaShoppingCart, FaHome, FaSearch } from 'react-icons/fa';
interface Agent {
  userTypeAgent: string;
}

interface Customer {
  userTypeCustomer: string;
}

const IconNav: React.FC = () => {
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
    <div className="iconNav">
      {/* Icons */}
      <div className="icon-container">
        <Link to="/SearchPage">
          <FaSearch className="search-icon" />
        </Link>
        <Link to="/HomePage">
          <FaHome  className="home-icon"/>
        </Link>
        <Link to="/CartPage">
          <FaShoppingCart className="cart-icon" />
        </Link>
        <Link to="/FavoritesPage">
          <FaHeart className="heart-icon" />
        </Link>
        {matchingAgents.length > 0 ? (
          <Link to="/profileAgent">
            <FaUser className="user-icon" />
          </Link>
        ) : matchingCustomers.length > 0 ? (
          <Link to="/profileCustomer">
            <FaUser className="user-icon" />
          </Link>
        ) : (
          <FaUser className="user-icon" />
        )}
      </div>
    </div>
  );
};
export default IconNav;