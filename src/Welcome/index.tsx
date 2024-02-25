import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import logo from './logo.svg';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// a common style for both buttons
const buttonStyle = { height: '40px', width: '100px', backgroundColor: 'black', color: 'white' };

const Welcome: React.FC = () => {
  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="logo" />
      <Stack direction="column" spacing={3}>
        <Link to="/LoginCustomer">
          <Button variant="contained" style={buttonStyle}>Customer</Button>
        </Link>
        <Link to="/LoginAgent" >
          <Button variant="contained" style={buttonStyle}>Agent</Button>
        </Link>
      </Stack>
    </div>
  );
};

export default Welcome;
