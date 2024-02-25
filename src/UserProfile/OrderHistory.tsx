import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FaHome } from 'react-icons/fa';

interface Order {
  id: string;
  items: {
    description: string;
    imageSrc: string;
    name: string;
    price: number | string; // Accept both number and string to ensure flexibility
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
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (currentUser) {
        const db = getFirestore();
        const ordersCollectionRef = collection(db, 'orders');
        const userOrdersQuery = query(ordersCollectionRef, where('customer.email', '==', currentUser.email));
        const querySnapshot = await getDocs(userOrdersQuery);

        const userOrders: Order[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Order, 'id'>), // Cast the rest of the data to the Order type, excluding 'id'
        }));

        setOrders(userOrders);
      } else {
        console.log('User is not authenticated');
      }
    };

    fetchOrderHistory();
  }, [currentUser]);

  const goToHomePage = () => {
    window.location.href = '/HomePage'; // Consider using React Router's navigate for SPA-friendly navigation
  };

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
                      <div>
                        <p>{item.name}</p>
                        <p>Price: ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
      <FaHome style={{ cursor: 'pointer', marginTop: '25px', height: '30px', width: '55px' }} onClick={goToHomePage} />
    </div>
  );
};

export default OrdersHistory;
