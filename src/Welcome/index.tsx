import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import logo from './logo.svg';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const Welcome: React.FC = () => {
  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1>Welcome to Your App</h1>
      
      <Stack direction="column" spacing={2}>
        <Link to="/LoginCustomer" style={{ textDecoration: 'none' }}>
          <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }}>Customer</Button>
        </Link>
        <Link to="/LoginAgent" style={{ textDecoration: 'none' }}>
          <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }}>Agent</Button>
        </Link>
      </Stack>
    </div>
  );
};

export default Welcome;
