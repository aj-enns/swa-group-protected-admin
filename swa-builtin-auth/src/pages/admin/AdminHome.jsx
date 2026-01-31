import { Link } from 'react-router-dom'
import { useAuth } from '../../App'

function AdminHome() {
  const { user } = useAuth()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔐 Admin Dashboard</h1>
      
      <div style={styles.welcomeCard}>
        <h2>Welcome, Administrator!</h2>
        <p>You have access to this page because you have the <strong>Admin</strong> role.</p>
      </div>

      <div style={styles.grid}>
        <Link to="/admin/reports" style={styles.card}>
          <h3>📊 Reports</h3>
          <p>View system reports and analytics</p>
        </Link>
        
        <div style={styles.card}>
          <h3>👥 User Management</h3>
          <p>Manage user roles and permissions</p>
          <span style={styles.comingSoon}>Coming Soon</span>
        </div>
        
        <div style={styles.card}>
          <h3>⚙️ Settings</h3>
          <p>Configure application settings</p>
          <span style={styles.comingSoon}>Coming Soon</span>
        </div>
      </div>

      <div style={styles.securityCard}>
        <h2>🛡️ Security Information</h2>
        <p>This page is protected in two ways:</p>
        <ol style={styles.list}>
          <li>
            <strong>Server-side (staticwebapp.config.json):</strong>
            <pre style={styles.code}>{`{
  "route": "/admin/*",
  "allowedRoles": ["Admin"]
}`}</pre>
            <p>SWA blocks unauthorized requests before they reach your app.</p>
          </li>
          <li>
            <strong>Client-side (RequireRole component):</strong>
            <p>Additional check in React for defense-in-depth.</p>
          </li>
        </ol>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    marginBottom: '2rem',
    color: '#107c10'
  },
  welcomeCard: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #a5d6a7',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    display: 'block',
    position: 'relative'
  },
  comingSoon: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  securityCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  list: {
    paddingLeft: '1.5rem'
  },
  code: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '0.85rem',
    margin: '0.5rem 0'
  }
}

export default AdminHome
