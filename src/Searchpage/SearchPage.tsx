import React, { useState, useEffect } from 'react';
import './styleS.css';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; // Adjust the import path as per your file structure
import { FaSearch, FaHome, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa'; // Importing Font Awesome icons
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

// Define the props interface for the SearchBar component
interface SearchBarProps {
  onSearch: (term: string) => void; // Function that accepts a string term and returns void
}

// Define the SearchBar component
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // Define state for the search term
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Event handler for input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the search term state
  };

  // Event handler for form submission
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    onSearch(searchTerm); // Call the onSearch function with the current search term
  };

  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        placeholder="Enter your search term"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

// Define the SearchPage component
const SearchPage: React.FC = () => {
  // Define state for matching products
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);

  // Event handler for search
  const handleSearch = async (term: string) => {
    // Perform search operation with term
    console.log('Searching for:', term);
    
    try {
      const firestore = getFirestore(); // Get Firestore instance

      // Array to store matching products
      const products: any[] = [];

      // Query each category collection separately
      const categories = ['shoes', 'bottoms', 'tops', 'accessories'];
      for (const category of categories) {
        const q = query(collection(firestore, category), where('name', '>=', term));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          // Extract product data
          const productData = doc.data();
          products.push(productData);
        });
      }

      setMatchingProducts(products);
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  return (
    <div className="search-page-container">
      <div className="icon-container">
        <Link to="/SearchPage" className="search-icon">
          <FaSearch />
        </Link>
        <Link to="/" className="home-icon">
          <FaHome />
        </Link>
        <FaShoppingCart className="cart-icon" />
        <FaHeart className="heart-icon" />
        <FaUser className="user-icon" />
      </div>
      <SearchBar onSearch={handleSearch} />
      {/* Render matching products here */}
      <div className="matching-products">
        {matchingProducts.map((product, index) => (
          <div key={index} className="product">
            <p>{product.name}</p>
            {/* Add more details or formatting for product display */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
