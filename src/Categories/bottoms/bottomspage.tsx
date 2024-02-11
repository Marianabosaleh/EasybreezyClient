// Import statements for Firebase and React

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const BottomPage = () => {
  // State to store bottoms data
  const [bottoms, settops] = useState<any[]>([]); // Assuming bottoms data has any type

  // Fetch bottoms data from Firestore when the component mounts
  useEffect(() => {
    const fetchbottoms = async () => {
      try {
        const db = getFirestore();
        const bottomsRef = collection(db, 'bottoms');
        const querySnapshot = await getDocs(bottomsRef);
        const bottomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        settops(bottomsData);
      } catch (error) {
        console.error('Error fetching shoes:', error);
      }
    };

    fetchbottoms();
  }, []);

  return (
    <div>
      <h1>bottoms Products</h1>
      <div>
        {bottoms.map(bottom => (
          <div key={bottom.id}>
            <h2>{bottom.name}</h2>
            <img src={bottom.imageSrc} alt={bottom.name} />
            <p>{bottom.description}</p>
            <p>Price: ${bottom.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomPage;
