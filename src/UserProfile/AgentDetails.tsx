import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { format } from 'date-fns';
import { FaHome, FaUser } from 'react-icons/fa';
import './profileC.css'; // Make sure to import your CSS file

interface Agent {
  id: string;
  dateOfBirth: string;
  description: string;
  shopName: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

const AgentDetailsPage: React.FC = () => {
  const [matchingAgents, setMatchingAgents] = useState<Agent[]>([]);
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

  const fetchAgents = async () => {
    try {
      if (currentUser) {
        const firestore = getFirestore();
        const agentsCollection = collection(firestore, 'agents');
        const q = query(agentsCollection, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        const agents = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})) as Agent[];
        setMatchingAgents(agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [currentUser]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  

  return (
    <div className="main-container">
      <div className="agent-details-container">
        {matchingAgents.map((agent) => (
          <div key={agent.id} className="agent-details">
            <h2>{agent.shopName}</h2>
            <p><strong>First Name:</strong> {agent.firstName}</p>
            <p><strong>Last Name:</strong> {agent.lastName}</p>
            <p><strong>Email:</strong> {agent.email}</p>
            <p><strong>Description:</strong> {agent.description}</p>
            <p><strong>Date of Birth:</strong> {formatDate(agent.dateOfBirth)}</p>
            <p><strong>User Type:</strong> {agent.userType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentDetailsPage;
