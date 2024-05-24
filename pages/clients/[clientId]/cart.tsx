import { GetStaticProps, GetStaticPaths } from 'next';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/router';// Importe useRouter para redirecionament
import { Button, Card, CardContent, CardMedia, Typography, Container, Grid, MenuItem, Select, FormControl, Box, Snackbar, Alert, Modal, Popover, TextField } from '@mui/material'; // Import Popover e TextField
import BottomNav from '@/components/BottomNav';
import { useState } from 'react';
import { styled } from '@mui/system';
import cadastroData from '../../../data/Cadastro.json';
import { useAuth } from '@/context/AuthContext'; // Importe o contexto de autenticação
import React, { useEffect } from 'react';


const CustomCard = styled(Card)({
  minWidth: 275,
  marginBottom: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '10px',
});

const CustomButton = styled(Button)({
  marginTop: '10px',
  marginRight: '10px',
});

const StyledTypography = styled(Typography)({
  fontWeight: 'bold',
  color: '#3f51b5',
  textAlign: 'center',
  marginBottom: '20px',
});

interface Cadastro {
  Nome: string;
  CPF: string;
  Endereço: string;
  Numero: string;
  Complemento: string;
  Email: string;
  Telefone: string;
}

const Cart = ({ clientId }: { clientId: string }) => {
  const { cart, removeFromCart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
  const { isAuthenticated } = useAuth(); // Use o contexto de autenticação
  const router = useRouter(); // Use useRouter para redirecionamento
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Abrir o Modal
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // Estado para Popover
  const [cadastro, setCadastro] = useState<Cadastro>(cadastroData.Cadastro[0]);
  const [tempCadastro, setTempCadastro] = useState<Cadastro>(cadastroData.Cadastro[0]); // Estado temporário para edição

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirecionar para a tela de login se não estiver autenticado
      router.push(`/clients/${clientId}/login`);
    }
  }, [isAuthenticated, router, clientId]);
  
  
  const handleQuantityChange = (id: number, type: 'menu' | 'promotion', quantity: number) => {
    setSelectedQuantities((prev) => ({ ...prev, [`${id}-${type}`]: quantity }));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.quantity ? item.price * item.quantity : 0), 0).toFixed(2);
  };

  const handleRemove = (id: number, type: 'menu' | 'promotion') => {
    removeFromCart(id, type, selectedQuantities[`${id}-${type}`] || 1);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempCadastro(cadastro); // Copiar dados atuais para o estado temporário ao abrir o Popover
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? 'simple-popover' : undefined;

  const handleEnviarPedido = () => {
    // Lógica para enviar o pedido aqui
    console.log("Pedido enviado com sucesso!");
    setOpenModal(false); // Fechar o modal após o envio do pedido
  };

  const handleChangeCadastro = (field: string, value: string) => {
    setTempCadastro((prev) => ({ ...prev, [field]: value })); // Atualizar estado temporário
  };

  const handleSalvarCadastro = () => {
    setCadastro(tempCadastro); // Aplicar mudanças ao estado principal
    setAnchorEl(null); // Fechar o Popover
  };

  return (
    <Box sx={{ paddingBottom: '56px', paddingTop: '20px', backgroundColor: '#f5f5f5' }}>
      <Container>
        {/* Alteração - Botão Cadastro */}
        <Typography style={{ textAlign: 'right' }}>
          <Button aria-describedby={popoverId} variant="contained" color="primary" onClick={handleClick}>
            Cadastro
          </Button>
          <Popover
            id={popoverId}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ p: 2, width: '300px' }}>
              <Typography variant="body2"><strong>Nome:</strong> {tempCadastro.Nome}</Typography>
              <Typography variant="body2"><strong>CPF:</strong> {tempCadastro.CPF}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {tempCadastro.Email}</Typography>
              <TextField
                label="Telefone"
                fullWidth
                margin="normal"
                value={tempCadastro.Telefone}
                onChange={(e) => handleChangeCadastro('Telefone', e.target.value)}
              />
              <TextField
                label="Endereço"
                fullWidth
                margin="normal"
                value={tempCadastro.Endereço}
                onChange={(e) => handleChangeCadastro('Endereço', e.target.value)}
              />
              <TextField
                label="Número"
                fullWidth
                margin="normal"
                value={tempCadastro.Numero}
                onChange={(e) => handleChangeCadastro('Numero', e.target.value)}
              />
              <TextField
                label="Complemento"
                fullWidth
                margin="normal"
                value={tempCadastro.Complemento}
                onChange={(e) => handleChangeCadastro('Complemento', e.target.value)}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSalvarCadastro}
                sx={{ mt: 2 }}
              >
                Salvar
              </Button>
            </Box>
          </Popover>
        </Typography>
        
        <StyledTypography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'purple',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
          }}
        >
          Carrinho {clientId}
        </StyledTypography>

        <Typography variant="h6" gutterBottom style={{ textAlign: 'center', marginBottom: '40px' }}>
          Bem-vindo ao seu carrinho de compras! Revise seus itens e finalize sua compra.
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
                      color="warning"
                      onClick={() => handleRemove(item.id, item.type)}
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
        <Typography variant="h5" style={{ marginTop: '20px', textAlign: 'right', backgroundColor: 'white', marginBottom: '10px'}}>
          Total: R$ {calculateTotal()}
          
          <CustomButton
              size="large"
              variant="contained"
              color="secondary"
              sx={{ backgroundColor: 'purple', marginLeft: '30px' }}
              onClick={handleOpenModal}
            >
              Finalizar Pedido
            </CustomButton>
        </Typography>
        
        <BottomNav clientId={clientId} />

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Item removido com sucesso!
          </Alert>
        </Snackbar>

        {/* Modal para Finalizar Pedido */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              Finalizando Pedido
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Confirme seu endereço:

              <Box sx={{ marginBottom: '20px' }}>
                <TextField
                  label="Endereço"
                  fullWidth
                  margin="normal"
                  value={tempCadastro.Endereço}
                  onChange={(e) => handleChangeCadastro('Endereço', e.target.value)}
                />
                <TextField
                  label="Número"
                  fullWidth
                  margin="normal"
                  value={tempCadastro.Numero}
                  onChange={(e) => handleChangeCadastro('Numero', e.target.value)}
                />
                <TextField
                  label="Complemento"
                  fullWidth
                  margin="normal"
                  value={tempCadastro.Complemento}
                  onChange={(e) => handleChangeCadastro('Complemento', e.target.value)}
                />
                <TextField
                  label="Telefone"
                  fullWidth
                  margin="normal"
                  value={tempCadastro.Telefone}
                  onChange={(e) => handleChangeCadastro('Telefone', e.target.value)}
                />
              </Box>

              

            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', width: '100%' }}>
              <Button
                variant="contained"
                color="warning"
                sx={{ marginRight: '15px', width: '150px', height: '40px' }} // Margem direita para manter 30px de distância total
                onClick={handleCloseModal}
              >
                Fechar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ backgroundColor: 'purple', marginLeft: '15px', width: '150px', height: '40px' }} // Margem esquerda para manter 30px de distância total
                onClick={handleEnviarPedido}
              >
                Enviar Pedido
              </Button>
            </Box>
            
          </Box>
        </Modal>
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