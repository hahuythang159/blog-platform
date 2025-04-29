'use client';

import { useState } from 'react';
import { Box, Fab, Popover } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { useRouter } from 'next/navigation';
import type { PopoverOrigin } from '@mui/material';
import SettingsMenu from './SettingsMenu';
import { toggleTheme } from '../store/themeSlice';

const popoverAnchorOrigin: PopoverOrigin = { vertical: 'top', horizontal: 'left' };
const popoverTransformOrigin: PopoverOrigin = { vertical: 'bottom', horizontal: 'right' };
const fabBoxSx = { position: 'fixed', bottom: 20, right: 20, zIndex: 1300 };

const FloatingSettings = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();

    // Toggle Popover visibility when the FAB is clicked
    const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(prev => (prev ? null : event.currentTarget));
    };

    // Handle logout process: Dispatch Redux action, close Popover, and redirect to login page
    const handleLogout = () => {
        dispatch(logout());
        setAnchorEl(null);
        router.push('/login');
    };

    // Handler function for toggling the theme between light and dark modes
    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    }

    // Handler for navigating to the account settings page
    const handleAccountSettings = () => {
        setAnchorEl(null);
        router.push('/account/settings');
    }

    return (
        <>
            {/* Floating Action Button (FAB) that triggers the Popover on click */}
            <Box sx={fabBoxSx}>
                <Fab color="primary" onClick={handleToggle}>
                    <SettingsIcon />
                </Fab>
            </Box>

            {/* Popover component that appears when the FAB is clicked */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={popoverAnchorOrigin}
                transformOrigin={popoverTransformOrigin}
                sx={{ mt: 1 }}
            >
                {/* Settings Menu inside the Popover, passing the logout, toggle Theme handler as a prop */}
                <SettingsMenu
                    onLogout={handleLogout}
                    onToggleTheme={handleToggleTheme}
                    onAccountSettings={handleAccountSettings}
                />
            </Popover>
        </>
    );
};

export default FloatingSettings;
