import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RequireRole({ allowedRoles, children }) {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const account = instance.getActiveAccount();
  const roles = account?.idTokenClaims?.roles ?? [];

  useEffect(() => {
    if (!account) {
      // Not logged in - could redirect to login or just show content
      return;
    }
    
    const hasRole = allowedRoles.some(r => roles.includes(r));
    if (!hasRole) {
      navigate("/not-authorized");
    }
  }, [roles, allowedRoles, account, navigate]);

  // If no account, let the page handle showing login
  if (!account) {
    return children;
  }

  // Check if user has required role
  const hasRole = allowedRoles.some(r => roles.includes(r));
  if (!hasRole) {
    return null; // Will redirect via useEffect
  }

  return children;
}
