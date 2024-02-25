import React, { useEffect, useState } from 'react';
import { getShopProducts, addProductToShop, removeProductFromShop, addProductToCat } from '../firebase'; // Ensure all functions are imported
import { getAuth } from 'firebase/auth';
import './ShopPage.css';
import ProductForm from './productform'; // Check the correct import path

// Assuming Product interface is extended to include selectedCategory
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const items = await getShopProducts(userId) as Product[]; // Cast the fetched items to Product[]
          // Initialize selectedCategory for each product if not already present
          const itemsWithCategory = items.map(item => ({...item, selectedCategory: item.selectedCategory || ''}));
          setProducts(itemsWithCategory);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching shop products:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchProducts();
  }, [auth]);

  const handleRemoveFromShop = async (index: number) => {
    console.log('Removing product at index:', index);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        await removeProductFromShop(userId, index);
        const updatedItems = await getShopProducts(userId);
        setProducts(updatedItems);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error removing product from shop:', (error as Error).message);
    }
  };

  const handleCategoryChange = (index: number, newCategory: 'tops' | 'bottoms' | 'shoes' | 'accessories') => {
    const updatedProducts = products.map((product, prodIndex) => prodIndex === index ? {...product, selectedCategory: newCategory} : product);
    setProducts(updatedProducts);
  };

  const handleAddToCategory = async (index: number) => {
    const product = products[index];
    try {
      await addProductToCat(product.name, product.imageSrc, product.description, product.price, product.selectedCategory);
      alert(`Product added successfully to ${product.selectedCategory}`);
    } catch (error) {
      alert(`Error adding product to ${product.selectedCategory}: ` + (error as Error).message);
    }
  };

  return (
    <div className="shop-page">
      <h1>My Shop</h1>
      <div style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}></div>
      <ProductForm onSubmit={(productData) => addProductToShop(productData)} />
      <ul className="product-list">
        {products.map((product, index) => (
          <li key={product.id} className="product-item">
            <div className="product-details">
              <span className="product-name">{product.name}</span>
              <span className="product-price">${product.price}</span>
              <img src={product.imageSrc} alt={product.name} className="product-image" />
              {/* Additional product details can go here */}
              <select value={product.selectedCategory} onChange={(e) => handleCategoryChange(index, e.target.value as 'tops' | 'bottoms' | 'shoes' | 'accessories')}>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
              <button onClick={() => handleAddToCategory(index)}>Add to {product.selectedCategory}</button>
            </div>
            <button className="remove-button" onClick={() => handleRemoveFromShop(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShopPage;
