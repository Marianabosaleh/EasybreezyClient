import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Props {
  categoryName: 'tops' | 'bottoms' | 'shoes' | 'accessories'; // Define the type for categoryName
}

const CategoryPage: React.FC<Props> = ({ categoryName }: Props) => {
  // Validate category name
  if (!['tops', 'bottoms', 'shoes', 'accessories'].includes(categoryName)) {
    throw new Error('Invalid category name. Category name must be one of "tops", "bottoms", "shoes", or "accessories".');
  }

  // State to store product data
  const [products, setProducts] = useState<any[]>([]); // Assuming product data has any type

  // Fetch product data from Firestore when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore();
        const productsRef = collection(db, categoryName); // Use the provided category name
        const querySnapshot = await getDocs(productsRef);
        const productData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productData);
      } catch (error) {
        console.error(`Error fetching ${categoryName}:`, error);
      }
    };

    fetchProducts();
  }, [categoryName]); // Include categoryName in dependencies to re-fetch data when it changes

  return (
    <div>
      <h1>{`${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Products`}</h1>
      <div className="product-container">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            <img src={product.imageSrc} alt={product.name} className="product-image" style={{ maxWidth: '200px', maxHeight: '150px' }} />
            <p className="product-description">{product.description}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default CategoryPage;
