import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaChartBar, FaPlus, FaShoppingCart, FaHistory, FaEnvelope, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (window.innerWidth > 768) setMenuAberto(false); // garante que no desktop o menu fique visível
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setMenuAberto(!menuAberto);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <>
      {/* Botão só visível no mobile */}
      {isMobile && (
        <button className="menu-toggle" onClick={toggleMenu}>
          <FaBars />
        </button>
      )}

      <aside className={`sidebar ${isMobile ? (menuAberto ? 'active' : 'hidden') : ''}`}>
        <nav>
          <ul>
            <li><Link to="/home"><FaHome /> Início</Link></li>

            <span className="menu-section">PNEUS</span>
            <li><Link to="/cadastro"><FaPlus /> Cadastrar</Link></li>
            <li><Link to="/estoque"><FaBoxOpen /> Estoque</Link></li>
            <li><Link to="/relatoriosVendas"><FaChartBar /> Relatórios</Link></li>

            <span className="menu-section">VENDAS</span>
            <li><Link to="/novaVenda"><FaShoppingCart /> Nova venda</Link></li>
            <li><Link to="/historicoVendas"><FaHistory /> Histórico de vendas</Link></li>

            <li><Link to="/historicoNotificacoes"><FaEnvelope /> Notificações</Link></li>
          </ul>
        </nav>

        <div className="sidebar-footer" onClick={handleLogout}>
          <Link to="/sair"><FaSignOutAlt /> Sair</Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;