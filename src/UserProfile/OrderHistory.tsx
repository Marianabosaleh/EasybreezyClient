import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './profileC.css';

interface Order {
  id: string;
  items: {
    description: string;
    imageSrc: string;
    name: string;
    price: number | string;
  }[];
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
}

const OrdersHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setIsLoading(true);
      setError(null);
      if (currentUser) {
        const db = getFirestore();
        const ordersCollectionRef = collection(db, 'orders');
        const userOrdersQuery = query(ordersCollectionRef, where('customer.email', '==', currentUser.email));
        try {
          const querySnapshot = await getDocs(userOrdersQuery);
          const seenOrders = new Set();
          const userOrders: Order[] = [];
          querySnapshot.docs.forEach(doc => {
            const orderData = doc.data() as Omit<Order, 'id'>;
            // Construct a unique identifier for each order to check for duplicates
            const uniqueIdentifier = `${orderData.customer.email}-${orderData.totalPrice}`;
            if (!seenOrders.has(uniqueIdentifier)) {
              seenOrders.add(uniqueIdentifier);
              userOrders.push({
                id: doc.id,
                ...orderData,
              });
            }
          });
          setOrders(userOrders);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch orders.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('User is not authenticated');
        setIsLoading(false);
      }
    };
  
    fetchOrderHistory();
  }, [currentUser]);
  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Orders History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <div>
                <h3>Order ID: {order.id}</h3>
                <p>Total Price: ${typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : order.totalPrice}</p>
                <p>Address: {order.address.street}, {order.address.city}, {order.address.zip}</p>
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
  );
};

export default OrdersHistory;
