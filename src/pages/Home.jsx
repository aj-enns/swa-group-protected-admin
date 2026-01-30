import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../msalConfig";
import { Link } from "react-router-dom";

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

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to the Portal</h1>
      
      {!isAuthenticated ? (
        <button onClick={handleLogin} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
          Sign In
        </button>
      ) : (
        <div>
          <p>Hello, <strong>{account?.name}</strong>!</p>
          <p>Email: {account?.username}</p>
          <p>Roles: {roles.length > 0 ? roles.join(", ") : "None"}</p>
          
          <nav style={{ margin: "1rem 0" }}>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link to="/profile">Profile</Link></li>
              {roles.includes("Admin") && (
                <>
                  <li><Link to="/admin">Admin Home</Link></li>
                  <li><Link to="/admin/reports">Admin Reports</Link></li>
                </>
              )}
            </ul>
          </nav>
          
          <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
