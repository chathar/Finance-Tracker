import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, Wallet } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a]">
        {isAuthenticated && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}
        
        {/* Mobile Header */}
        {isAuthenticated && (
          <div className="lg:hidden flex items-center justify-between p-4 glass sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary-500" />
              <span className="font-bold text-white">FinTrack</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}

        <main className={`transition-all duration-300 ${isAuthenticated ? 'p-4 md:p-8 lg:ml-64' : ''}`}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/login" />} />
            <Route path="/categories" element={isAuthenticated ? <Categories /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
