import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const goToCustomerFlow = () => {
    navigate('/customer');
  };

  const goToAdminFlow = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to NJ Aari Works</h1>
      <p className="welcome-subtitle">Please select how you would like to continue</p>
      
      <div className="flow-options">
        <div className="flow-option" onClick={goToCustomerFlow}>
          <div className="flow-icon customer-icon">👤</div>
          <span className="flow-label">Customer</span>
        </div>
        
        <div className="flow-option" onClick={goToAdminFlow}>
          <div className="flow-icon admin-icon">👨‍💼</div>
          <span className="flow-label">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;