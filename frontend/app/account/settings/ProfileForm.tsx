'use client';

import { useState } from 'react';
import { TextField, MenuItem, Button } from '@mui/material';
import AvatarPreview from './AvatarPreview';
import { updateMyProfile } from '@/app/lib/myProfileService';
import { Props } from '@/app/interfaces/props';
import { uploadUserAvatar } from '@/app/lib/avatarService';

const ProfileForm = ({ profile, setProfile }: Props) => {
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatar || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handling avatar image changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAvatarUrl(URL.createObjectURL(selectedFile));
    }
  }

  // Submit request to upload avatar and update information
  const handleUploadAvatar = async () => {
    if (file) {
      const uploadedAvatarUrl = await uploadUserAvatar(file);
      if (uploadedAvatarUrl) {
        setAvatarUrl(uploadedAvatarUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Upload avatar if available
    if (file) {
      await handleUploadAvatar();
    }

    const success = await updateMyProfile({ ...profile, avatar: avatarUrl });
    alert(success ? 'Updated successfully!' : 'Update failed.');
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Tiểu sử"
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '16px' }}
      />
      <AvatarPreview url={file ? URL.createObjectURL(file) : avatarUrl} />
      <TextField
        label="Birth day"
        name="birthday"
        type="date"
        value={profile.birthday}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Gender"
        name="gender"
        value={profile.gender}
        onChange={handleChange}
        select
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
        <MenuItem value="other">Other</MenuItem>
        <MenuItem value="prefer_not_to_say">Don't want to reveal</MenuItem>
      </TextField>
      <Button variant="contained" type="submit" fullWidth disabled={saving}>
        {saving ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
};

export default ProfileForm;
