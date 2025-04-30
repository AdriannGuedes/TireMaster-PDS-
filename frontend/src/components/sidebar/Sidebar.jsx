import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaChartBar, FaPlus, FaShoppingCart, FaHistory, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    if (onLogout) onLogout();
    navigate('/');
  };
  
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/home
          "><FaHome /> Início</Link></li>

          <span className="menu-section">PNEUS</span>
          <li><Link to="/cadastro"><FaPlus /> Cadastrar</Link></li>
          <li><Link to="/estoque"><FaBoxOpen /> Estoque</Link></li>
          <li><Link to="/relatorios"><FaChartBar /> Relatórios</Link></li>

          <span className="menu-section">VENDAS</span>
          <li><Link to="/nova-venda"><FaShoppingCart /> Nova venda</Link></li>
          <li><Link to="/historico"><FaHistory /> Histórico de vendas</Link></li>

          <li><Link to="/notificacoes"><FaEnvelope /> Notificações</Link></li>
        </ul>
      </nav>

      <div className="sidebar-footer" onClick={handleLogout}>
        <Link to="/sair"><FaSignOutAlt /> Sair</Link>
      </div>
    </aside>
  );
};

export default Sidebar;