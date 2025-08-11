import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, 
  Checkbox, IconButton, ButtonGroup 
} from '@mui/material';
import { Delete as DeleteIcon, Logout as LogoutIcon } from '@mui/icons-material';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false });
    if (error) console.error('Error fetching todos:', error);
    else setTodos(data || []);
  };

  const addTodo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || task.trim().length === 0) return;
    const { error } = await supabase.from('todos').insert({ task, user_id: user.id });
    if (error) console.error('Error adding todo:', error);
    else {
      setTask('');
      getTodos();
    }
  };

  const toggleTodo = async (id, is_completed) => {
    const { error } = await supabase.from('todos').update({ is_completed: !is_completed }).match({ id });
    if (error) console.error('Error toggling todo:', error);
    else getTodos();
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().match({ id });
    if (error) console.error('Error deleting todo:', error);
    else getTodos();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const filteredTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.is_completed);
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.is_completed);
    }
    return todos;
  }, [todos, filter]);

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="h1" variant="h4">
          Todo List
        </Typography>
        <IconButton onClick={handleLogout} aria-label="logout">
          <LogoutIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 2, display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="New todo"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <Button onClick={addTodo} variant="contained" color="primary" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
          Add Todo
        </Button>
      </Box>
      <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ButtonGroup variant="outlined" aria-label="filter-buttons">
          <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'contained' : 'outlined'}>All</Button>
          <Button onClick={() => setFilter('active')} variant={filter === 'active' ? 'contained' : 'outlined'}>Active</Button>
          <Button onClick={() => setFilter('completed')} variant={filter === 'completed' ? 'contained' : 'outlined'}>Completed</Button>
        </ButtonGroup>
      </Box>
      <List>
        {filteredTodos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
          >
            <Checkbox
              edge="start"
              checked={todo.is_completed}
              tabIndex={-1}
              disableRipple
              onChange={() => toggleTodo(todo.id, todo.is_completed)}
            />
            <ListItemText 
              primary={todo.task} 
              style={{ textDecoration: todo.is_completed ? 'line-through' : 'none', cursor: 'pointer' }}
              onClick={() => toggleTodo(todo.id, todo.is_completed)}
            />

          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TodoPage;          