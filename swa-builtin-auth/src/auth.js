/**
 * SWA Built-in Authentication Helper
 * 
 * Uses Azure Static Web Apps' built-in authentication endpoints:
 * - /.auth/me - Get current user info
 * - /.auth/login/{provider} - Initiate login
 * - /.auth/logout - Sign out
 * 
 * No MSAL library required!
 */

/**
 * Fetches the current user's authentication info from SWA
 * @returns {Promise<{clientPrincipal: object|null}>}
 */
export async function getAuthInfo() {
  try {
    const response = await fetch('/.auth/me');
    if (!response.ok) {
      return { clientPrincipal: null };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching auth info:', error);
    return { clientPrincipal: null };
  }
}

/**
 * Checks if the current user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const { clientPrincipal } = await getAuthInfo();
  return clientPrincipal !== null;
}

/**
 * Checks if the current user has a specific role
 * @param {string} role - The role to check
 * @returns {Promise<boolean>}
 */
export async function hasRole(role) {
  const { clientPrincipal } = await getAuthInfo();
  if (!clientPrincipal) return false;
  return clientPrincipal.userRoles?.includes(role) ?? false;
}

/**
 * Gets the current user's display name
 * @returns {Promise<string|null>}
 */
export async function getUserName() {
  const { clientPrincipal } = await getAuthInfo();
  return clientPrincipal?.userDetails ?? null;
}

/**
 * Initiates login with Azure AD
 * @param {string} [returnUrl='/'] - URL to redirect to after login
 */
export function login(returnUrl = '/') {
  window.location.href = `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(returnUrl)}`;
}

/**
 * Signs the user out
 * @param {string} [returnUrl='/'] - URL to redirect to after logout
 */
export function logout(returnUrl = '/') {
  window.location.href = `/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(returnUrl)}`;
}
