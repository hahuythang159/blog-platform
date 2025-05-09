'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getProfile } from '@/app/lib/profileService';
import ProfileForm from './ProfileForm';
import { ProfileData } from '@/app/interfaces/profileData';
import DeleteAccountButton from './DeleteAccountButton';

const AccountSettingsPage = () => {
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    avatar: '',
    birthday: '',
    gender: 'prefer_not_to_say',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProfile();
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
    </Box>
  );
};

export default AccountSettingsPage;
