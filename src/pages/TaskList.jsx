import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../api/client';

function getErrorMessage(error) {
  const body = error.response?.data;
  const reason = body?.detail || body?.message || body?.error;

  if (typeof reason === 'string') return reason;
  if (typeof body === 'string' && body) return body;

  return error.message || 'An unexpected error occurred.';
}

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deletingIds, setDeletingIds] = useState(() => new Set());
  const [deleteErrors, setDeleteErrors] = useState({});

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const data = await getTasks();
        if (active) setTasks(data);
      } catch (error) {
        if (active) setLoadError(getErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id) {
    if (deletingIds.has(id)) return;

    setDeletingIds((current) => new Set([...current, id]));
    setDeleteErrors((current) => ({ ...current, [id]: '' }));

    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (error) {
      setDeleteErrors((current) => ({
        ...current,
        [id]: getErrorMessage(error),
      }));
    } finally {
      setDeletingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', padding: '1rem' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h1>Tasks</h1>
        <Link to="/tasks/new">Create a new task</Link>
      </header>

      {loading ? (
        <p role="status">Loading...</p>
      ) : loadError ? (
        <p role="alert" style={{ color: '#b91c1c' }}>
          Could not load tasks: {loadError}
        </p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Create your first task to get started!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => {
            const deleting = deletingIds.has(task.id);
            const taskPath = `/tasks/${encodeURIComponent(task.id)}`;

            return (
              <li
                key={task.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <h2 style={{ marginTop: 0 }}>{task.title}</h2>
                <p>
                  Status: {task.completed ? 'Completed' : 'Not completed'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <Link to={taskPath}>View details</Link>
                  <Link to={`${taskPath}/edit`}>Edit</Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    disabled={deleting}
                    aria-label={`Delete ${task.title}`}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

                {deleteErrors[task.id] && (
                  <p role="alert" style={{ color: '#b91c1c' }}>
                    Could not delete task: {deleteErrors[task.id]}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
