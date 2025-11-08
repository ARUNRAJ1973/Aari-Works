import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BrowseContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center !important;
  margin-bottom: 30px;
  
  @media (max-width: 500px) {
    // flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  color: #333;
`;

const CartButton = styled(Link)`
  padding: 5px 20px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #ff5252;
  }
`;

const CartCount = styled.span`
  background-color: white;
  color: #ff6b6b;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  @media (max-width: 448px) {
    gap: 12px;
  }
  
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 350px) {
    gap: 10px;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const CategoryName = styled.h3`
  margin: 0;
  text-align: center;
`;

const WelcomeMessage = styled.div`
  margin-bottom: 20px;
  font-size: 18px;
  color: #555;
`;

const Browse = () => {
  const [customerName, setCustomerName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const name = localStorage.getItem('customerName');
    if (!name) {
      window.location.href = '/';
    } else {
      setCustomerName(name);
    }
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);
  }, []);

  const categories = [
    { id: 'casual', name: 'Casual Designs', icon: '✨' },
    { id: 'bridal', name: 'Bridal Designs', icon: '👰' },
    { id: 'modern', name: 'Modern Designs', icon: '🌟' }
  ];

  return (
    <BrowseContainer>
      <Header>
        <Title>Aari Works</Title>
        <CartButton to="/customer/cart">
          Cart <CartCount>{cartCount}</CartCount>
        </CartButton>
      </Header>
      
      <WelcomeMessage>
        <div className="contact-info">
        <span>Call to Order: +91 99999 12345</span>
      </div>
        {/* Welcome, {customerName}! Please select a design category to browse. */}
        <div className="aari-infos">
          <p>Customized Aari Works , We undertake Aari work , Hand work Orders from Botiques and Tailer shops and do at lowest rate in Market.<span style={{fontWeight: 'bold'}}> Contact for more details</span></p>
        </div>
        <div className="shop-address">
          <p> No : 23, Main Street,Tirumangalam, Madurai, 625706</p>
        </div>
      </WelcomeMessage>
      
      <Grid>
        {categories.map((category) => (
          <CategoryCard key={category.id} to={`/customer/designs/${category.id}`}>
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
          </CategoryCard>
        ))}
      </Grid>
    </BrowseContainer>
  );
};

export default Browse;