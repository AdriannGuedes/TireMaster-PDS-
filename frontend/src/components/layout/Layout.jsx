import React from 'react';
import Sidebar from '../sidebar/Sidebar.jsx';
import Header from '../header/Header.jsx';
import './Layout.css';
import { Outlet } from 'react-router-dom';

const Layout = ({ onLogout }) => {
  return (
    <div className="layout">
      <Header onLogout={onLogout} />
      <div className="body-container">
        <Sidebar onLogout={onLogout} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Layout;