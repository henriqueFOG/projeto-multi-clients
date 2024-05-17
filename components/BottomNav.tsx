import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';

interface BottomNavProps {
  clientId: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ clientId }) => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(`/clients/${clientId}/${route}`);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} onClick={() => handleNavigation('home')} />
        <BottomNavigationAction label="Cardápio" icon={<RestaurantMenuIcon />} onClick={() => handleNavigation('menu')} />
        <BottomNavigationAction label="Promoções" icon={<LocalOfferIcon />} onClick={() => handleNavigation('promotion')} />
        <BottomNavigationAction label="Carrinho" icon={<ShoppingCartIcon />} onClick={() => handleNavigation('cart')} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;