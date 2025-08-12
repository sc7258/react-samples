
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Typography, List, ListItem, ListItemText, Paper, TextField, Button, Box, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Todo {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  inserted_at: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!id) return;
    const { data: todosData, error: todosError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', id)
      .order('inserted_at', { ascending: false });

    if (todosError) {
      setError(todosError.message);
    } else {
      setTodos(todosData || []);
    }
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(id);
      if (userError) {
        setError(userError.message);
      } else if (userData) {
        setUserEmail(userData.user.email || 'Unknown User');
      }

      await fetchTodos();
      setLoading(false);
    };

    fetchUserData();
  }, [id, fetchTodos]);

  const handleCreateTodo = async () => {
    if (!id || !newTask.trim()) return;

    const { error } = await supabase.from('todos').insert([{ user_id: id, task: newTask.trim() }]);
    if (error) {
      setError(error.message);
    } else {
      setNewTask('');
      await fetchTodos();
    }
  };

  const handleToggleComplete = async (todoId: number, currentStatus: boolean) => {
    const { error } = await supabase.from('todos').update({ is_complete: !currentStatus }).eq('id', todoId);
    if (error) {
      setError(error.message);
    } else {
      await fetchTodos();
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    const { error } = await supabase.from('todos').delete().eq('id', todoId);
    if (error) {
      setError(error.message);
    } else {
      await fetchTodos();
    }
  };


  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Todos for {userEmail}
      </Typography>

      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          label="New Todo"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
        />
        <Button onClick={handleCreateTodo} variant="contained" sx={{ ml: 1 }}>
          Add
        </Button>
      </Box>

      <List>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <ListItem 
              key={todo.id} 
              divider
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Checkbox 
                edge="start"
                checked={todo.is_complete}
                onChange={() => handleToggleComplete(todo.id, todo.is_complete)}
              />
              <ListItemText 
                primary={todo.task} 
                style={{ textDecoration: todo.is_complete ? 'line-through' : 'none' }}
              />
            </ListItem>
          ))
        ) : (
          <Typography>No todos found for this user.</Typography>
        )}
      </List>
    </Paper>
  );
};

export default UserDetail;
