import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/login/Login.jsx';
import Home from '../pages/home/Home';
import Cadastro from '../pages/cadastroPneu/Cadastro.jsx';
import Estoque from '../pages/estoque/Estoque.jsx';
import NovaVenda from '../pages/gerarVenda/GerarVenda.jsx';
import HistoricoVendas from '../pages/historicoVendas/HistoricoVendas.jsx';
import HistoricoNotificacoes from '../pages/notificacoes/notificacoes.jsx';
import RelatoriosVendas from '../pages/relatorios/Relatorios.jsx';
import Layout from '../components/layout/Layout.jsx';

const AppRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            setIsAuthenticated(!!token);
        };
        checkAuth();

        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? <Navigate to="/home" />
                            : <Login onLogin={() => setIsAuthenticated(true)} />
                    }
                />

                {isAuthenticated && (
                    <Route path="/" element={<Layout onLogout={() => setIsAuthenticated(false)} />}>
                        <Route path="home" element={<Home />} />
                        <Route path="cadastro" element={<Cadastro />} />
                        <Route path="estoque" element={<Estoque />} />
                        <Route path="novaVenda" element={<NovaVenda />} />
                        <Route path="historicoVendas" element={<HistoricoVendas />} />
                        <Route path="historicoNotificacoes" element={<HistoricoNotificacoes />} />
                        <Route path="relatoriosVendas" element={<RelatoriosVendas />} />
                    </Route>
                )}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;