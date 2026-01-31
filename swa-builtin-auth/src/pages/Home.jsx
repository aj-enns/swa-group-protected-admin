import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

function Home() {
  const navigate = useNavigate()
  const { user, isAdmin, login } = useAuth()

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.title}>🛡️ SWA Built-in Authentication</h1>
        <p style={styles.subtitle}>
          Secure your Azure Static Web Apps using built-in authentication.
          <br />
          <strong>No MSAL library required!</strong>
        </p>
        
        {!user && (
          <button onClick={login} style={styles.ctaButton}>
            Sign In with Microsoft
          </button>
        )}
      </section>

      <section style={styles.features}>
        <h2>How It Works</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>🔐 Built-in Endpoints</h3>
            <p>SWA provides authentication endpoints out of the box:</p>
            <ul style={styles.list}>
              <li><code>/.auth/login/aad</code> - Login</li>
              <li><code>/.auth/logout</code> - Logout</li>
              <li><code>/.auth/me</code> - User info</li>
            </ul>
          </div>
          
          <div style={styles.card}>
            <h3>🛣️ Route Protection</h3>
            <p>Define allowed roles in <code>staticwebapp.config.json</code>:</p>
            <pre style={styles.code}>{`{
  "route": "/admin/*",
  "allowedRoles": ["Admin"]
}`}</pre>
          </div>
          
          <div style={styles.card}>
            <h3>👤 Custom Roles</h3>
            <p>Assign roles via an Azure Function:</p>
            <pre style={styles.code}>{`// api/get-roles/index.js
module.exports = async (context, req) => {
  return {
    roles: ["Admin"]
  };
};`}</pre>
          </div>
        </div>
      </section>

      {user && (
        <section style={styles.userSection}>
          <h2>Welcome, {user.userDetails}!</h2>
          <div style={styles.roleInfo}>
            <p><strong>Your roles:</strong></p>
            <div style={styles.roles}>
              {user.userRoles?.map(role => (
                <span key={role} style={styles.roleBadge}>{role}</span>
              ))}
            </div>
          </div>
          
          <div style={styles.actions}>
            <button onClick={() => navigate('/profile')} style={styles.actionButton}>
              View Profile
            </button>
            {isAdmin && (
              <button onClick={() => navigate('/admin')} style={styles.actionButtonAdmin}>
                Admin Dashboard
              </button>
            )}
          </div>
        </section>
      )}

      <section style={styles.comparison}>
        <h2>SWA Built-in vs MSAL</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Feature</th>
              <th style={styles.th}>SWA Built-in</th>
              <th style={styles.th}>MSAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Setup Complexity</td>
              <td style={styles.tdGood}>✅ Minimal</td>
              <td style={styles.td}>⚠️ Moderate</td>
            </tr>
            <tr>
              <td style={styles.td}>Library Required</td>
              <td style={styles.tdGood}>✅ None</td>
              <td style={styles.td}>📦 @azure/msal-*</td>
            </tr>
            <tr>
              <td style={styles.td}>Access Tokens</td>
              <td style={styles.td}>❌ Not exposed</td>
              <td style={styles.tdGood}>✅ Full control</td>
            </tr>
            <tr>
              <td style={styles.td}>Call MS Graph</td>
              <td style={styles.td}>❌ No</td>
              <td style={styles.tdGood}>✅ Yes</td>
            </tr>
            <tr>
              <td style={styles.td}>Custom UI</td>
              <td style={styles.td}>❌ Redirect only</td>
              <td style={styles.tdGood}>✅ Popup/Redirect</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  hero: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#107c10'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '1.5rem'
  },
  ctaButton: {
    backgroundColor: '#107c10',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  features: {
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  list: {
    textAlign: 'left',
    paddingLeft: '1.5rem'
  },
  code: {
    backgroundColor: '#f5f5f5',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    overflow: 'auto'
  },
  userSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  roleInfo: {
    marginBottom: '1.5rem'
  },
  roles: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  roleBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.9rem'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  actionButtonAdmin: {
    backgroundColor: '#107c10',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  comparison: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: '2px solid #ddd'
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #eee'
  },
  tdGood: {
    padding: '0.75rem',
    borderBottom: '1px solid #eee',
    backgroundColor: '#e8f5e9'
  }
}

export default Home
