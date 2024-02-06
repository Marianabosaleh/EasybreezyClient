import React from 'react';
import './style.css';
import shoes from './shoes.jpg';
import T_SHIRT from './tops.jpg';
import bottoms from './bottoms.jpg'
import accessories from './accessories.jpg'

import { FaHeart, FaUser, FaShoppingCart, FaHome, FaSearch } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const containerStyle: React.CSSProperties = { backgroundColor: '#FCEEE4' };

  const handleCategoryClick = (category: string) => {
    // Handle category click, you can navigate to a specific page or perform any other action here
    console.log(`Clicked on ${category}`);
  };

  return (
    <div className="HomePage" style={containerStyle}>
      <h1>Welcome to Our Shopping Website!</h1>
      {/* Categories */}
      <div className="categories-row">
        {/* Shoes category */}
        <div className="category-container" onClick={() => handleCategoryClick('Shoes')}>
          <img src={shoes} alt="shoes" className="category-image" />
          <p className="category-name">Shoes</p>
        </div>
        {/* Bottoms category */}
        <div className="category-container" onClick={() => handleCategoryClick('Bottoms')}>
          <img src={bottoms} alt="bottoms" className="category-image" />
          <p className="category-name">Bottoms</p>
        </div>
      </div>
      <div className="categories-row">
        {/* Accessories category */}
        <div className="category-container" onClick={() => handleCategoryClick('Accessories')}>
          <img src={accessories} alt="Accessories" className="category-image" />
          <p className="category-name">Accessories</p>
        </div>
        {/* Tops category */}
        <div className="category-container" onClick={() => handleCategoryClick('Tops')}>
          <img src={T_SHIRT} alt="tops" className="category-image" />
          <p className="category-name">Tops</p>
        </div>
      </div>

      {/* Icons */}
      <div className="icon-container">
        <FaSearch className="search-icon" />
        <FaHome className="home-icon" />
        <FaShoppingCart className="cart-icon" />
        <FaHeart className="heart-icon" />
        <FaUser className="user-icon" />
      </div>
    </div>
  );
};

export default HomePage;
