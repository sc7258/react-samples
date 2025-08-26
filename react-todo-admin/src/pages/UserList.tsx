import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const UserList: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-users');
      if (error) throw error;
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: selectedUserId },
      });
      if (error) throw error;
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    handleClose();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'created_at', headerName: 'Created At', width: 250 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id as string)}
        />,
      ],
    },
  ];

  return (
    <Paper sx={{ p: 2,
      '& .MuiDataGrid-root': {
        border: 'none',
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '1px solid #e0e0e0',
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
      },
     }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create User
        </Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
        />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserList;