import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

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
      .order('created_at', { ascending: false });
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
    <div>
      <h1>Todo List</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <input
          type="text"
          placeholder="New todo"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.is_completed ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTodo(todo.id, todo.is_completed)} style={{ cursor: 'pointer' }}>
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '1rem' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;

