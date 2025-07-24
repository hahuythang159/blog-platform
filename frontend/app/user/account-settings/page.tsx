'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getMyProfile } from '@/app/lib/myProfileService';
import ProfileForm from '../../components/user/ProfileForm';
import DeleteAccountButton from '../../components/user/DeleteAccountButton';
import { ProfileData } from '@/app/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import RequireLoginDialog from '@/app/components/auth/RequireLoginDialog';

const AccountSettingsPage = () => {
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    avatar: '',
    birthday: '',
    gender: 'prefer_not_to_say',
  });

  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      setShowLoginModal(true);
      setLoading(false);  // No need to fetch profile if not logged in
      return;
    }
    const fetch = async () => {
      const data = await getMyProfile();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Account Setting
      </Typography>
      <ProfileForm profile={profile} setProfile={setProfile} />
      <Box sx={{ mt: 4 }}>
        <DeleteAccountButton />
      </Box>
      <RequireLoginDialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title='Please log in'
        message='Please login to edit personal information!'
      />
    </Box>
  );
};

export default AccountSettingsPage;
