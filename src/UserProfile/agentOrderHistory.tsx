import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// AgentOrders.tsx or wherever you need CartItem




interface CartItem {
  userId: any;
  agentUserId: string;
  description: string;
  imageSrc: string;
  name: string;
  price: number;
}

interface AgentOrder {
  id: string;
  items: CartItem[];
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
  userId: string;
}

const AgentOrders: React.FC = () => {
  const [orders, setOrders] = useState<AgentOrder[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchAgentOrders = async () => {
      if (currentUser) {
        const db = getFirestore();
        const ordersCollectionRef = collection(db, 'orders');
        // This query fetches orders where the order's userId matches the current user's ID
        const agentOrdersQuery = query(ordersCollectionRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(agentOrdersQuery);
    
        const agentOrders: AgentOrder[] = querySnapshot.docs.map(doc => {
          const orderData = doc.data() as Omit<AgentOrder, 'id'>;
          // Corrected: Filter items to include only those where item.userId matches the order's userId
          const filteredItems = orderData.items.filter(item => item.userId === orderData.userId);
          return {
            ...orderData, // Spread the order data here
            id: doc.id, // Include the document id as part of the order object
            items: filteredItems, // Use the filtered items
          };
        });
    

        setOrders(agentOrders);
      } else {
        console.log('User is not authenticated');
      }
    };
    
    

    fetchAgentOrders();
  }, [currentUser]);

  return (
    <div className="main-container">

    <div className="agent-details">
      <h1>Agent Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="agent-preview">
              <div>
                <h3>Order ID: {order.id}</h3>
                <p>Email: {order.customer.email}</p>
                <p>Address: {`${order.address.street}, ${order.address.city}, ${order.address.zip}`}</p>
                <p>Total Price: ${order.totalPrice}</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <p>Name: {item.name}</p>
                      <p>Description: {item.description}</p>
                      <p>Price: ${item.price}</p>
                      <img src={item.imageSrc} alt={item.name} style={{ width: '100px', height: '100px' }} />
                    </li>
                  ))}
                </ul>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
  
  ); 
};
  

export default AgentOrders;
