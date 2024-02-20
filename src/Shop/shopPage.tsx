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
    // Add any other product fields you have
}

interface ShopPageProps {
    userId: string; // Assuming you're passing the logged-in agent's user ID
}

const ShopPage: React.FC<ShopPageProps> = ({ userId }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [shopName, setShopName] = useState<string>('');

    useEffect(() => {
        const fetchProducts = async () => {
            const db = getFirestore();

            if (userId) {
                // Since shops are linked to the ownerId, we query based on the userId
                const shopsRef = collection(db, 'shops');
                const shopQuery = query(shopsRef, where('ownerId', '==', userId));
                const shopSnap = await getDocs(shopQuery);

                if (!shopSnap.empty) {
                    const shop = shopSnap.docs[0].data(); // Assuming an agent has only one shop
                    setShopName(shop.shopName);

                    // Fetch products for this shop
                    const productsRef = collection(db, `shops/${shopSnap.docs[0].id}/items`);
                    const productsSnap = await getDocs(productsRef);
                    const fetchedProducts = productsSnap.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Product[];
                    setProducts(fetchedProducts);
                } else {
                    console.log("Shop not found for the user ID:", userId);
                }
            }
        };

        fetchProducts();
    }, [userId]);
  return (
    <div>
      <div className="HomePage">
        <h1>Welcome to your Shopping Website!</h1>
        {/* Categories */}
        <div className="categories-row">
          {/* Shoes category */}
          <Link to="/ShoePage" className="category-container">
            <img src={shoes} alt="shoes" className="category-image" />
            <p className="category-name">Shoes</p>
          </Link>
          {/* Bottoms category */}
          <Link to="/BottomsPage" className="category-container">
            <img src={bottoms} alt="bottoms" className="category-image" />
            <p className="category-name">Bottoms</p>
          </Link>
        </div>
        <div className="categories-row">
          {/* Accessories category */}
          <Link to="/AccessoriesPage" className="category-container">
            <img src={accessories} alt="Accessories" className="category-image" />
            <p className="category-name">Accessories</p>
          </Link>
          {/* Tops category */}
          <Link to="/TopsPage" className="category-container">
            <img src={T_SHIRT} alt="tops" className="category-image" />
            <p className="category-name">Tops</p>
          </Link>
          <Link to="/AddProductForm">
        <p className="category-name">Add Product</p>
      </Link>
        </div>

        {/* Icons */}
        <div className="icon-container">
          <Link to="/SearchPage">
            <FaSearch className="search-icon" />
          </Link>
          <Link to="/HomePage">
            <FaHome  className="home-icon"/>
          </Link>
          <Link to="/CartPage">
            <FaShoppingCart className="cart-icon" />
          </Link>
          <Link to="/FavoritesPage">
            <FaHeart className="heart-icon" />
          </Link>
          <FaUser className="user-icon" />
        </div>
      </div>
      
      <h1>{shopName}</h1>
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
