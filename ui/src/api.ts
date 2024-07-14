import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get<Todo[]>(`${API_URL}/todos/`);
  return response.data;
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await axios.post<Todo>(`${API_URL}/todos/`, todo);
  return response.data;
};

export const updateTodo = async (id: number, todo: Partial<Todo>): Promise<Todo> => {
  const response = await axios.put<Todo>(`${API_URL}/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`);
};
