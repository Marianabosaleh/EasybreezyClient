import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Welcome from './Welcome';
import LoginCustomer from './Login/LoginCustomer';
import LoginAgent from "./Login/LoginAgent";
import RegisterAgent from './Register/registerAgent';
import RegisterCustomer from './Register/RegisterCustomer';
import HomePage from './Homepage/HomePage';
import ShoesPage from "./Categories/shoes";
import CartPage from "./Cart/CartPage";
import FavoritesPage from "./favorites/FavoritesPage";
function App() {
  return (
    <Router>
      <div className="App">
      </div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/LoginCustomer" element={<LoginCustomer />} />
        <Route path="/LoginAgent" element={<LoginAgent />} />
        <Route path="/RegisterAgent" element={<RegisterAgent />} />
        <Route path="/RegisterCustomer" element={<RegisterCustomer />} />
        <Route path="/HomePage" element={<HomePage/>} />
        <Route path="/ShoesPage" element={<ShoesPage/>} />
        <Route path="/CartPage" element={<CartPage/>} />
        <Route path="/FavoritesPage" element={<FavoritesPage />} /> 

      </Routes>
    </Router>
  );
}

export default App;
