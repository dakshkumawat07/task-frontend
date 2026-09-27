import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.assign('/login');
    }

    return Promise.reject(error);
  },
);

/**
 * Log in and persist the access token.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{access: string, refresh: string}>}
 */
export async function login(username, password) {
  const { data } = await api.post('auth/login/', { username, password });
  const { access, refresh } = data;

  localStorage.setItem('access_token', access);
  return { access, refresh };
}

/**
 * Register a new user.
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns {Promise<unknown>} Registration response.
 */
export async function register(username, password, email) {
  const { data } = await api.post('auth/register/', {
    username,
    password,
    email,
  });
  return data;
}

/**
 * Fetch all tasks.
 * @returns {Promise<Array<object>>} Task list.
 */
export async function getTasks() {
  const { data } = await api.get('tasks/');
  return data;
}

/**
 * Fetch a single task.
 * @param {number|string} id
 * @returns {Promise<object>} Task.
 */
export async function getTask(id) {
  const { data } = await api.get(`tasks/${encodeURIComponent(id)}/`);
  return data;
}

/**
 * Create a task.
 * @param {{title: string, description: string}} data
 * @returns {Promise<object>} Created task.
 */
export async function createTask(data) {
  const response = await api.post('tasks/', data);
  return response.data;
}

/**
 * Replace a task.
 * @param {number|string} id
 * @param {{title: string, description: string}} data
 * @returns {Promise<object>} Updated task.
 */
export async function updateTask(id, data) {
  const response = await api.put(`tasks/${encodeURIComponent(id)}/`, data);
  return response.data;
}

/**
 * Delete a task.
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  await api.delete(`tasks/${encodeURIComponent(id)}/`);
}
