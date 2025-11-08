import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  width: 100%;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  margin-top: 10px;
  font-weight: bold;
  font-size: 16px;
  flex: 1;
  text-align: center;
  padding: 10px;
  color: #6d18ae;
  background-color: #f9e4ff;
  border: 2px solid #ddd;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.13);
  border-radius: 4px;
  transition: background-color 0.3s ease;
  
  &:hover {
    text-decoration: none;
    background-color: #e0e0e0;
  }
`;

const CartCard = styled.div`
  border: 2px solid #ddd;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.13);
  background-color: #ffffffb4;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const CartHeader = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const CartCustomer = styled.h3`
  margin: 0;
`;

const CartItems = styled.div`
  padding: 5px;
`;

const CartItem = styled.div`
    display: flex;
    align-items: center;
    // border-bottom: 3px solid #dad5d5;
    margin-bottom: 15px;
    padding: 8px

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width:50%;
  height: 150px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.span`
  display: block;
  font-weight: bold;
  font-size: 16px;
`;

const ItemPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: flex-end;
`;

const RealPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 0.9em;
  font-size: 16px;
`;

const OfferPrice = styled.span`
  font-weight: bold;
  font-size: 16px;
  color: #ff6b6b;
  margin-left: 10px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const UserCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/carts');
        setCarts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user carts');
        setLoading(false);
        console.error('Error fetching carts:', err);
      }
    };

    fetchCarts();
  }, []);

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + ((item.offerPrice || 0) * (item.quantity || 1)), 0);
  };

  if (loading) return <Container><p>Loading...</p></Container>;
  if (error) return <Container><p>{error}</p></Container>;

  return (
    <Container>
      <Title>User Carts</Title>
      
      <NavLinks>
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/carts">User Carts</NavLink>
      </NavLinks>
      
      {carts.length === 0 ? (
        <EmptyMessage>
          <h2>No user carts available</h2>
        </EmptyMessage>
      ) : (
        carts.map((cart) => (
          <CartCard key={cart.id}>
            <CartHeader>
              <CartCustomer>Customer: {cart.customerName}</CartCustomer>
            </CartHeader>
            <CartItems>
              {cart.items.map((item, index) => (
                <CartItem key={index}>
                  <ItemImage src={item.image} alt={item.name} />
                  <ItemPriceContainer>
                    <ItemName>{item.name}</ItemName>
                    <div style={{fontWeight: 'bold',display:'flex' }}>
                      <RealPrice>₹{item.price}</RealPrice>
                      <OfferPrice>₹{item.offerPrice}</OfferPrice>
                    </div>
                    {/* <div style={{fontWeight: 'bold' }}>Total: ₹{calculateTotal(cart.items)}</div> */}
                  </ItemPriceContainer>
                </CartItem>
              ))}
              <div style={{ marginTop: '15px', fontWeight: 'bold',display:'flex',justifyContent:'center',fontSize:'20px' }}>Total: ₹{calculateTotal(cart.items)}</div>
            </CartItems>
          </CartCard>
        ))
      )}
    </Container>
  );
};

export default UserCarts;