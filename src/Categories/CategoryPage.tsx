import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import CartHandler from './carthandler';
import FavoritesHandler from './favoriteshandler'; // Corrected import name
import './style.css';

interface Props {
  categoryName: 'tops' | 'bottoms' | 'shoes' | 'accessories';
}

interface Product {
  id: string;
  name: string;
  imageSrc: string;
  description: string;
  price: number;
  selectedCategory: 'tops' | 'bottoms' | 'shoes' | 'accessories';
}

const CategoryPage: React.FC<Props> = ({ categoryName }: Props) => {
  if (!['tops', 'bottoms', 'shoes', 'accessories'].includes(categoryName)) {
    throw new Error('Invalid category name. Category name must be one of "tops", "bottoms", "shoes", or "accessories".');
  }

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore();
        const productsRef = collection(db, categoryName);
        console.log('Firestore Query:', productsRef);
        
        const querySnapshot = await getDocs(productsRef);
        console.log('Query Snapshot:', querySnapshot);

        const productData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        console.log('Fetched Products:', productData);

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
          <div key={product.id} className="product-item"> {/* Added className for styling */}
            
            <img src={product.imageSrc} alt={product.name} style={{ width: '200px', height: 'auto' }} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <div className="button-container">
              <CartHandler product={product} />
              <FavoritesHandler product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default CategoryPage;
