'use client';

import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import { useRouter } from 'next/navigation';
import { toggleTheme } from '../../store/themeSlice';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const fabBoxSx = { position: 'fixed', bottom: 20, right: 20, zIndex: 1300 };

const FloatingSettings = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Handle logout process: Dispatch Redux action and redirect to login page
    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    // Handler function for toggling the theme between light and dark modes
    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    }

    // Handler for navigating to the account settings page
    const handleAccountSettings = () => {
        router.push('/account/settings');
    }

    return (
        <>
            <Box sx={fabBoxSx}>
                <SpeedDial ariaLabel='Floating settings' icon={<SpeedDialIcon />}>
                    // @ts-expect-error tooltipTitle is deprecated but required in current MUI version
                    <SpeedDialAction icon={<ManageAccountsIcon />} tooltipTitle="Account Setting" onClick={handleAccountSettings} />
                    <SpeedDialAction icon={<Brightness4Icon />} tooltipTitle="Toggle Theme" onClick={handleToggleTheme} />
                    <SpeedDialAction icon={<LogoutIcon />} tooltipTitle="Logout" onClick={handleLogout} />
                </SpeedDial>
            </Box>
        </>
    );
};

export default FloatingSettings;
