import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

// Welcome Screen
import Welcome from './components/Welcome/Welcome';

// Admin Components
import Login from './components/Auth/Login';
import Dashboard from './components/Admin/Dashboard';
import DesignList from './components/Admin/DesignList';
import UserCarts from './components/Admin/UserCarts';

// Customer Components
import CustomerEntry from './components/Customer/CustomerEntry';
import Browse from './components/Customer/Browse';
import CustomerDesignList from './components/Customer/CustomerDesignList';
import Cart from './components/Customer/Cart';

// Global styles with responsive design
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: linear-gradient(7deg, #ece2fb 0%, #fff4f4 100%);
    // background: linear-gradient(7deg, #fbe2e2 0%, #ede5ff 100%);
    // background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
    min-height: 100vh;
  }
  
  /* Import theme variables */
  :root {
    --primary-color: #6a4c93;
    --primary-dark: #4a2c6a;
    --primary-light: #8a6cb3;
    --secondary-color: #f4d03f;
    --secondary-dark: #d4b035;
    --secondary-light: #f7e05f;
    --accent-color: #e74c3c;
    --bg-primary: #f8f6ff;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f0eef5;
    --text-primary: #2c3e50;
    --text-secondary: #5d6d7e;
    --text-light: #85929e;
    --border-color: #d5d8dc;
    --border-light: #e8eaf0;
    --shadow-color: rgba(106, 76, 147, 0.15);
    --shadow-dark: rgba(106, 76, 147, 0.25);
  }
  
  /* Responsive Media Queries */
  @media (max-width: 500px) {
    body {
      font-size: 14px;
    }
    h1 {
      font-size: 24px;
    }
    h2 {
      font-size: 20px;
    }
  }
  
  @media (max-width: 448px) {
    body {
      font-size: 13px;
    }
    h1 {
      font-size: 22px;
    }
    h2 {
      font-size: 18px;
    }
  }
  
  @media (max-width: 400px) {
    body {
      font-size: 12px;
    }
    h1 {
      font-size: 20px;
    }
    h2 {
      font-size: 16px;
    }
  }
  
  @media (max-width: 350px) {
    body {
      font-size: 11px;
    }
    h1 {
      font-size: 18px;
    }
    h2 {
      font-size: 15px;
    }
  }
`;

// Protected route component for admin routes
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        {/* Welcome Screen */}
        <Route path="/" element={<Welcome />} />
        
        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerEntry />} />
        <Route path="/customer/browse" element={<Browse />} />
        <Route path="/customer/designs/:category" element={<CustomerDesignList />} />
        <Route path="/customer/cart" element={<Cart />} />
        
        {/* Admin Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/designs/:category" element={
          <ProtectedRoute>
            <DesignList />
          </ProtectedRoute>
        } />
        <Route path="/admin/carts" element={
          <ProtectedRoute>
            <UserCarts />
          </ProtectedRoute>
        } />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
