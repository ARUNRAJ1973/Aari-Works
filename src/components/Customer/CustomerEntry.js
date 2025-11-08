import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CustomerEntry.css';

const CustomerEntry = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('customerName', name);
      navigate('/customer/browse');
    }
  };

  return (
    <div className="entry-container">
      <form className="entry-form" onSubmit={handleSubmit}>
        
        {/* <div className="aari-info">
          <p>Customized Aari Embroidery Works</p>
          <p>Blouses | Kurtis | Salwars</p>
          <p>Whatsapp for details</p>
        </div>
        <div className="shop-address">
          <p>123, Main Street, Your City, 600001</p>
        </div> */}
        <div className="aari-info">
          <p>Welcome to NJ Aari Works</p>
        </div>
        
        <input
          className="entry-input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="entry-button" type="submit">Enter</button>
      </form>
    </div>
  );
};

export default CustomerEntry;