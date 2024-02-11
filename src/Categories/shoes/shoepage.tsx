// Import statements for Firebase and React
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const ShoePage = () => {
  // State to store shoe data
  const [shoes, setShoes] = useState<any[]>([]); // Assuming shoe data has any type

  // Fetch shoe data from Firestore when the component mounts
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const db = getFirestore();
        const shoesRef = collection(db, 'shoes');
        const querySnapshot = await getDocs(shoesRef);
        const shoeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShoes(shoeData);
      } catch (error) {
        console.error('Error fetching shoes:', error);
      }
    };

    fetchShoes();
  }, []);

  return (
    <div>
      <h1>Shoe Products</h1>
      <div>
        {shoes.map(shoe => (
          <div key={shoe.id}>
            <h2>{shoe.name}</h2>
            <img src={shoe.imageSrc} alt={shoe.name} />
            <p>{shoe.description}</p>
            <p>Price: ${shoe.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoePage;
