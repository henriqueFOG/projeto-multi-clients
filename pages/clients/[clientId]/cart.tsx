import { GetStaticProps, GetStaticPaths } from 'next';
import { useCart } from '@/context/CartContext';
import { Button, Card, CardContent, CardMedia, Typography, Container, Grid, MenuItem, Select, FormControl, Box } from '@mui/material';
import BottomNav from '@/components/BottomNav';
import { useState } from 'react';
import { styled } from '@mui/system';

const CustomCard = styled(Card)({
  minWidth: 275,
  marginBottom: '20px',
});

const CustomButton = styled(Button)({
  marginTop: '10px',
  marginRight: '10px',
});

const Cart = ({ clientId }: { clientId: string }) => {
  const { cart, removeFromCart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (id: number, type: 'menu' | 'promotion', quantity: number) => {
    setSelectedQuantities((prev) => ({ ...prev, [`${id}-${type}`]: quantity }));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.quantity ? item.price * item.quantity : 0), 0).toFixed(2);
  };

  return (
    <Box sx={{ paddingBottom: '56px' }}> {/* Adicione paddingBottom */}
    <Container>
      <Typography variant="h4" gutterBottom>
        Carrinho do Cliente {clientId}
      </Typography>
      <Grid container spacing={3}>
        {cart.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={`${item.id}-${item.type}`}>
            <CustomCard>
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography color="textSecondary">
                  {item.description}
                </Typography>
                <Typography variant="body2" component="p">
                  R$ {item.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" component="p">
                  Quantidade: {item.quantity}
                </Typography>
                <Typography variant="body2" component="p">
                  Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                </Typography>
                <Typography variant="body2" component="p">
                  Categoria: {item.category}
                </Typography>
              </CardContent>
              <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CustomButton
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => removeFromCart(item.id, item.type, selectedQuantities[`${item.id}-${item.type}`] || 1)}
                  >
                    Remover
                  </CustomButton>
                  {item.quantity > 1 && (
                    <FormControl style={{ marginLeft: '10px' }}>
                      <Select
                        value={selectedQuantities[`${item.id}-${item.type}`] || 1}
                        onChange={(e) => handleQuantityChange(item.id, item.type, e.target.value as number)}
                      >
                        {Array.from({ length: item.quantity }, (_, i) => i + 1).map((qty) => (
                          <MenuItem key={qty} value={qty}>
                            {qty}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>
              </CardContent>
            </CustomCard>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Total: R$ {calculateTotal()}
      </Typography>
      <BottomNav clientId={clientId} />
    </Container>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;

  if (!params || !params.clientId) {
    console.error('ClientId não encontrado nos parâmetros');
    return {
      notFound: true,
    };
  }

  const clientId = params.clientId as string;
  const fs = require('fs');
  const path = `./data/${clientId}.json`;

  if (!fs.existsSync(path)) {
    console.error(`Arquivo JSON não encontrado: ${path}`);
    return {
      notFound: true,
    };
  }

  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  return {
    props: {
      clientId,
      initialCartItems: data.cartItems || [],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = require('fs');
  const paths = fs.readdirSync('./data').map((file: string) => ({
    params: {
      clientId: file.replace('.json', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default Cart;
