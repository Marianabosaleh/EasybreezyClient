
 import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import shoes from '../Homepage/shoes.jpg';
import T_SHIRT from '../Homepage/tops.jpg';
import bottoms from '../Homepage/bottoms.jpg';
import accessories from '../Homepage/accessories.jpg';
import { FaHeart, FaUser, FaShoppingCart, FaHome, FaSearch } from 'react-icons/fa';


interface Product {
  id: string;
  name: string;
  imageSrc: string;
  description: string;
  price: number;
}

interface ShopPageProps {
  shopId: string;
  categoryName?: string; // Make categoryName optional
}

const ShopPage: React.FC<ShopPageProps> = ({ shopId, categoryName }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!shopId || !categoryName) {
        return; // If either shopId or categoryName is missing, don't fetch products
      }
      const db = getFirestore();
      const productsRef = collection(db, `shops/${shopId}/items`);
      const q = query(productsRef, where("categoryId", "==", categoryName));
      
      try {
        const querySnapshot = await getDocs(q);
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [shopId, categoryName]);
  
  
  return (
    <div>
      <div className="ShopPage">
        <h1>Welcome to your Shopping Website!</h1>
        {/* Categories */}
        <div className="categories-row">
          {/* Shoes category */}
          <Link to="/AgentShoesPage" className="category-container">
            <img src={shoes} alt="shoes" className="category-image" />
            <p className="category-name">Shoes</p>
          </Link>
          {/* Bottoms category */}
          <Link to="/AgentBottomsPage" className="category-container">
            <img src={bottoms} alt="bottoms" className="category-image" />
            <p className="category-name">Bottoms</p>
          </Link>
        </div>
        <div className="categories-row">
          {/* Accessories category */}
          <Link to="/AgentAccessoriesPage" className="category-container">
            <img src={accessories} alt="Accessories" className="category-image" />
            <p className="category-name">Accessories</p>
          </Link>
          {/* Tops category */}
          <Link to="/AgentTopsPage" className="category-container">
            <img src={T_SHIRT} alt="tops" className="category-image" />
            <p className="category-name">Tops</p>
          </Link>
          <Link to="/AddProductForm">
        <p className="category-name">Add Product</p>
      </Link>
        </div>


      </div>
      
    
      <div className="product-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <h2>{product.name}</h2>
              <img src={product.imageSrc} alt={product.name} />
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
            </div>
                    ))
                ) : (
                    <p>No products found in your shop</p>
                )}
            </div>
    </div>
  );
};

export default ShopPage;