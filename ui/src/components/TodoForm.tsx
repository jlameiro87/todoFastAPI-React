import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { Todo } from '../api';

interface TodoFormProps {
  onCreateTodo: (todo: Omit<Todo, 'id'>) => void;
}

function TodoForm({ onCreateTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTodo({ title, description, completed: false });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={2}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Todo
        </Button>
      </Box>
    </form>
  );
}

export default TodoForm;
