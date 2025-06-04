'use client';

import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { SettingsMenuProps } from '../../interfaces/settingsMenu';

const SettingsMenu = ({ onLogout, onToggleTheme, onAccountSettings }: SettingsMenuProps) => {

  // List of menu items, each containing text, icon, and onClick handler
  const menuItems = [
    {
      text: "Account Setting",
      icon: <ManageAccountsIcon />,
      onClick: () => onAccountSettings()
    },
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
