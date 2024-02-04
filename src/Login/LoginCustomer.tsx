import React from 'react';
import { Link } from 'react-router-dom'; 
import './style.css';
import {loginUser} from "../firebase"; 
//import firebase from 'firebase/compat/app';
//import 'firebase/compat/auth';
//import 'firebase/compat/firestore'; 
//import { getDatabase, get, ref, child } from 'firebase/database';
//import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginCustomer: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
function login (){
  loginUser(email, password); 

}
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
      
      <Link to= '/HomePage'>
        <button onClick={login} type='submit' className='submit-btn'>
          login 
        </button>

      </Link>
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
