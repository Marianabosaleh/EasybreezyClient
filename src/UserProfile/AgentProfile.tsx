import React, { useEffect, useState } from "react";
import { IoList, IoHelpCircleOutline } from 'react-icons/io5';
import { ImProfile } from 'react-icons/im';
import { BsBoxArrowLeft } from "react-icons/bs";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { MdOutlineStorefront } from "react-icons/md";
import './profileC.css';
import IconNav from "../components/iconNav";

const AgentProfilePage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    alert('Signed out successfully!');
    signOut(auth).then(() => {
      // Redirect to the Welcome folder and index.tsx
      navigate('/Welcome/index');
    }).catch((error) => {
      console.error('Error signing out:', error.message);
    });
  };

  const handleSignOutClick = () => {
    handleSignOut();
  };

  const getFirstName = () => {
    if (user && user.displayName) {
      return user.displayName.split(" ")[0];
    }
    return 'Guest';
  };

  const goToHomePage = () => {
    window.location.href = '/HomePage';
  };

  return (
    <div>
      <h3>Hello, {getFirstName()}</h3>
      <div className="main-container">
        <div className="left-nav">
        <Link to="/AgentOrders">
            <IoList style={{ marginRight: '8px' }} /> My Orders
          </Link>
          <Link to="/agentdetails">
            <ImProfile style={{ marginRight: '8px' }} /> My Details
          </Link>
          <Link to= "/helpAgent">
            <IoHelpCircleOutline style={{ marginRight: '8px' }} />Need Help
          </Link>
          <Link to= "/ShopPage">
            <MdOutlineStorefront /> My Store
          </Link>
       
          <Link to ='./LoginAgent'>
            <BsBoxArrowLeft style={{ marginRight: '8px' }} /> Sign Out
          </Link>
          <FaHome onClick={goToHomePage} style={{ cursor: 'pointer' }} />
          <IconNav/>
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;