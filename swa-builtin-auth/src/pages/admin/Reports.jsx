import { Link } from 'react-router-dom'

function Reports() {
  const sampleReports = [
    { id: 1, name: 'User Activity Report', date: '2024-01-15', status: 'Complete' },
    { id: 2, name: 'Security Audit Log', date: '2024-01-14', status: 'Complete' },
    { id: 3, name: 'Performance Metrics', date: '2024-01-13', status: 'Processing' },
  ]

  return (
    <div style={styles.container}>
      <nav style={styles.breadcrumb}>
        <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span>Reports</span>
      </nav>

      <h1 style={styles.title}>📊 Reports</h1>
      
      <div style={styles.card}>
        <h2>Available Reports</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Report Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sampleReports.map(report => (
              <tr key={report.id}>
                <td style={styles.td}>{report.name}</td>
                <td style={styles.td}>{report.date}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: report.status === 'Complete' ? '#e8f5e9' : '#fff3e0',
                    color: report.status === 'Complete' ? '#2e7d32' : '#ef6c00'
                  }}>
                    {report.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.button} disabled={report.status !== 'Complete'}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.infoCard}>
        <h3>ℹ️ Demo Data</h3>
        <p>This is sample data for demonstration purposes. In a real application, this data would be fetched from a secure API endpoint.</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  breadcrumb: {
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  breadcrumbLink: {
    color: '#0078d4',
    textDecoration: 'none'
  },
  breadcrumbSeparator: {
    margin: '0 0.5rem'
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
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.85rem'
  },
  button: {
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    padding: '1rem',
    borderRadius: '8px'
  }
}

export default Reports
