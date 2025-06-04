'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { RequireLoginDialogProps } from '../../interfaces/requireLoginProps';

const RequireLoginDialog: React.FC<RequireLoginDialogProps> = ({
    open,
    onClose,
    title = '',
    message = '',
}) => {
    const router = useRouter();
    const handleLogin = () => {
        onClose();
        router.push('/login');
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLogin} variant="contained" color="primary">
                    Log in
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RequireLoginDialog;
