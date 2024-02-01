import React from 'react';
import './style.css';
import shoes from './shoes.svg';
import T_SHIRT from './T-SHIRT.svg';



import { FaHeart, FaUser, FaShoppingCart, FaHome, FaSearch } from 'react-icons/fa';


const HomePage: React.FC = () => {
  const containerStyle: React.CSSProperties = { backgroundColor: '#FCEEE4' };

  return (
    <div className="HomePage" style={containerStyle}>
      <h1>Welcome to Our Shopping Website!</h1>
      <img src={shoes} alt="shoes" className = "shoes" />
      <img src={T_SHIRT} alt="shoes" className = "T-SHIRT" />

   

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
