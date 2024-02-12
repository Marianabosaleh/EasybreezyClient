import React, { useState } from 'react';
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
        id="searchTerm" // Add an id attribute
        name="searchTerm" // Add a name attribute
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

// Define the SearchPage component
const SearchPage: React.FC = () => {
  // Define state for matching products
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);
  // Define state for selected product
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

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
          products.push({
            id: doc.id, // Include document ID
            ...productData, // Spread other fields
          });
        });
      }

      console.log('Matching Products:', products); // Log the products array
      setMatchingProducts(products);
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  // Function to handle product selection
  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
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
          <div key={index} className="product" onClick={() => handleProductSelect(product)}>
            <p>{product.name}</p>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.imageSrc} alt={product.name} />
            {/* Add more details or formatting for product display */}
          </div>
        ))}
      </div>
      {/* Render selected product details */}
      {selectedProduct && (
        <div className="selected-product">
          <h2>{selectedProduct.name}</h2>
          <p>Description: {selectedProduct.description}</p>
          <p>Price: ${selectedProduct.price}</p>
          <img src={selectedProduct.imageSrc} alt={selectedProduct.name} />
          {/* Render additional product details */}
        </div>
      )}
    </div>
  );
};

export default SearchPage;