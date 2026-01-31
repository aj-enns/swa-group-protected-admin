import { useAuth } from '../../App'

function Profile() {
  const { user } = useAuth()

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👤 Your Profile</h1>
      
      <div style={styles.card}>
        <h2>User Information</h2>
        <p>This information comes from the <code>/.auth/me</code> endpoint.</p>
        
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.label}>Display Name</td>
              <td style={styles.value}>{user.userDetails}</td>
            </tr>
            <tr>
              <td style={styles.label}>User ID</td>
              <td style={styles.value}>{user.userId}</td>
            </tr>
            <tr>
              <td style={styles.label}>Identity Provider</td>
              <td style={styles.value}>{user.identityProvider}</td>
            </tr>
            <tr>
              <td style={styles.label}>Roles</td>
              <td style={styles.value}>
                <div style={styles.roles}>
                  {user.userRoles?.map(role => (
                    <span key={role} style={styles.roleBadge}>{role}</span>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2>Raw Client Principal</h2>
        <p>The complete response from <code>/.auth/me</code>:</p>
        <pre style={styles.code}>
          {JSON.stringify({ clientPrincipal: user }, null, 2)}
        </pre>
      </div>

      <div style={styles.infoBox}>
        <h3>ℹ️ About SWA Authentication</h3>
        <p>
          With SWA built-in authentication, you don't get access tokens.
          The user's identity is validated server-side, and only the 
          <code>clientPrincipal</code> object is exposed to your app.
        </p>
        <p>
          <strong>This means:</strong> You cannot call external APIs 
          (like Microsoft Graph) that require an access token. If you 
          need that functionality, use MSAL instead.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    marginBottom: '2rem',
    color: '#333'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    marginTop: '1rem'
  },
  label: {
    fontWeight: 'bold',
    padding: '0.75rem',
    backgroundColor: '#f5f5f5',
    width: '150px',
    verticalAlign: 'top'
  },
  value: {
    padding: '0.75rem'
  },
  roles: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  roleBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.85rem'
  },
  code: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '0.85rem'
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: '8px',
    padding: '1.5rem'
  }
}

export default Profile
