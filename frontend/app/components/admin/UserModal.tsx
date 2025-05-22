import { Modal, Box, IconButton, Typography, TextField, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserModalProps } from "@/app/interfaces/userModalProps";

const UserModal = ({ open, onClose, users, searchTerm, setSearchTerm, onToggleBan }: UserModalProps) => {
  const filteredUsers = users.filter((user) =>
    `${user.username} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "#fff",
          p: 4,
          m: "auto",
          mt: 10,
          borderRadius: 2,
          width: "90%",
          maxWidth: 900,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: 24,
          position: "relative",
        }}
      >
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>👥 User Management</Typography>

        <TextField
          label="Search users..."
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => {
              const isBanned = !!user.activeBan;
              return (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color={isBanned ? "success" : "error"}
                      variant="outlined"
                      onClick={() =>
                        onToggleBan({ userId: user._id, isBanned, username: user.username })
                      }
                    >
                      {isBanned ? "Unban" : "Ban"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default UserModal;
