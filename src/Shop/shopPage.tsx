// ShopPage.tsx

import React, { useState } from 'react';
import { getShopProducts, addProductToShop, removeProductFromShop, addProductToCat } from '../firebase';
import { getAuth } from 'firebase/auth';
import './ShopPage.css';
import ProductForm from './productform';

interface Product {
  id: string;
  name: string;
  imageSrc: string;
  description: string;
  price: number;
  selectedCategory: 'tops' | 'bottoms' | 'shoes' | 'accessories';
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  const handleAddToCategory = async (productData: Product) => {
    try {
      if (currentUser) {
        const updatedProductData = { ...productData, userId: currentUser.uid };
        await addProductToShop(updatedProductData);
        await addProductToCat(productData.id , productData.name, productData.imageSrc, productData.description, productData.price, productData.selectedCategory);
        const updatedItems = await getShopProducts(currentUser.uid);
        setProducts(updatedItems);
        alert(`Product added successfully to ${productData.selectedCategory}`);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      alert(`Error adding product to ${productData.selectedCategory}: ` + (error as Error).message);
    }
  };

  const handleProductFormSubmit = (productData: Product) => {
    handleAddToCategory(productData);
  };

  return (
    <div className="shop-page">
      <h1>My Shop</h1>
      <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}></div>
      <ProductForm onSubmit={handleProductFormSubmit} />
      
    </div>
  );
};

export default ShopPage;
