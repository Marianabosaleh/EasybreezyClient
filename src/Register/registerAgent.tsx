import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerAgent } from "../firebase"; // Assuming you have a function to register agents in your firebase module
import './style0.css';

const RegisterAgent: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function register(event: React.FormEvent) {
    event.preventDefault(); // Prevent default form submission

    registerAgent(firstName, lastName, dateOfBirth, email, password, shopName, description)
      .then(() => {
        // Redirect to the login page after successful registration
        window.location.href = '/LoginAgent'; 
      })
      .catch((errorMessage) => {
        // Handle registration error
        setError(errorMessage.message || "Registration failed"); // Display error message
      });
  }

  return (
    <div>
      <a href="/" className="Register"></a>
      
      <div id="register" className="details">
        <label htmlFor="firstName">
          <b>First Name *</b>
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          name="firstName"
          id="firstName"
          required
        />
        <label htmlFor="lastName">
          <b>Last Name *</b>
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          name="lastName"
          id="lastName"
          required
        />
        <label htmlFor="dateOfBirth">
          <b>Date of Birth</b>
        </label>
        <input
          type="date"
          className="input-field"
          placeholder="Enter Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          name="dateOfBirth"
          id="dateOfBirth"
        />
        <label htmlFor="email">
          <b>Email Address *</b>
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="input-field"
          placeholder="Enter Email"
          name="email"
          id="email"
          required
        />
        <label htmlFor="password">
          <b>Password *</b>
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="input-field"
          placeholder="Enter Password"
          name="password"
          id="password"
          required
        />
        <label htmlFor="shopName">
          <b>Shop Name *</b>
        </label>
        <input
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          type="text"
          className="input-field"
          placeholder="Enter Shop Name"
          name="shopName"
          id="shopName"
          required
        />
        <label htmlFor="description">
          <b>Description *</b>
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          className="input-field"
          placeholder="Enter Description"
          name="description"
          id="description"
          required
        />
        <button onClick={register} type="submit" className="submit-btn">
          Register
        </button>
        {error && <p className="error-message">{error}</p>}
        <p>Already have an account? <Link to='/LoginAgent'>Login here</Link></p>
      </div>
    </div>
  );
};

export default RegisterAgent;
