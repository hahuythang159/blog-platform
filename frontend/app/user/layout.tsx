'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip } from '@mui/material';

const menuItems = [
    { label: 'Activity', href: '/user/activity', icon: <HistoryIcon /> },
    { label: 'Account settings', href: '/user/account-settings', icon: <SettingsIcon /> },
];

const drawerWidth = 240;
const collapsedWidth = 60;

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: open ? drawerWidth : collapsedWidth,
                        transition: 'width 0.3s',
                        overflowX: 'hidden',
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRight: '1px solid #ddd',
                    },
                }}
            >
                <Box>
                    <Toolbar />
                    <List>
                        {menuItems.map((item) => (
                            <ListItemButton key={item.href} component={Link} href={item.href} selected={pathname === item.href}
                                sx={{ py: 1.5 }}
                            >
                                <Tooltip title={item.label} placement="right" disableHoverListener={open}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                </Tooltip>
                                {open && <ListItemText primary={item.label} />}
                            </ListItemButton>
                        ))}
                    </List>
                </Box>

                <Box>
                    <Divider />
                    <List>
                        <ListItemButton onClick={() => router.push('/posts')} sx={{ py: 1.5 }}>
                            <Tooltip title="Return to posts" placement="right" disableHoverListener={open}>
                                <ListItemIcon>
                                    <ArrowBackIcon />
                                </ListItemIcon>
                            </Tooltip>
                            {open && <ListItemText primary="Return to posts" />}
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, pl: `${collapsedWidth + 16}px`, pr: 3, py: 3, transition: 'padding-left 0.3s', }}>
                {children}
            </Box>
        </Box>
    );
}
