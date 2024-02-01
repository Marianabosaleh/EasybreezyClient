import React from 'react';
import './style0.css'; 
//customer
const RegisterCustomer: React.FC = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Register</title>
      </head>
      <body>
        <header>
          <a href="/" className="Register">
          </a>
          <a id="register" className="details">
            <label htmlFor="first name">
              <b>First name *</b>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter First name"
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
              name="birthday"
              id="birthday"
              required
            />
            <label htmlFor="Email address">
              <b>Email address *</b>
            </label>
            <input
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
              type="password"
              className="input-field"
              placeholder="Enter Password"
              name="psw"
              id="psw"
              required
            />
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
            />
            <button type="submit" className="submit-btn">
              Register
            </button>
          </a>
        </header>
      </body>
    </html>
  );
};

export default RegisterCustomer;
