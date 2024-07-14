import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from './api';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const fetchedTodos = await getTodos();
    setTodos(fetchedTodos);
  };

  const handleCreateTodo = async (newTodo: Omit<Todo, 'id'>) => {
    const createdTodo = await createTodo(newTodo);
    setTodos([...todos, createdTodo]);
  };

  const handleUpdateTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    const updated = await updateTodo(id, updatedTodo);
    setTodos(todos.map(todo => todo.id === id ? updated : todo));
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo App
        </Typography>
        <TodoForm onCreateTodo={handleCreateTodo} />
        <TodoList
          todos={todos}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </Box>
    </Container>
  );
}

export default App;
