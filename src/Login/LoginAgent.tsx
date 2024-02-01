import React from 'react';
import { Link } from 'react-router-dom'; 
//import firebase from '../firebase.js';
import './style.css';

const LoginAgent: React.FC = () => {
  // const handleGoogleSignIn = async () => {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   try {
  //     await firebase.auth().signInWithPopup(provider);
  //     // Sign-in successful, handle user authentication
  //   } catch (error) {
  //     console.error('Google Sign-In Error:', error);
  //   }
  // };

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

        {/* Add Google Sign-In button
        <button className="form-button" onClick={handleGoogleSignIn}>Sign in with Google</button><br/><br/> */}
      </form>

      <p>
        <h2>New User</h2>
        <Link to='/RegisterAgent'> 
          <button className="form-button">Register</button>
        </Link>
        <br/><br/>
      </p>
    </div>
  );
};

export default LoginAgent;
