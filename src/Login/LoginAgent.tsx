import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginAgent } from "../firebase";
import './style.css';

const LoginAgent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {
    setError("");
  
    loginAgent(email, password)
      .then(({ user, shopName }) => {
        // Redirect to the home page with shop name
        redirectToshoppage(shopName);
      })
      .catch((errorMessage) => {
        setError(errorMessage.message);
      });
  }

  function redirectToshoppage(shopName: string) {
    // Redirect the user to the home page with shop name
    window.location.href = `/ShopPage?shopName=${encodeURIComponent(shopName)}`;
  }

  return (
    <div className="container">
      <h2><em>Yay, welcome back to our website!</em></h2><br/><br/>

      <h2>Existing User</h2>
      <form>
        <div className="username">
          <label htmlFor="username">*Email</label>
          <input type="text" id="username" name="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="password">
          <label htmlFor="password">*Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
        </div>

        <Link to="#">Forget password?</Link>
      </form>

      {error && <p className="error-message">{error}</p>}

      <button onClick={login} type='button' className='form-button'>
        Login
      </button>

      <div className="new-user">
        <h2>New User</h2>
        <Link to='/RegisterAgent'>
          <button className="form-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginAgent;
