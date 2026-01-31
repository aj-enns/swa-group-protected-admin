import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

/**
 * RequireRole Component
 * 
 * Protects routes based on user roles. This is a CLIENT-SIDE check
 * that provides defense-in-depth alongside the SERVER-SIDE protection
 * defined in staticwebapp.config.json.
 * 
 * @param {string} role - The required role ('authenticated' for any logged-in user, or specific role like 'Admin')
 * @param {React.ReactNode} children - The protected content
 */
function RequireRole({ role, children }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Not logged in
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🔒 Authentication Required</h2>
          <p>Please sign in to access this page.</p>
          <button 
            onClick={() => window.location.href = `/.auth/login/aad?post_login_redirect_uri=${window.location.pathname}`}
            style={styles.button}
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Check for 'authenticated' role (any logged-in user)
  if (role === 'authenticated') {
    return children
  }

  // Check for specific role
  const hasRole = user.userRoles?.includes(role)
  
  if (!hasRole) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🚫 Access Denied</h2>
          <p>You need the <strong>{role}</strong> role to access this page.</p>
          <p style={styles.smallText}>Your roles: {user.userRoles?.join(', ')}</p>
          <button onClick={() => navigate('/')} style={styles.button}>
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return children
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px'
  },
  button: {
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem'
  },
  smallText: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '0.5rem'
  }
}

export default RequireRole
