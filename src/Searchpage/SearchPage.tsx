import React, { useState, useEffect } from 'react';
import './styleS.css';
import { getFirestore, collection, query, where, getDocs, DocumentData } from 'firebase/firestore'; // Adjust the import path as per your file structure
import { FaSearch, FaHome, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa'; // Importing Font Awesome icons
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts(); // Fetch all products initially
  }, []); // Run once on component mount

  const fetchProducts = async () => {
    const firestore = getFirestore();
    const categories = ['shoes', 'bottoms', 'tops', 'accessories'];
    const allProducts: Product[] = [];

    for (const category of categories) {
      const q = query(collection(firestore, category));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const productData: DocumentData = doc.data();
        allProducts.push({
          id: doc.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          imageSrc: productData.imageSrc,
        });
      });
    }

    setMatchingProducts(allProducts);
  };

  const handleSearch = async (term: string) => {
    console.log('Search term:', term);
    setSearchTerm(term);
    const firestore = getFirestore();
    const filteredProducts: Product[] = [];

    if (term.trim() !== '') {
      console.log('Performing search...');
      const categories = ['shoes', 'bottoms', 'tops', 'accessories'];

      for (const category of categories) {
        const q = query(collection(firestore, category), where('name', '>=', term.toLowerCase()));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const productData: DocumentData = doc.data();
          const productName = productData.name.toLowerCase();
          if (productName.includes(term.toLowerCase())) {
            filteredProducts.push({
              id: doc.id,
              name: productData.name,
              description: productData.description,
              price: productData.price,
              imageSrc: productData.imageSrc,
            });
          }
        });
      }
    } else {
      console.log('Search term is empty, fetching all products...');
      fetchProducts(); // Fetch all products when search term is empty
    }

    console.log('Matching products:', filteredProducts);
    setMatchingProducts(filteredProducts);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="search-page-container">
      <div className="icon-container">
        <Link to="/SearchPage" className="search-icon">
          <FaSearch />
        </Link>
        <Link to="/HomePage" className="home-icon">
          <FaHome />
        </Link>
        <FaShoppingCart className="cart-icon" />
        <FaHeart className="heart-icon" />
        <FaUser className="user-icon" />
      </div>
      <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }}>
        <input
          type="text"
          placeholder="Enter your search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          id="searchTerm"
          name="searchTerm"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="matching-products">
        {matchingProducts.map((product, index) => (
          <div key={index} className="product" onClick={() => handleProductSelect(product)}>
            <p>{product.name}</p>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.imageSrc} alt={product.name} style={{ width: '100px', height: '100px' }} />
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div className="selected-product">
          <h2>{selectedProduct.name}</h2>
          <p>Description: {selectedProduct.description}</p>
          <p>Price: ${selectedProduct.price}</p>
          <img src={selectedProduct.imageSrc} alt={selectedProduct.name} style={{ width: '200px', height: '200px' }} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
