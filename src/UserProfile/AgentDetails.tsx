import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { format } from 'date-fns';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

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

  const fetchAgents = async () => {
    try {
      const auth = getAuth();
      if (currentUser) {
        const firestore = getFirestore();
        const agentsCollection = collection(firestore, 'agents');
        const q = query(agentsCollection, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        const agents: Agent[] = [];

        querySnapshot.forEach((doc) => {
          const agentData = doc.data() as Agent;
          agents.push({
            id: doc.id,
            dateOfBirth: agentData.dateOfBirth,
            description: agentData.description,
            shopName: agentData.shopName,
            firstName: agentData.firstName,
            lastName: agentData.lastName,
            email: agentData.email,
            userType: agentData.userType
          });
        });

        setMatchingAgents(agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [currentUser]);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
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
  const goToHomePage = () => {
    window.location.href = '/HomePage';
  };


  return (
      <div className="matching-agents">
        {matchingAgents.map((agent) => (
          <div key={agent.id} className="agent" onClick={() => handleAgentSelect(agent)}>
            <p>Shop Name: {agent.shopName}</p>
            <p>Description: {agent.description}</p>
            <p>Date of Birth: {formatDate(agent.dateOfBirth)}</p>
            <p>First Name: {agent.firstName}</p>
            <p>Last Name: {agent.lastName}</p>
            <p>Email: {agent.email}</p>
            <p>userType: {agent.userType}</p>
          </div>
        ))}
      {selectedAgent && (
        <div className="selected-agent">
          <p>First Name: {selectedAgent.firstName}
          </p>
          <p>Last Name: {selectedAgent.lastName}</p>
          <p>Email: {selectedAgent.email}</p>
          <h2>{selectedAgent.shopName}</h2>
          <p>Description: {selectedAgent.description}</p>
          <p>Date of Birth: {formatDate(selectedAgent.dateOfBirth)}</p>
          <p>User Type : {selectedAgent.userType}</p>
        </div>
      )}
       <FaHome onClick={goToHomePage} style={{ cursor: 'pointer' }} />
    </div>
  );
};

export default AgentDetailsPage;
