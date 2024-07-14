import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Todo } from '../api';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (id: number, todo: Partial<Todo>) => void;
  onDeleteTodo: (id: number) => void;
}

function TodoList({ todos, onUpdateTodo, onDeleteTodo }: TodoListProps) {
  return (
    <List>
      {todos.map((todo) => (
        <ListItem key={todo.id}>
          <Checkbox
            checked={todo.completed}
            onChange={() => onUpdateTodo(todo.id, { ...todo, completed: !todo.completed })}
          />
          <ListItemText primary={todo.title} secondary={todo.description} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default TodoList;
