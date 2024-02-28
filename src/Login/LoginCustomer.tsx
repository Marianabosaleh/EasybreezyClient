import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer } from "../firebase";
import './style.css';

const LoginCustomer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgetPassword = () => {
    // Redirect to the Welcome folder and index.tsx
      navigate('/NeedHelpPage');
      console.error('Error in help:');
    
  };

  function login() {
    // Clear previous errors
    setError("");

    loginCustomer(email, password)
      .then(() => {
        // Redirect the user to the home page or another page upon successful login
        redirectToHomePage(); // Redirect to the homepage
      })
      .catch((errorMessage) => {
        setError(errorMessage.message); // Render the error message instead of the error object itself
      });
  }

  function redirectToHomePage() {
    // Perform redirection here
    window.location.href = '/HomePage'; 
  }

  return (
    <div className="container">
      <h2><em>Welcome back to our website!</em></h2><br /><br />

      <h2>Existing User</h2>
      <form>
    <div className="form-group">
      <label htmlFor="username" className="label">*Email</label>
      <input className='input-username' type="text" id="username" name="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
    </div>
    <br/>
    <div className="form-group">
      <label htmlFor="password" className="label">*Password:</label>
      <input className='input-password' type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    <br/>
        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
        </div>

        <a  onClick={handleForgetPassword}>
        Forget password?
        </a>
      </form>
      <br/>
      {error && <p className="error-message">{error}</p>}

      <button onClick={login} type='button' className='form-button'>
        Login
      </button>
      <br/>
      <div className="new-user">
        <h2>New User</h2>
        <Link to='/RegisterCustomer'>
          <button className="form-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginCustomer;
