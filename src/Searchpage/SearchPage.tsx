import React, { useState, useEffect } from 'react';
import './styleS.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Adjust the import path as per your file structure
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
  // Define state for product names
  const [productNames, setProductNames] = useState<string[]>([]);

  // Fetch product names from Firebase database
  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const firestore = getFirestore(); // Get Firestore instance
        const querySnapshot = await getDocs(collection(firestore, 'products')); // Access Firestore collection
        const names = querySnapshot.docs.map(doc => doc.data().name as string); // Extract product names
        setProductNames(names);
      } catch (error) {
        console.error('Error fetching product names:', error);
      }
    };
    fetchProductNames();
  }, []);

  // Event handler for search
  const handleSearch = (term: string) => {
    // Perform search operation with term
    console.log('Searching for:', term);
    // Implement search by prefix algorithm
    const filteredProducts = productNames.filter((name) =>
      name.toLowerCase().startsWith(term.toLowerCase())
    );
    console.log('Matching products:', filteredProducts);
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
    </div>
  );
};

export default SearchPage;
