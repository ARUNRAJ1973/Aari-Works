import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
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
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0b7dda;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

const DesignCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const DesignImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const DesignInfo = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const DesignName = styled.h3`
  margin: 0 0 10px 0;
  order: 1;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  order: 2;
`;

const RealPrice = styled.span`
  text-decoration: line-through;
  color: #8c8b8bff;
  margin-right: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const OfferPrice = styled.span`
  font-weight: bold;
  color: #008300ff;
  font-size: 20px;
`;

const AddToCartButton = styled.button`
  padding: 8px 16px;
  background-color: #4caf50;
  font-size: 20px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  order: 3;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #999494ff;
    cursor: not-allowed;
  }
`;

const CustomerDesignList = () => {
  const { category } = useParams();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/designs?category=${category}`);
        setDesigns(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch designs');
        setLoading(false);
        console.error('Error fetching designs:', err);
      }
    };

    fetchDesigns();
    
    // Initialize addedToCart state from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartMap = {};
    cart.forEach(item => {
      cartMap[item.id] = true;
    });
    setAddedToCart(cartMap);
  }, [category]);

  const addToCart = (design) => {
    const customerName = localStorage.getItem('customerName');
    if (!customerName) {
      alert('Please enter your name first');
      window.location.href = '/';
      return;
    }

    // Add to local storage cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({
      id: design.id,
      name: design.name,
      price: design.price,
      offerPrice: design.offerPrice, // Ensure offerPrice is included
      image: design.image,
      category: design.category
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update addedToCart state
    setAddedToCart({
      ...addedToCart,
      [design.id]: true
    });
    
    // Update cart in server
    const saveCartToServer = async () => {
      try {
        const existingCarts = await axios.get(`http://localhost:3001/carts?customerName=${customerName}`);
        
        if (existingCarts.data.length > 0) {
          // Update existing cart
          const cartId = existingCarts.data[0].id;
          await axios.patch(`http://localhost:3001/carts/${cartId}`, {
            items: cart.map(item => ({
              designId: item.id,
              name: item.name,
              price: item.price,
              offerPrice: item.offerPrice,
              image: item.image,
              quantity: 1
            }))
          });
        } else {
          // Create new cart
          await axios.post('http://localhost:3001/carts', {
            customerName,
            items: cart.map(item => ({
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
        console.error('Error saving cart:', err);
      }
    };
    
    saveCartToServer();
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) return <Container><p>Loading...</p></Container>;
  if (error) return <Container><p>{error}</p></Container>;

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <Container>
      <Header>
        <h1>{categoryName} Designs</h1>
        <BackButton onClick={goBack}>Back to Home</BackButton>
      </Header>
      
      <Grid>
        {designs.map((design) => (
          <DesignCard key={design.id}>
            <DesignImage src={design.image} alt={design.name} />
            <DesignInfo>
              <DesignName>{design.name}</DesignName>
              <PriceContainer>
                <RealPrice>₹{design.price}</RealPrice>
                <OfferPrice>₹{design.offerPrice}</OfferPrice>
              </PriceContainer>
              <AddToCartButton 
                onClick={() => addToCart(design)}
                disabled={addedToCart[design.id]}
              >
                {addedToCart[design.id] ? 'Added to Cart' : 'Add to Cart'}
              </AddToCartButton>
            </DesignInfo>
          </DesignCard>
        ))}
      </Grid>
    </Container>
  );
};

export default CustomerDesignList;