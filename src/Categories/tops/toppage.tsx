// Import statements for Firebase and React

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const TopPage = () => {
  // State to store tops data
  const [tops, settops] = useState<any[]>([]); // Assuming tops data has any type

  // Fetch tops data from Firestore when the component mounts
  useEffect(() => {
    const fetchtops = async () => {
      try {
        const db = getFirestore();
        const topsRef = collection(db, 'tops');
        const querySnapshot = await getDocs(topsRef);
        const topsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        settops(topsData);
      } catch (error) {
        console.error('Error fetching tops:', error);
      }
    };

    fetchtops();
  }, []);

  return (
    <div>
      <h1>tops Products</h1>
      <div>
        {tops.map(top => (
          <div key={top.id}>
            <h2>{top.name}</h2>
            <img src={top.imageSrc} alt={top.name} />
            <p>{top.description}</p>
            <p>Price: ${top.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPage;
