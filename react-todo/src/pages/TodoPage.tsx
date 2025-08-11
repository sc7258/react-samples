import { useState, useEffect, useMemo, SyntheticEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Container, Box, Typography, TextField, Button, List, ListItem, 
  Checkbox, IconButton, ButtonGroup, ListItemText, Snackbar, Alert, CircularProgress, AlertColor
} from '@mui/material';
import { Delete as DeleteIcon, PlaylistAddCheck as PlaylistAddCheckIcon, Save as SaveIcon } from '@mui/icons-material';

interface Todo {
  id: number;
  task: string;
  is_completed: boolean;
  inserted_at: string;
  user_id: string;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [loading, setLoading] = useState(true);

  // Editing state
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success'); // 'success' | 'error' | 'info' | 'warning'

  useEffect(() => {
    getTodos();
  }, []);

  const showSnackbar = (message: string, severity: AlertColor = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false });
    if (error) {
      showSnackbar('Error fetching todos: ' + error.message, 'error');
    } else {
      setTodos(data as Todo[] || []);
    }
    setLoading(false);
  };

  const addTodo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || task.trim().length === 0) return;
    const { error } = await supabase.from('todos').insert({ task, user_id: user.id });
    if (error) {
      showSnackbar('Error adding todo: ' + error.message, 'error');
    } else {
      setTask('');
      getTodos();
      showSnackbar('Todo added successfully!', 'success');
    }
  };

  const toggleTodo = async (id: number, is_completed: boolean) => {
    const { error } = await supabase.from('todos').update({ is_completed: !is_completed }).match({ id });
    if (error) {
      showSnackbar('Error toggling todo: ' + error.message, 'error');
    } else {
      getTodos();
      showSnackbar('Todo status updated!', 'info');
    }
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from('todos').delete().match({ id });
    if (error) {
      showSnackbar('Error deleting todo: ' + error.message, 'error');
    } else {
      getTodos();
      showSnackbar('Todo deleted successfully!', 'success');
    }
  };

  const handleEditStart = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTaskText(todo.task);
  };

  const handleEditCancel = () => {
    setEditingTodoId(null);
    setEditingTaskText('');
  };

  const handleUpdateTask = async (todoId: number) => {
    if (editingTaskText.trim().length === 0) {
      showSnackbar('Task cannot be empty', 'error');
      return;
    }
    const { error } = await supabase.from('todos').update({ task: editingTaskText }).match({ id: todoId });
    if (error) {
      showSnackbar('Error updating task: ' + error.message, 'error');
    } else {
      getTodos();
      showSnackbar('Task updated successfully!', 'success');
    }
    handleEditCancel();
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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredTodos.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, color: 'text.secondary' }}>
              <PlaylistAddCheckIcon sx={{ fontSize: 60 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                할 일이 없습니다. 새로운 할 일을 추가해보세요!
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {filteredTodos.map((todo) => (
                <ListItem
                  key={todo.id}
                  secondaryAction={
                    editingTodoId === todo.id ? (
                      <IconButton edge="end" aria-label="save" onClick={() => handleUpdateTask(todo.id)}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                  disablePadding
                >
                  <Checkbox
                    edge="start"
                    checked={todo.is_completed}
                    tabIndex={-1}
                    disableRipple
                    onChange={() => toggleTodo(todo.id, todo.is_completed)}
                    disabled={editingTodoId === todo.id}
                  />
                  {editingTodoId === todo.id ? (
                    <TextField
                      variant="standard"
                      fullWidth
                      value={editingTaskText}
                      onChange={(e) => setEditingTaskText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateTask(todo.id)}
                      onBlur={handleEditCancel} // Cancel on blur for better UX
                      autoFocus
                      sx={{ mx: 1 }}
                    />
                  ) : (
                    <ListItemText 
                      primary={todo.task} 
                      style={{ textDecoration: todo.is_completed ? 'line-through' : 'none'}}
                      onClick={() => handleEditStart(todo)}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TodoPage;