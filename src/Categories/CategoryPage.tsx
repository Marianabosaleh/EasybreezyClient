import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import CartHandler from './carthandler'; // Import the CartHandler component
import FavoitesHandler from './favoriteshandler';
import './style.css';


interface Props {
  categoryName: 'tops' | 'bottoms' | 'shoes' | 'accessories';
}

const CategoryPage: React.FC<Props> = ({ categoryName }: Props) => {
  if (!['tops', 'bottoms', 'shoes', 'accessories'].includes(categoryName)) {
    throw new Error('Invalid category name. Category name must be one of "tops", "bottoms", "shoes", or "accessories".');
  }

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore();
        const productsRef = collection(db, categoryName);
        const querySnapshot = await getDocs(productsRef);
        const productData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productData);
      } catch (error) {
        console.error(`Error fetching ${categoryName}:`, error);
      }
    };

    fetchProducts();
  }, [categoryName]);

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
    {/* Button container for aligning cart and favorite buttons */}
    <div className="button-container">
      {/* Use the CartHandler component for handling add to cart functionality */}
      <CartHandler product={product} />
      {/* Use the FavoritesHandler component for handling add to favorites functionality */}
      <FavoitesHandler product={product} /> {/* Assuming this should be FavoritesHandler */}
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default CategoryPage;
