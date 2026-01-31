import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

function NotAuthorized() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚫 Access Denied</h1>
        <p style={styles.message}>
          You don't have permission to access this page.
        </p>
        
        {user && (
          <div style={styles.info}>
            <p><strong>Your current roles:</strong></p>
            <div style={styles.roles}>
              {user.userRoles?.map(role => (
                <span key={role} style={styles.roleBadge}>{role}</span>
              ))}
            </div>
          </div>
        )}

        <div style={styles.actions}>
          <button onClick={() => navigate('/')} style={styles.button}>
            Go Home
          </button>
          <button onClick={() => navigate(-1)} style={styles.buttonSecondary}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh'
  },
  card: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px'
  },
  title: {
    color: '#d32f2f',
    marginBottom: '1rem'
  },
  message: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '1.5rem'
  },
  info: {
    backgroundColor: '#fff3e0',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem'
  },
  roles: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  roleBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.85rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
  button: {
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#0078d4',
    border: '1px solid #0078d4',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
}

export default NotAuthorized
