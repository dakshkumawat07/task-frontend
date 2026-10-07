import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/client'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const nextErrors = {}

    if (!username.trim()) {
      nextErrors.username = 'Username is required.'
    }

    if (!password) {
      nextErrors.password = 'Password is required.'
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!validate()) return

    setIsSubmitting(true)

    try {
      await register(username.trim(), password, email.trim())

      navigate('/login', {
        state: { successMessage: 'Registration successful. Please sign in.' },
      })
    } catch (error) {
      setSubmitError(error?.message || 'Unable to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '48px auto', padding: '0 16px' }}>
      <h1>Create an account</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
          {errors.username && (
            <p style={{ color: 'crimson' }}>{errors.username}</p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email (optional)</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
          {errors.password && (
            <p style={{ color: 'crimson' }}>{errors.password}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      {submitError && (
        <p role="alert" style={{ color: 'crimson' }}>
          {submitError}
        </p>
      )}

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  )
}
