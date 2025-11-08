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
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  font-size: 16px;
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

const DesignName = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  order: 0;
  font-size: 20px;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: space-between;
  width: 100%;
  // margin-left: 5%;
  align-items: center;
  margin-bottom: 10px;
  order: 0;
`;

const RealPrice = styled.span`
  text-decoration: line-through;
  color: #888;
  margin-right: 10px;
`;

const OfferPrice = styled.input`
  width:47%;
  margin-left: 3%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 20px;
  `;
  
  const DesignPrice = styled.input`
  width:47%;
  margin-right: 3%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 20px;
`;

const SaveButton = styled.button`
  padding: 10px 16px;
  background-color: #4caf50;
  color: white;
  font-size: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #45a049;
  }
`;

const DesignList = () => {
  const { category } = useParams();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('====================================');
  console.log("desinnnn",designs);
  console.log('====================================');

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get(`https://aari-db-json.onrender.com/designs?category=${category}`);
        setDesigns(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch designs');
        setLoading(false);
        console.error('Error fetching designs:', err);
      }
    };

    fetchDesigns();
  }, [category]);

  const handleNameChange = (id, value) => {
    setDesigns(designs.map(design => 
      design.id === id ? { ...design, name: value } : design
    ));
  };

  const handlePriceChange = (id, value) => {
    setDesigns(designs.map(design => 
      design.id === id ? { ...design, price: parseInt(value) || 0 } : design
    ));
  };

  const handleOfferPriceChange = (id, value) => {
    setDesigns(designs.map(design => 
      design.id === id ? { ...design, offerPrice: parseInt(value) || 0 } : design
    ));
  };

  const handleSave = async (design) => {
    try {
      // Update the design
      await axios.put(`https://aari-db-json.onrender.com/designs/${design.id}`, design);

      // Fetch all carts
      const cartsResponse = await axios.get('https://aari-db-json.onrender.com/carts');
      const allCarts = cartsResponse.data;

      // Update the design in each cart
      for (const cart of allCarts) {
        const updatedItems = cart.items.map(item => {
          if (item.designId === design.id) {
            return { ...item, price: design.price, offerPrice: design.offerPrice };
          }
          return item;
        });

        if (JSON.stringify(updatedItems) !== JSON.stringify(cart.items)) {
          await axios.patch(`https://aari-db-json.onrender.com/carts/${cart.id}`, { items: updatedItems });
        }
      }

      alert('Design updated successfully!');
    } catch (err) {
      alert('Failed to update design');
      console.error('Error updating design:', err);
    }
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
              <DesignName
                type="text"
                value={design.name}
                onChange={(e) => handleNameChange(design.id, e.target.value)}
              />
              <PriceContainer>
                <p style={{width:"50%",paddingLeft:"3%",fontWeight:'bold'}}>Price</p>
                <p style={{width:"50%",paddingLeft:"3%",fontWeight:'bold'}}>OfferPrice</p>
              </PriceContainer>

              <PriceContainer>
                <DesignPrice
                  type="number"
                  value={design.price}
                  onChange={(e) => handlePriceChange(design.id, e.target.value)}
                />
                <OfferPrice
                  type="number"
                  placeholder="Offer Price"
                  value={design.offerPrice || ''}
                  onChange={(e) => handleOfferPriceChange(design.id, e.target.value)}
                />
              </PriceContainer>
              <SaveButton onClick={() => handleSave(design)}>Save Changes</SaveButton>
            </DesignInfo>
          </DesignCard>
        ))}
      </Grid>
    </Container>
  );
};

export default DesignList;