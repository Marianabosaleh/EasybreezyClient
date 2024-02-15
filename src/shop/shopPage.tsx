import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ShopPage: React.FC<{ shopName: string }> = ({ shopName }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Shop Name:", shopName);
        const db = getFirestore();
        const q = query(collection(db, 'products'), where('shopName', '==', shopName));
        const querySnapshot = await getDocs(q);
        const productData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [shopName]);

  return (
    <div>
      
      <h1>Shop Page</h1>
      <Link to="/AddProductForm">
        <p className="category-name">Add Product</p>
      </Link>
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

export default ShopPage;
