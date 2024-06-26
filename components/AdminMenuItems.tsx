import React, { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography, Modal, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { MenuItem } from '@/mockData';
import { useDropzone, Accept } from 'react-dropzone';
import Image from 'next/image';

interface AdminMenuItemsProps {
  clientId: string;
  initialMenuItems: MenuItem[];
}

const AdminMenuItems: React.FC<AdminMenuItemsProps> = ({ clientId, initialMenuItems }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems || []);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const handleOpen = (item: MenuItem | null = null) => {
    setCurrentItem(item);
    setIsEditing(!!item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    let updatedMenuItems: MenuItem[];
    if (isEditing && currentItem) {
      updatedMenuItems = menuItems.map(item => (item.id === currentItem.id ? currentItem : item));
    } else if (currentItem) {
      updatedMenuItems = [...menuItems, { ...currentItem, id: Date.now() }];
    } else {
      return;
    }
    setMenuItems(updatedMenuItems);
    handleClose();

    try {
      await saveMenuItemsToServer(clientId, updatedMenuItems);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar os itens do menu.');
    }
  };

  const handleDelete = (id: number) => {
    setDeleteItemId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteItemId !== null) {
      const updatedMenuItems = menuItems.filter(item => item.id !== deleteItemId);
      setMenuItems(updatedMenuItems);
      setOpenDialog(false);
      setDeleteItemId(null);

      try {
        await saveMenuItemsToServer(clientId, updatedMenuItems);
      } catch (error) {
        console.error(error);
        alert('Erro ao salvar os itens do menu.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: name === 'price' ? parseFloat(value) : value } as MenuItem);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (currentItem) {
        setCurrentItem({ ...currentItem, image: reader.result as string });
      }
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' as unknown as Accept });

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Criar Novo Item
      </Button>
      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia component="div" sx={{ position: 'relative', height: 140 }}>
                <Image src={item.image || '/default-image.png'} alt={item.title} layout="fill" objectFit="cover" />
              </CardMedia>
              <CardContent>
                <Typography variant="h5">{item.title}</Typography>
                <Typography color="textSecondary">{item.description}</Typography>
                <Typography variant="body2">R$ {item.price.toFixed(2)}</Typography>
                <Typography variant="body2">Categoria: {item.category}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" color="secondary" onClick={() => handleOpen(item)}>
                  Alterar
                </Button>
                <Button size="small" variant="contained" color="warning" onClick={() => handleDelete(item.id)}>
                  Excluir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ maxHeight: '90vh', overflow: 'auto', padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '5%', width: 400 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Alterar Item' : 'Criar Novo Item'}
          </Typography>
          <TextField label="Título" name="title" value={currentItem?.title || ''} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Descrição" name="description" value={currentItem?.description || ''} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Preço" name="price" type="number" value={currentItem?.price || ''} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Categoria" name="category" value={currentItem?.category || ''} onChange={handleChange} fullWidth margin="normal" />
          <div {...getRootProps()} style={{ border: '1px dashed gray', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
            <input {...getInputProps()} />
            {currentItem?.image ? (
              <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                <Image src={currentItem.image as string} alt="Imagem do Item" layout="fill" objectFit="cover" />
              </Box>
            ) : (
              <p>Arraste e solte uma imagem aqui, ou clique para selecionar uma imagem</p>
            )}
          </div>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
            Salvar
          </Button>
        </Box>
      </Modal>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{"Confirmação de Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Não
          </Button>
          <Button onClick={confirmDelete} color="warning" autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const saveMenuItemsToServer = async (clientId: string, menuItems: MenuItem[]) => {
  const res = await fetch(`/api/clients/${clientId}/menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ menuItems }),
  });
  if (!res.ok) {
    throw new Error('Erro ao salvar os itens do menu.');
  }
};

export default AdminMenuItems;
