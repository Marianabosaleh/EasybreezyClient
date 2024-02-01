import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Welcome from './Welcome';
import LoginCustomer from './Login/LoginCustomer';
import LoginAgent from "./Login/LoginAgent";
import RegisterAgent from './Register/registerAgent';
import RegisterCustomer from './Register/RegisterCustomer';
import HomePage from './Homepage/HomePage';


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
      </Routes>
    </Router>
  );
}

export default App;
