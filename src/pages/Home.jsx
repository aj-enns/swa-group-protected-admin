import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../msalConfig";
import { Link } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1e3a5f 100%)",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.95rem",
    opacity: 0.9,
    transition: "opacity 0.2s",
  },
  navLinkDisabled: {
    color: "#8ba4bc",
    textDecoration: "none",
    fontSize: "0.95rem",
    cursor: "not-allowed",
  },
  authButton: {
    padding: "0.5rem 1.25rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  signInButton: {
    backgroundColor: "#fff",
    color: "#1e3a5f",
  },
  signOutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  },
  heroSubtitle: {
    fontSize: "1.25rem",
    opacity: 0.9,
    maxWidth: "600px",
    lineHeight: 1.6,
    marginBottom: "2rem",
  },
  userCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "2rem",
    marginTop: "2rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    minWidth: "300px",
  },
  userInfo: {
    textAlign: "left",
    marginBottom: "1rem",
  },
  label: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: "0.25rem",
  },
  value: {
    fontSize: "1rem",
    marginBottom: "1rem",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    backgroundColor: "rgba(76, 175, 80, 0.3)",
    border: "1px solid rgba(76, 175, 80, 0.5)",
    borderRadius: "20px",
    fontSize: "0.85rem",
    marginRight: "0.5rem",
  },
};

export default function Home() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(console.error);
  };

  const handleLogout = () => {
    instance.logoutPopup().catch(console.error);
  };

  const account = accounts[0];
  const roles = account?.idTokenClaims?.roles ?? [];
  const isAdmin = roles.includes("Admin");

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>🔐 Portal</h1>
        
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          
          {isAuthenticated ? (
            <Link to="/profile" style={styles.navLink}>Profile</Link>
          ) : (
            <span style={styles.navLinkDisabled} title="Sign in to view">Profile</span>
          )}
          
          {isAdmin && (
            <>
              <Link to="/admin" style={styles.navLink}>Admin</Link>
              <Link to="/admin/reports" style={styles.navLink}>Reports</Link>
            </>
          )}
          
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              style={{...styles.authButton, ...styles.signOutButton}}
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={handleLogin} 
              style={{...styles.authButton, ...styles.signInButton}}
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <h2 style={styles.heroTitle}>
          {isAuthenticated ? `Welcome back, ${account?.name?.split(' ')[0]}!` : 'Welcome to the Portal'}
        </h2>
        <p style={styles.heroSubtitle}>
          {isAuthenticated 
            ? 'Access your profile and admin features from the navigation above.'
            : 'Sign in with your Microsoft account to access protected resources and admin features.'}
        </p>

        {!isAuthenticated && (
          <button 
            onClick={handleLogin} 
            style={{...styles.authButton, ...styles.signInButton, padding: "0.75rem 2rem", fontSize: "1rem"}}
          >
            Get Started
          </button>
        )}

        {isAuthenticated && (
          <div style={styles.userCard}>
            <div style={styles.userInfo}>
              <div style={styles.label}>Signed in as</div>
              <div style={styles.value}>{account?.name}</div>
              
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{account?.username}</div>
              
              <div style={styles.label}>Roles</div>
              <div>
                {roles.length > 0 ? (
                  roles.map(role => (
                    <span key={role} style={styles.badge}>{role}</span>
                  ))
                ) : (
                  <span style={{opacity: 0.7}}>No roles assigned</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
