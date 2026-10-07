import Register from './pages/Register.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import TaskList from './pages/TaskList.jsx';
import TaskDetail from './pages/TaskDetail.jsx';
import TaskForm from './pages/TaskForm.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/tasks/new" element={<TaskForm />} />
      <Route path="/tasks/:id" element={<TaskDetail />} />
      <Route path="/tasks/:id/edit" element={<TaskForm />} />
      <Route path="/register" element={<Register />} />   
      <Route path="/" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}

export default App;
