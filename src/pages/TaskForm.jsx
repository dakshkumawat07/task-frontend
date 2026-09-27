import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTask, createTask, updateTask } from '../api/client';

function getErrorMessage(error) {
  const body = error.response?.data;
  const message = body?.detail || body?.message;

  if (typeof message === 'string') return message;

  if (body && typeof body === 'object') {
    const messages = Object.entries(body).flatMap(([field, value]) => {
      const values = Array.isArray(value) ? value : [value];
      return values
        .filter((item) => typeof item === 'string')
        .map((item) => `${field}: ${item}`);
    });

    if (messages.length) return messages.join(' ');
  }

  return error.message || 'An unexpected error occurred.';
}

export default function TaskForm() {
  const { id } = useParams();

  // Reset form state when switching between tasks or modes.
  return <TaskFormFields key={id ?? 'new'} id={id} />;
}

function TaskFormFields({ id }) {
  const isEdit = id !== undefined;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    let active = true;

    async function loadTask() {
      try {
        const task = await getTask(id);

        if (active) {
          setTitle(task.title ?? '');
          setDescription(task.description ?? '');
          setCompleted(Boolean(task.completed));
        }
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
  }, [id, isEdit]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || loading || fetchError) return;

    setSaveError('');

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Please enter a title.');
      return;
    }

    setTitleError('');
    setSaving(true);

    try {
      if (isEdit) {
        await updateTask(id, {
          title: trimmedTitle,
          description,
          completed,
        });
      } else {
        await createTask({ title: trimmedTitle, description });
      }

      navigate('/tasks');
    } catch (error) {
      setSaveError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { padding: '0.6rem', font: 'inherit' };

  return (
    <main style={{ maxWidth: 560, margin: '2rem auto', padding: '1rem' }}>
      <h1>{isEdit ? 'Edit task' : 'Create task'}</h1>

      {loading ? (
        <p role="status">Loading task...</p>
      ) : fetchError ? (
        <p role="alert" style={{ color: '#b91c1c' }}>
          Could not load task: {fetchError}
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={saving}
            style={{ display: 'grid', gap: '0.75rem' }}
          >
            <label htmlFor="title">Title (required)</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setTitleError('');
              }}
              disabled={saving}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'title-error' : undefined}
              style={inputStyle}
            />
            {titleError && (
              <span
                id="title-error"
                role="alert"
                style={{ color: '#b91c1c' }}
              >
                {titleError}
              </span>
            )}

            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={saving}
              style={inputStyle}
            />

            {isEdit && (
              <label htmlFor="completed">
                <input
                  id="completed"
                  name="completed"
                  type="checkbox"
                  checked={completed}
                  onChange={(event) => setCompleted(event.target.checked)}
                  disabled={saving}
                />{' '}
                Completed
              </label>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{ padding: '0.75rem' }}
            >
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </form>

          {saveError && (
            <p role="alert" style={{ color: '#b91c1c' }}>
              Could not save task: {saveError}
            </p>
          )}
        </>
      )}

      <p>
        <Link to="/tasks">Cancel</Link>
      </p>
    </main>
  );
}

