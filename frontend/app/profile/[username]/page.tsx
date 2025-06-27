'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Container, Box, CircularProgress, Typography, Tabs, Tab } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import {
  checkUserFollowing,
  getFollowList,
  getUserProfile,
  getUserPosts,
  toggleFollowUser,
} from '@/app/lib/profileService';
import { Profile, Post } from '@/app/types';
import ProfileInfo from '@/app/components/userProfile/ProfileInfo';
import FollowStats from '@/app/components/userProfile/FollowStats';
import FollowList from '@/app/components/userProfile/FollowList';
import UserPosts from '@/app/components/userProfile/UserPosts';

const UserProfilePage = () => {

  // Get the username from the URL (dynamic route)
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tab, setTab] = useState<'followers' | 'following'>('followers');
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const avatarUrl = useMemo(() => (profile ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatar}` : ''), [profile]);

  // Get the currently logged-in user from Redux
  const loggedInUser = useSelector((state: RootState) => state.user.user);
  const loggedInUserId = loggedInUser?._id;

  useEffect(() => {
    // Load profile and posts for the user when the component mounts or username changes
    const loadProfile = async () => {
      try {
        const [profileData, postsData] = await Promise.all([
          getUserProfile(username),
          getUserPosts(username),
        ]);

        setProfile(profileData);
        setPosts(postsData);

        // Check if logged-in user is following this profile
        if (loggedInUserId && loggedInUser.username !== profileData.username) {
          const followRes = await checkUserFollowing(username, loggedInUserId);

          if (!followRes) {
            throw new Error('No follow data returned');
          }

          setIsFollowing(followRes.isFollowing);
        }
        // 👇 Preload both followers and following lists
        const [followersRes, followingRes] = await Promise.all([
          getFollowList(username, 'followers'),
          getFollowList(username, 'following'),
        ]);

        setFollowers(followersRes.followers || []);
        setFollowing(followingRes.following || []);

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
      const data = await toggleFollowUser(username, loggedInUserId);
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
      alert('Error toggling follow!');
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchFollowList = async (type: 'followers' | 'following') => {
    setLoadingList(true);
    try {
      const res = await getFollowList(username, type);
      if (type === 'followers') {
        setFollowers(res.followers || []);
      } else {
        setFollowing(res.following || []);
      }
    } catch (err: any) {
      alert('Error loading!');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!username) return;

    if (tab === 'followers' && followers.length === 0) {
      fetchFollowList('followers');
    }

    if (tab === 'following' && following.length === 0) {
      fetchFollowList('following');
    }
  }, [tab, username]);

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
  if (!profile) return <Typography>User not found</Typography>;

  return (
    <Container maxWidth="sm" sx={{ paddingY: 4 }}>
      <ProfileInfo
        profile={profile}
        isFollowing={isFollowing}
        isProcessing={isProcessing}
        onToggleFollow={handleToggleFollow}
        loggedInUser={loggedInUser}
      />

      <FollowStats profile={profile} />

      <Box sx={{ marginTop: 5 }}>
        <Typography variant="h6" gutterBottom>📋 List Follow</Typography>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="followers" label={`Follower (${followers.length})`} />
          <Tab value="following" label={`Following (${following.length})`} />
        </Tabs>

        <FollowList
          tab={tab}
          followers={followers}
          following={following}
          loadingList={loadingList}
        />
      </Box>

      <UserPosts posts={posts} username={profile.username} />
    </Container>
  );
};
export default UserProfilePage;
