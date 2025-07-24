'use client';

import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useRouter } from 'next/navigation';
import { deleteMyAccount } from '@/app/lib/myProfileService';

const DeleteAccountButton = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const success = await deleteMyAccount();
        if (success) {
            localStorage.removeItem('token');
            alert('Your account has been successfully deleted.');
            router.push('/login');
        }
    };

    return (
        <>
            <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
                Delete account
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm account deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action will permanently delete your account. Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteAccountButton;
