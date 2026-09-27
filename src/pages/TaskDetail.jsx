import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTask, deleteTask } from '../api/client';

function getErrorMessage(error) {
  const body = error.response?.data;
  const message = body?.detail || body?.message || body?.error;

  if (typeof message === 'string') return message;
  return error.message || 'An unexpected error occurred.';
}

export default function TaskDetail() {
  const { id } = useParams();

  // Reset state when navigating between task detail pages.
  return <TaskDetailContent key={id} id={id} />;
}

function TaskDetailContent({ id }) {
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadTask() {
      try {
        const data = await getTask(id);
        if (active) setTask(data);
      } catch (error) {
        if (active) setFetchError(getErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTask();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);
    setDeleteError('');

    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  const createdAt = task?.created_at ? new Date(task.created_at) : null;
  const validDate = createdAt && !Number.isNaN(createdAt.getTime());

  return (
    <main style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem' }}>
      <Link to="/tasks">Back to tasks</Link>

      {loading ? (
        <p role="status">Loading task...</p>
      ) : fetchError ? (
        <p role="alert" style={{ color: '#b91c1c' }}>
          Could not load task: {fetchError}
        </p>
      ) : task ? (
        <article>
          <h1>{task.title}</h1>

          <h2>Description</h2>
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {task.description || 'No description provided.'}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {task.completed ? 'Completed' : 'Not completed'}
          </p>

          <p>
            <strong>Created:</strong>{' '}
            {validDate ? (
              <time dateTime={createdAt.toISOString()}>
                {createdAt.toLocaleString()}
              </time>
            ) : (
              'Unknown'
            )}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <Link to={`/tasks/${encodeURIComponent(id)}/edit`}>
              Edit task
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{ padding: '0.6rem 1rem' }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {deleteError && (
            <p role="alert" style={{ color: '#b91c1c' }}>
              Could not delete task: {deleteError}
            </p>
          )}
        </article>
      ) : (
        <p role="alert">No task was returned.</p>
      )}
    </main>
  );
}
