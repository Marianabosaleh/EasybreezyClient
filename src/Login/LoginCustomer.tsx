import React from 'react';
import { Link } from 'react-router-dom'; 
import './style.css';

const LoginCustomer: React.FC = () => {
  return (
    <div className="container">
      <h2><em>Yay, welcome back to our website!</em></h2><br/><br/>

      <h2>Existing User</h2>
      <form>
        
        <div className="username">
          <label htmlFor="username">*Email</label>
          <p><input type="text" id="username" name="username" required /></p>
        </div>

        <div className="password">
          <label htmlFor="password">*Password:</label>
          <p><input type="password" id="password" name="password" /></p>
        </div>

        <div className="remember-me">
          <p><input type="checkbox" id="remember"/></p>
          <label htmlFor="remember">Remember me</label>
        </div>
        
        <a href="#">Forget password?<br/><br/></a>

        <button type="submit" className="form-button">Login</button><br/><br/>
      </form>

      <p>
        <h2>New User</h2>
        <Link to='/RegisterCustomer'> 
          <button className="form-button">Register</button>
        </Link>
        <br/><br/>
      </p>
    </div>
  );
};

export default LoginCustomer;
