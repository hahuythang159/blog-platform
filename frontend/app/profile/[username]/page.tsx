'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Typography, Avatar, Box, CircularProgress, Card, CardContent, Divider, IconButton, Button } from '@mui/material';
import { fetcher } from '@/app/utils/fetcher';
import Link from 'next/link';
import { FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { Post, Profile } from '@/app/types';


const UserProfilePage = () => {

  // Get the username from the URL (dynamic route)
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);


  // Get the currently logged-in user from Redux
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const loggedInUserId = loggedInUser?.id;

  useEffect(() => {
    // Load profile and posts for the user when the component mounts or username changes
    const loadProfile = async () => {
      try {
        const [profileData, postsData] = await Promise.all([
          fetcher(`profile/${username}`),
          fetcher(`profile/${username}/posts`)
        ]);

        setProfile(profileData);
        setPosts(postsData);

        // Check if logged-in user is following this profile
        if (loggedInUserId && loggedInUser.username !== profileData.username) {
          const followRes = await fetcher(`profile/${username}/is-following?followerId=${loggedInUserId}`);

          if (!followRes) {
            throw new Error('No follow data returned');
          }

          setIsFollowing(followRes.isFollowing);
        }

      } catch (err) {
        console.error(err);
      } finally {
        // Stop loading spinner once data is loaded or an error occurs
        setLoading(false);
      }
    };
    // Only run the fetch function if username is available
    if (username) loadProfile();
  }, [username, loggedInUserId]);

  // Function to handle when user presses "Follow" or "Unfollow" button
  const handleToggleFollow = async () => {
    if (!loggedInUserId || !profile) return;
    setIsProcessing(true);

    try {
      const data = await fetcher(`follow/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerId: loggedInUserId }),
      });

      // Update tracking status
      setIsFollowing(data.following);

      //Update followers count without re-fetching everything
      setProfile((prev) => {
        if (!prev) return prev;

        const updatedFollowersCount = data.following
          ? prev.followersCount + 1
          : prev.followersCount - 1;

        return {
          ...prev,
          followersCount: updatedFollowersCount,
        };
      });

    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
  if (!profile) return <Typography>User not found</Typography>;

  return (
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      {/* Profile Info Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={profile.avatar} sx={{ width: 80, height: 80 }} />
        <Box>
          <Typography variant="h5">{profile.username}</Typography>
          <Typography variant="body2" color="text.secondary">{profile.bio || 'No bio yet'}</Typography>
        </Box>
      </Box>

      {/* Profile Stats */}
      <Box sx={{ marginTop: 3 }}>
        <Typography>👥 Followers: {profile.followersCount}</Typography>
        <Typography>➡️ Following: {profile.followingCount}</Typography>
        <Typography>📝 Posts: {profile.postCount}</Typography>
        {profile.gender && <Typography>🚻 Gender: {profile.gender}</Typography>}

        {loggedInUser && loggedInUser.username !== profile.username && (
          <Box sx={{ marginTop: 2 }}>
            <Button
              variant={isFollowing ? 'outlined' : 'contained'}
              color="primary"
              onClick={handleToggleFollow}
              disabled={isProcessing}
            >
              {isProcessing
                ? 'Processing...'
                : isFollowing
                  ? 'Unfollow'
                  : 'Follow'}
            </Button>
          </Box>
        )}
      </Box>

      {/* User Posts */}
      <Box sx={{ marginTop: 5 }}>
        <Typography variant="h6" gutterBottom>
          📝 Posts by {profile.username}
        </Typography>

        {/* Show message if user has no posts */}
        {posts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            This user has not posted anything yet.
          </Typography>
        ) : (
          // Loop through and render user's posts
          posts.map((post) => (
            <Card key={post._id} sx={{ borderRadius: 2, marginBottom: 2 }}>
              <CardContent>
                {/* Post title with link to full post */}
                <Typography
                  variant="h6"
                  component={Link}
                  href={`/posts/${post._id}`}
                  sx={{ fontWeight: 600, textDecoration: 'none', color: 'inherit' }}
                >
                  {post.title}
                </Typography>

                {/* Post content preview (limited to 100 chars) */}
                <Typography variant="body2" color="text.secondary">
                  {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>
                <IconButton><FavoriteBorder /></IconButton>
                <IconButton><ChatBubbleOutline /></IconButton>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
};

export default UserProfilePage;
