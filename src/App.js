import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Welcome from './Welcome';
import LoginCustomer from './Login/LoginCustomer';
import LoginAgent from "./Login/LoginAgent";
import RegisterAgent from './Register/registerAgent';
import RegisterCustomer from './Register/RegisterCustomer';
import HomePage from './Homepage/HomePage';
import ShoePage from "./Categories/shoes/shoepage";
import BottomsPage from "./Categories/bottoms/bottomspage";
import TopsPage from "./Categories/tops/toppage";
import AccessoriesPage from "./Categories/Accessories/Accessoriespage";
import CartPage from "./Cart/CartPage";
import FavoritesPage from "./favorites/FavoritesPage";
import SearchPage from "./Searchpage/SearchPage";
import AddProductForm from './Categories/index';


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
        <Route path="/ShoePage" element={<ShoePage/>} />
        <Route path="/BottomsPage" element={<BottomsPage/>} />
        <Route path="/TopsPage" element={<TopsPage/>} />
        <Route path="/AccessoriesPage" element={<AccessoriesPage/>} />
        <Route path="/CartPage" element={<CartPage/>} />
        <Route path="/FavoritesPage" element={<FavoritesPage/>} />
        <Route path="/SearchPage" element={<SearchPage/>}/>
        <Route path="/AddProductForm" element={<AddProductForm/>}/>

      </Routes>
    </Router>
  );
}

export default App;
