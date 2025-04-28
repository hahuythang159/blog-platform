'use client';

import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LogoutIcon from '@mui/icons-material/Logout';

interface SettingsMenuProps {
  // onLogout function passed as a prop to handle logout logic
  onLogout: () => void;
  
  // onToggleTheme function passed as a prop to toggle dark/light theme
  onToggleTheme: () => void;
}

const SettingsMenu = ({ onLogout, onToggleTheme }: SettingsMenuProps) => {

  // List of menu items, each containing text, icon, and onClick handler
  const menuItems = [
    {
      // Theme toggle menu item
      text: 'Theme',
      icon: <Brightness4Icon />,
      onClick: onToggleTheme,
    },
    {
      // Logout menu item
      text: 'Logout',
      icon: <LogoutIcon />,
      onClick: onLogout,
    },
  ];

  return (
    <List sx={{ width: 220 }}>
      {menuItems.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default SettingsMenu;
