import React from 'react';
import { IoIosList } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { TbSquareRoundedPlusFilled } from 'react-icons/tb';
import { FaRectangleList } from "react-icons/fa6";
import './MyStore.css'; // Import the CSS file

const MyStore: React.FC = () => {
  const handleAddProductClick = () => {
    // Handle click for "Add Product" icon
    console.log('Add Product clicked');
  };

  const handleMyProductsClick = () => {
    // Handle click for "My Products" icon
    console.log('My Products clicked');
  };

  return (
    <div className="my-store-container">
      <h1>Welcome To Your Shop</h1>
      <div className="icon-links">
        <Link to="/ShopPage" className="add-products-link" onClick={handleAddProductClick}>
          <TbSquareRoundedPlusFilled className="icon" />
          Add Products
        </Link>
        <br />
        <br />
        <Link to="/ProductsPage" className="my-products-link" onClick={handleMyProductsClick}>
          <FaRectangleList  className="icon" />
          My Products
        </Link>
      </div>
    </div>
  );
};

export default MyStore;
