"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { getSystemStats, getTopPosts } from "../lib/admin/statsService";
import { getUserList, toggleBanStatus } from "../lib/admin/userService";
import BentoCard from "../components/admin/BentoCard";
import TopPosts from "../components/admin/TopPosts";
import UserModal from "../components/admin/UserModal";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { Stats, ToggleBanParams, User } from "../types";

export default function AdminDashboardPage() {
  const isAuthorized = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Block API calls if not authenticated
  useEffect(() => {
    if (!isAuthorized) return;

    getSystemStats().then(setStats);
    getTopPosts().then(setTopPosts);
  }, [isAuthorized]);

  const handleToggleBan = async (
    { userId, isBanned, username }: ToggleBanParams
  ) => {
    const bannedStatus = isBanned ?? false;

    if (!bannedStatus) {
      const reason = prompt(`Please enter the reason for banning user "${username}":`);
      if (!reason || reason.trim() === "") {
        alert("Ban reason is required.");
        return;
      }

      const result = await toggleBanStatus(userId, reason);
      if (result.success) {
        setUsers(prev =>
          prev.map(user =>
            user._id === userId
              ? {
                ...user,
                activeBan: { reason: result.reason! },
              }
              : user
          )
        );
      } else {
        alert("Failed to ban user.");
      }
    } else {
      const result = await toggleBanStatus(userId);
      if (result.success) {
        setUsers(prev =>
          prev.map(user =>
            user._id === userId
              ? {
                ...user,
                activeBan: undefined,
              }
              : user
          )
        );
      } else {
        alert("Failed to unban user.");
      }
    }
  };

  const handleOpenUserModal = async () => {
    const userData = await getUserList();
    setUsers(userData);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => setUserModalOpen(false);

  // ⛔ Do not render anything without verifying permissions
  if (!isAuthorized) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        🎛️ Admin Dashboard
      </Typography>

      {/* Bento Cards Section */}
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <Box width={{ xs: "100%", sm: "48%", md: "23%" }}>
          <BentoCard
            title="👥 Total Users"
            value={stats?.totalUsers || 0}
            subtitle="Click to manage users"
            gradient="linear-gradient(135deg, #42a5f5, #1e88e5)"
            onClick={handleOpenUserModal}
          />
        </Box>
        <Box width={{ xs: "100%", sm: "48%", md: "23%" }}>
          <BentoCard
            title="📝 Total Posts"
            value={stats?.totalPosts || 0}
            gradient="linear-gradient(135deg, #7e57c2, #5e35b1)"
          />
        </Box>
        <Box width={{ xs: "100%", sm: "48%", md: "23%" }}>
          <BentoCard
            title="💬 Total Comments"
            value={stats?.totalComments || 0}
            gradient="linear-gradient(135deg, #ec407a, #d81b60)"
          />
        </Box>
        <Box width={{ xs: "100%", sm: "48%", md: "23%" }}>
          <BentoCard
            title="🔥 Top Post"
            value={topPosts[0]?.title || "No Data"}
            subtitle={`Views: ${topPosts[0]?.views || 0}`}
            gradient="linear-gradient(135deg, #ffca28, #fbc02d)"
          />
        </Box>
      </Stack>

      <TopPosts posts={topPosts} />

      {/* Modal User Table */}
      <UserModal
        open={userModalOpen}
        onClose={handleCloseUserModal}
        users={users}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onToggleBan={handleToggleBan}
      />
    </Box >
  );
}
