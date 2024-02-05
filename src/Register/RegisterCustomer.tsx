import React from "react";
import { Link } from 'react-router-dom'; 
import "./style0.css";
import { Registercustomer } from "../firebase";

// Define the RegisterAgent functional component
const RegisterCustomer: React.FC = () => {
  // State variables to manage form input values and registration status
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function register() {
    // Pass additional fields to Registercustomer function
    Registercustomer(firstName, lastName, dateOfBirth, email, password)
      .then(() => {
        // Registration successful, you can redirect the user to another page
      })
      .catch((errorMessage) => {
        // Handle registration error
        console.error("Registration error: ", errorMessage);
      });
  }

  return (
    <div>
      <a href="/" className="Register"></a>
      
      <div id="register" className="details">
        <label htmlFor="first name">
          <b>First name *</b>
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Enter First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          name="first name"
          id="name"
          required
        />
        <label htmlFor="last name">
          <b>Last name *</b>
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Enter Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          name="last name"
          id="last name"
          required
        />
        <label htmlFor="Date of birth">
          <b>Date of birth</b>
        </label>
        <input
          type="date"
          className="input-field"
          placeholder="Enter Date of birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          name="birthday"
          id="birthday"
          required
        />
        <label htmlFor="Email address">
          <b>Email address *</b>
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="input-field"
          placeholder="Enter Email"
          name="Email"
          id="Email"
          required
        />
        <label htmlFor="Password">
          <b>Password *</b>
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="input-field"
          placeholder="Enter Password"
          name="psw"
          id="psw"
          required
        />
        {/* Uncomment this section if you want to confirm the password
        <label htmlFor="Confirm password">
          <b>Confirm password *</b>
        </label>
        <input
          type="password"
          className="input-field"
          placeholder="Repeat Password"
          name="psw-repeat"
          id="psw-repeat"
          required
        /> */}
        <button onClick={register} type="submit" className="submit-btn">
          Register
        </button>
        <p>Already have an account? <Link to='/LoginCustomer'>Login here</Link></p>
      </div>
    </div>
  );
};

export default RegisterCustomer;
