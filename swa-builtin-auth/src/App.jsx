import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { getAuthInfo, login, logout } from './auth'
import Home from './pages/Home'
import Profile from './pages/profile/Profile'
import AdminHome from './pages/admin/AdminHome'
import Reports from './pages/admin/Reports'
import NotAuthorized from './pages/NotAuthorized'
import RequireRole from './components/RequireRole'

// Auth Context for sharing user state
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const { clientPrincipal } = await getAuthInfo()
        setUser(clientPrincipal)
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const isAdmin = user?.userRoles?.includes('Admin')

  const handleLogin = () => {
    login(window.location.pathname)
  }

  const handleLogout = () => {
    logout('/')
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, login: handleLogin, logout: handleLogout }}>
      <div style={styles.app}>
        <header style={styles.header}>
          <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>SWA Auth Demo</Link>
            <div style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>Home</Link>
              {user && <Link to="/profile" style={styles.navLink}>Profile</Link>}
              {isAdmin && <Link to="/admin" style={styles.navLink}>Admin</Link>}
            </div>
            <div style={styles.authSection}>
              {user ? (
                <>
                  <span style={styles.userName}>{user.userDetails}</span>
                  {isAdmin && <span style={styles.badge}>Admin</span>}
                  <button onClick={handleLogout} style={styles.button}>Sign Out</button>
                </>
              ) : (
                <button onClick={handleLogin} style={styles.buttonPrimary}>Sign In</button>
              )}
            </div>
          </nav>
        </header>

        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/profile" element={
              <RequireRole role="authenticated">
                <Profile />
              </RequireRole>
            } />
            <Route path="/admin" element={
              <RequireRole role="Admin">
                <AdminHome />
              </RequireRole>
            } />
            <Route path="/admin/reports" element={
              <RequireRole role="Admin">
                <Reports />
              </RequireRole>
            } />
          </Routes>
        </main>

        <footer style={styles.footer}>
          <p>SWA Built-in Authentication Demo • No MSAL Required</p>
        </footer>
      </div>
    </AuthContext.Provider>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#107c10',
    color: 'white',
    padding: '0 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 0'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    opacity: 0.9,
    transition: 'opacity 0.2s'
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userName: {
    opacity: 0.9
  },
  badge: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  buttonPrimary: {
    backgroundColor: 'white',
    border: 'none',
    color: '#107c10',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #107c10',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
}

export default App
