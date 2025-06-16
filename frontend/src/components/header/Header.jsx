import React from 'react';
import './Header.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    onLogout(); 
    navigate('/login'); 
  };

  return (
    <header className="header">
      <h1>Tire Master</h1>
      <FaSignOutAlt onClick={handleLogout} style={{ cursor: 'pointer' }} />
    </header>
  );
};

export default Header;