/**
 * Secure Admin API Endpoint
 * 
 * Server-side role validation for protected endpoints.
 * See SECURITY.md for detailed documentation on the security model.
 */

const { app } = require("@azure/functions");
const jwt = require("jsonwebtoken");

// Must match the role value defined in Entra ID App Registration
const ADMIN_ROLE = "Admin";

app.http("secure-admin", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const auth = request.headers.get("authorization");

    if (!auth) {
      return { status: 401, body: "Unauthorized: Missing authorization header" };
    }

    // NOTE: Use jwt.verify() in production to validate signature
    const token = auth.split(" ")[1];
    const decoded = jwt.decode(token);

    if (!decoded) {
      return { status: 401, body: "Unauthorized: Invalid token" };
    }

    // Check for required role in token's "roles" claim
    const roles = decoded?.roles || [];
    if (!roles.includes(ADMIN_ROLE)) {
      context.log(`Access denied for user ${decoded.preferred_username}. Roles: ${roles.join(", ") || "none"}`);
      return { status: 403, body: "Forbidden: Admin role required" };
    }

    context.log(`Admin access granted to ${decoded.preferred_username}`);
    return {
      jsonBody: { 
        message: "Welcome admin!",
        user: decoded.preferred_username,
        roles: roles
      }
    };
  }
});
