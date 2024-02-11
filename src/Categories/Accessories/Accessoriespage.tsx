// Import statements for Firebase and React

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const AccessoriesPage = () => {
  // State to store Accessories data
  const [Accessories, settops] = useState<any[]>([]); // Assuming Accessorie data has any type

  // Fetch Accessories data from Firestore when the component mounts
  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const db = getFirestore();
        const AccessoriesRef = collection(db, 'Accessories');
        const querySnapshot = await getDocs(AccessoriesRef);
        const AccessoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        settops(AccessoriesData);
      } catch (error) {
        console.error('Error fetching Accessories:', error);
      }
    };

    fetchAccessories();
  }, []);

  return (
    <div>
      <h1>bottoms Products</h1>
      <div>
        {Accessories.map(Accessorie => (
          <div key={Accessorie.id}>
            <h2>{Accessorie.name}</h2>
            <img src={Accessorie.imageSrc} alt={Accessorie.name} />
            <p>{Accessorie.description}</p>
            <p>Price: ${Accessorie.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessoriesPage;
