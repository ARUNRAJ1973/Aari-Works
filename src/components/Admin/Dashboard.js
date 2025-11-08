import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: #f44336;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 448px) {
    gap: 15px;
  }
  
  @media (max-width: 400px) {
    gap: 10px;
  }
  
  @media (max-width: 350px) {
    gap: 8px;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f5f5f5;
  margin-top: 10px;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  border: 2px solid #ddd;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.13);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const CategoryName = styled.h3`
  margin: 0;
  text-align: center;
  font-size: 20px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #6d18ae;
  background-color: #f9e4ff;
  border: 2px solid #ddd;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.13);
  font-weight: bold;
  flex: 1;
  text-align: center;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  
  &:hover {
    text-decoration: none;
    background-color: #e0e0e0;
  }
`;

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const categories = [
    { id: 'casual', name: 'casual Designs', icon: '✨' },
    { id: 'modern', name: 'Modern Designs', icon: '🌟' },
    { id: 'bridal', name: 'Bridal Designs', icon: '👰' },
  ];

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      
      <NavLinks>
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/carts">User Carts</NavLink>
      </NavLinks>
      
      <h2>Design Categories</h2>
      <Grid>
        {categories.map((category) => (
          <CategoryCard key={category.id} to={`/admin/designs/${category.id}`}>
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
          </CategoryCard>
        ))}
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;