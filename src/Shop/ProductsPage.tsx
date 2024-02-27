import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaHome } from 'react-icons/fa';
import { getShopProducts, removeProductFromShop, removeProductFromCat } from '../firebase';
import { IoTrash } from "react-icons/io5";
import IconNav from '../components/iconNav';


interface Product {
  id: number;
  userId: string;
  name: string;
  imageSrc: string;
  description: string;
  price: number;
  selectedCategory: 'tops' | 'bottoms' | 'shoes' | 'accessories';
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const items = await getShopProducts(userId) as Product[];
          const itemsWithCategory = items.map(item => ({...item, selectedCategory: item.selectedCategory || ''}));
          setProducts(itemsWithCategory);
          setLoading(false);
        } else {
          console.log('User is not authenticated');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching shop products:', error instanceof Error ? error.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [auth]);

  const handleRemoveFromShop = async (index: number) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const removedProduct = products[index];
        await removeProductFromShop(userId, index);
        await removeProductFromCat(removedProduct.id, removedProduct.selectedCategory);
        const updatedItems = await getShopProducts(userId);
        setProducts(updatedItems);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error removing product:', (error as Error).message);
    }
  };

  return (
    <div>
      <h1>Shop Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {products.length === 0 ? (
            <p>No products found in the shop.</p>
          ) : (
            <ul>
              {products.map((product, index) => (
                <li key={product.id}>
                  <div>
                    <p>product id : {product.id}</p>
                    <p>Name: {product.name}</p>
                    <p>Description: {product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Category: {product.selectedCategory}</p>
                    <img src={product.imageSrc} alt={product.name} style={{ width: '100px', height: '100px' }} />
                  </div>
                  <IoTrash style={{ cursor: 'pointer', marginTop: '25px', height: '30px', width: '30px' }} onClick={() => handleRemoveFromShop(index)} />
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <IconNav />
    </div>
  );
};

export default ProductsPage;
