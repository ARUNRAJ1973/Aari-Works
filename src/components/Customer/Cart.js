import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CartContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 500px) {
    // flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #0b7dda;
  }
`;

const CartItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CartItem = styled.div`
  display: flex;
  border: 3px solid #c8c6c6ff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.13);
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const ItemImage = styled.img`
  width: 120px;
  aspect-ratio: 1;
  object-fit: cover;
  
  @media (max-width: 500px) {
    width: 100%;
    // aspect-ratio: 1;
    height: 300px;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 20px;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content:space-between;
  gap: 10px;
  align-items: center;
  margin: 0 0 10px 0;
`;

const RealPrice = styled.p`
  margin: 0;
  text-decoration: line-through;
  color: #8c8b8bff;
  font-size: 20px;
`;

const OfferPrice = styled.p`
  margin-left: 10px;
  font-weight: bold;
  color: #1b7906ff;
  font-size: 20px;
`;

const RemoveButton = styled.button`
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
  margin-top: auto;
  font-size: 20px;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const TotalSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 500px) {
    // flex-direction: column;
    gap: 15px;
  }
`;

const TotalText = styled.h2`
  margin: 0;
`;

const CheckoutButton = styled.button`
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');

  console.log('====================================');
  console.log("cartItems....",cartItems);
  console.log('====================================');
  useEffect(() => {
    const name = localStorage.getItem('customerName');
    if (!name) {
      window.location.href = '/';
    } else {
      setCustomerName(name);
      const fetchCart = async () => {
        try {
          const response = await axios.get(`https://aari-db-json.onrender.com/carts?customerName=${name}`);
          if (response.data.length > 0) {
            setCartItems(response.data[0].items);
            localStorage.setItem('cart', JSON.stringify(response.data[0].items));
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      };
      fetchCart();
    }
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update cart in server
    const updateCartInServer = async () => {
      try {
        const existingCarts = await axios.get(`https://aari-db-json.onrender.com/carts?customerName=${customerName}`);
        
        if (existingCarts.data.length > 0) {
          const cartId = existingCarts.data[0].id;
          await axios.patch(`https://aari-db-json.onrender.com/carts/${cartId}`, {
            items: updatedCart.map(item => ({
              designId: item.id,
              name: item.name,
              price: item.price,
              offerPrice: item.offerPrice,
              image: item.image,
              quantity: 1
            }))
          });
        }
      } catch (err) {
        console.error('Error updating cart:', err);
      }
    };
    
    updateCartInServer();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.offerPrice || 0), 0);
  };

  const handleCheckout = () => {
    alert('Thank you for your order! We will contact you soon.');
    localStorage.removeItem('cart');
    setCartItems([]);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <CartContainer>
      <Header>
        <h1>Your Cart</h1>
        <BackButton onClick={goBack}>Back to Shop</BackButton>
      </Header>

      {cartItems.length === 0 ? (
        <EmptyCart>
          <h2>Your cart is empty</h2>
          <p>Add some designs to get started!</p>
        </EmptyCart>
      ) : (
        <CartItemsContainer>
          {cartItems.map(item => (
            <CartItem key={item.id}>
              <ItemImage src={item.image} alt={item.name} />
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <PriceContainer>
                  <div style={{display:'flex',flexDirection:"row"}}>
                  <RealPrice>₹{item.price}</RealPrice>
                  <OfferPrice>₹{item.offerPrice}</OfferPrice>
                  </div>
                <RemoveButton onClick={() => removeFromCart(item.id)}>Remove</RemoveButton>
                </PriceContainer>
              </ItemDetails>
            </CartItem>
          ))}
        </CartItemsContainer>
      )}

      {/* {cartItems.length > 0 && (
        <TotalSection>
          <TotalText>Total: ₹{calculateTotal()}</TotalText>
          <CheckoutButton onClick={handleCheckout}>Proceed to Checkout</CheckoutButton>
        </TotalSection>
      )} */}
    </CartContainer>
  );
};

export default Cart;