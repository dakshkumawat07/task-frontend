import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/client';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/tasks');
    } catch (err) {
      const body = err.response?.data;
      const message =
        body?.detail || body?.message || body?.non_field_errors?.[0];
      const badCredentials = [400, 401].includes(err.response?.status);

      setError(
        typeof message === 'string'
          ? message
          : badCredentials
            ? 'Invalid username or password.'
            : 'Unable to log in. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: '4rem auto', padding: '1rem' }}>
      <h1>Log in</h1>

      <form
        onSubmit={handleSubmit}
        aria-busy={loading}
        aria-describedby={error ? 'login-error' : undefined}
        style={{ display: 'grid', gap: '0.75rem' }}
      >
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          disabled={loading}
          style={{ padding: '0.6rem' }}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={loading}
          style={{ padding: '0.6rem' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.75rem' }}
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      {error && (
        <p id="login-error" role="alert" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </main>
  );
}
