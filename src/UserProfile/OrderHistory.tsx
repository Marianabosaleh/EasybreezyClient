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
    price: number;
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
      try {
        if (currentUser) {
          const userId = currentUser.uid;
          const ordersCollectionRef = collection(getFirestore(), 'orders');
          const userOrdersQuery = query(ordersCollectionRef, where('customer.email', '==', currentUser.email));
          const querySnapshot = await getDocs(userOrdersQuery);

          const userOrders: Order[] = [];
          querySnapshot.forEach((doc) => {
            userOrders.push({ id: doc.id, ...doc.data() } as Order);
        });

          setOrders(userOrders);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching order history:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchOrderHistory();
  }, [currentUser]);

  function goToHomePage() {
    // Perform redirection here
    window.location.href = '/HomePage'; 
  }

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
                <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
                <p>Address: {order.address.street}, {order.address.city}, {order.address.zip}</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <div>
                        <p>{item.name}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
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