import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import shoes from './shoes.jpg';
import T_SHIRT from './tops.jpg';
import bottoms from './bottoms.jpg'
import accessories from './accessories.jpg'

import { FaHeart, FaUser, FaShoppingCart, FaHome, FaSearch } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const containerStyle: React.CSSProperties = { backgroundColor: '#FCEEE4' };

  return (
    <div className="HomePage" style={containerStyle}>
      <h1>Welcome to Our Shopping Website!</h1>
      {/* Categories */}
      <div className="categories-row">
        {/* Shoes category */}
        <Link to="/ShoesPage" className="category-container">
          <img src={shoes} alt="shoes" className="category-image" />
          <p className="category-name">Shoes</p>
        </Link>
        {/* Bottoms category */}
        <Link to="/bottoms" className="category-container">
          <img src={bottoms} alt="bottoms" className="category-image" />
          <p className="category-name">Bottoms</p>
        </Link>
      </div>
      <div className="categories-row">
        {/* Accessories category */}
        <Link to="/accessories" className="category-container">
          <img src={accessories} alt="Accessories" className="category-image" />
          <p className="category-name">Accessories</p>
        </Link>
        {/* Tops category */}
        <Link to="/tops" className="category-container">
          <img src={T_SHIRT} alt="tops" className="category-image" />
          <p className="category-name">Tops</p>
        </Link>
      </div>

      {/* Icons */}
      <div className="icon-container">
        <Link to="/SearchPage">
          <FaSearch className="search-icon" />
        </Link>
        <Link to="/" className="home-icon">
          <FaHome />
        </Link>
        <FaShoppingCart className="cart-icon" />
        <FaHeart className="heart-icon" />
        <FaUser className="user-icon" />
      </div>
    </div>
  );
};

export default HomePage;
