# Azure Static Web Apps with Entra ID Role-Based Access Control (RBAC)

This project demonstrates how to implement **Role-Based Access Control (RBAC)** in an Azure Static Web App using **Microsoft Entra ID** (formerly Azure AD) app roles.

## Overview

Many applications need to restrict certain pages or features to specific users. This solution shows how to:

- ✅ Authenticate users with Microsoft Entra ID
- ✅ Define custom app roles (e.g., "Admin")
- ✅ Protect React routes based on user roles
- ✅ Show/hide navigation based on assigned roles
- ✅ Deploy everything with Infrastructure as Code (Bicep) and GitHub Actions

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure Static Web App                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  React SPA (Vite)                                           ││
│  │  - MSAL React for authentication                            ││
│  │  - RequireRole component for route protection               ││
│  │  - Role-aware navigation                                    ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  API (Azure Functions)                                      ││
│  │  - Optional: Server-side role validation                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Microsoft Entra ID                                  │
│  - App Registration with App Roles                              │
│  - User/Group role assignments                                  │
│  - ID tokens with "roles" claim                                 │
└─────────────────────────────────────────────────────────────────┘
```

## How It Works

1. **User clicks "Sign In"** → MSAL opens a popup to Microsoft Entra ID
2. **User authenticates** → Entra ID returns an ID token
3. **ID token contains roles** → The `roles` claim lists assigned app roles
4. **React checks roles** → `RequireRole` component allows/denies access
5. **UI adapts** → Navigation shows only permitted links

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- [GitHub CLI](https://cli.github.com/) (optional, for secrets)
- An Azure subscription
- A Microsoft Entra ID tenant

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/aj-enns/swa-group-protected-admin.git
cd swa-group-protected-admin
npm install
```

### 2. Create Entra ID App Registration

```bash
# Login to Azure
az login

# Create the app registration for SPA authentication
az ad app create \
  --display-name "my-swa-rbac-app" \
  --sign-in-audience "AzureADMyOrg" \
  --enable-id-token-issuance true \
  --query "appId" -o tsv
```

Save the **appId** - you'll need it for configuration.

### 3. Add App Roles

```bash
# Replace <APP_ID> with your app ID from step 2
az ad app update --id <APP_ID> --app-roles '[
  {
    "allowedMemberTypes": ["User"],
    "description": "Administrators can access the admin portal",
    "displayName": "Admin",
    "isEnabled": true,
    "value": "Admin",
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
]'
```

### 4. Create Service Principal

```bash
# Required for role assignment
az ad sp create --id <APP_ID>
```

### 5. Add SPA Redirect URIs

**Important:** Use SPA redirect URIs (not Web) for MSAL browser authentication:

```bash
# First, get the app's object ID (different from appId)
APP_OBJECT_ID=$(az ad app show --id <APP_ID> --query id -o tsv)

# Add SPA redirect URIs using Graph API
az rest --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --headers "Content-Type=application/json" \
  --body '{
    "spa": {
      "redirectUris": [
        "http://localhost:5173/",
        "https://YOUR-SWA-URL.azurestaticapps.net/"
      ]
    }
  }'
```

### 6. Configure the Application

Update `src/msalConfig.js` with your values:

```javascript
export const msalConfig = {
  auth: {
    clientId: "<YOUR_APP_ID>",
    authority: "https://login.microsoftonline.com/<YOUR_TENANT_ID>",
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};
```

### 7. Assign Roles to Users

**Option A: Azure Portal**
1. Go to **Entra ID** → **Enterprise Applications**
2. Find your app → **Users and groups**
3. Click **Add user/group**
4. Select user(s) and the **Admin** role
5. Click **Assign**

**Option B: Azure CLI**
```bash
# Get the service principal ID
SP_ID=$(az ad sp list --display-name "my-swa-rbac-app" --query "[0].id" -o tsv)

# Get your user's object ID
USER_ID=$(az ad user show --id your-email@domain.com --query id -o tsv)

# Assign the Admin role
az rest --method POST \
  --uri "https://graph.microsoft.com/v1.0/servicePrincipals/$SP_ID/appRoleAssignedTo" \
  --body "{
    \"principalId\": \"$USER_ID\",
    \"resourceId\": \"$SP_ID\",
    \"appRoleId\": \"a1b2c3d4-e5f6-7890-abcd-ef1234567890\"
  }"
```

### 8. Run Locally

```bash
npm run dev
```

Visit http://localhost:5173 and sign in!

## Project Structure

```
├── .github/workflows/
│   ├── deploy-infrastructure.yml  # Manual infra deployment
│   └── deploy-application.yml     # Manual app deployment
├── api/
│   ├── host.json                  # Azure Functions config
│   ├── package.json
│   └── src/functions/
│       └── secure-admin.js        # Protected API endpoint (V4 model)
├── infra/
│   ├── main.bicep                 # Infrastructure as Code
│   └── main.bicepparam            # Bicep parameters
├── src/
│   ├── components/
│   │   └── RequireRole.jsx        # 🔐 Role-based route protection
│   ├── pages/
│   │   ├── Home.jsx               # Login/logout, role-aware nav
│   │   ├── NotAuthorized.jsx      # Access denied page
│   │   ├── admin/
│   │   │   ├── AdminHome.jsx      # 🔒 Admin-only page
│   │   │   └── Reports.jsx        # 🔒 Admin-only page
│   │   └── profile/
│   │       └── Profile.jsx        # User profile page
│   ├── App.jsx                    # Routes with role protection
│   ├── main.jsx                   # MSAL Provider setup
│   └── msalConfig.js              # Entra ID configuration
└── staticwebapp.config.json       # SWA routing config
```

## Key Code Patterns

### Protecting a Route with Roles

```jsx
// App.jsx
import RequireRole from "./components/RequireRole";

<Route
  path="/admin"
  element={
    <RequireRole allowedRoles={["Admin"]}>
      <AdminHome />
    </RequireRole>
  }
/>
```

### The RequireRole Component

```jsx
// components/RequireRole.jsx
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RequireRole({ allowedRoles, children }) {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const account = instance.getActiveAccount();
  
  // Roles come from the ID token's "roles" claim
  const roles = account?.idTokenClaims?.roles ?? [];

  useEffect(() => {
    if (account) {
      const hasRole = allowedRoles.some(r => roles.includes(r));
      if (!hasRole) {
        navigate("/not-authorized");
      }
    }
  }, [roles, allowedRoles, account, navigate]);

  return children;
}
```

### Conditional Navigation Based on Roles

```jsx
// Home.jsx
const roles = account?.idTokenClaims?.roles ?? [];

{roles.includes("Admin") && (
  <Link to="/admin">Admin Portal</Link>
)}
```

### MSAL Configuration

```javascript
// msalConfig.js
import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

export const msalInstance = new PublicClientApplication(msalConfig);
```

## Adding More Roles

### 1. Define the Role in Entra ID

```bash
az ad app update --id <APP_ID> --app-roles '[
  {
    "allowedMemberTypes": ["User"],
    "displayName": "Admin",
    "value": "Admin",
    "isEnabled": true,
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  },
  {
    "allowedMemberTypes": ["User"],
    "displayName": "Editor",
    "value": "Editor", 
    "isEnabled": true,
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901"
  }
]'
```

### 2. Use in Your App

```jsx
<RequireRole allowedRoles={["Admin", "Editor"]}>
  <EditPage />
</RequireRole>
```

## Deployment

### Infrastructure (Bicep)

The `infra/main.bicep` file creates the Azure Static Web App:

```bash
az deployment group create \
  --resource-group rg-my-swa \
  --template-file infra/main.bicep \
  --parameters infra/main.bicepparam
```

### GitHub Actions

This project uses two separate **manual** workflows:

| Workflow | File | Purpose |
|----------|------|---------|  
| Deploy Infrastructure | `deploy-infrastructure.yml` | Creates Azure resources via Bicep |
| Deploy Application | `deploy-application.yml` | Builds and deploys the React app + API |

To run a workflow:
1. Go to **Actions** tab in GitHub
2. Select the workflow
3. Click **Run workflow** → **Run workflow**

Required GitHub Secrets:
- `AZURE_CLIENT_ID` - Service principal for GitHub Actions (workload identity)
- `AZURE_TENANT_ID` - Your Entra ID tenant
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription

## Roles vs Groups

| Feature | App Roles | Security Groups |
|---------|-----------|-----------------|
| Defined in | App Registration | Entra ID Directory |
| Claim name | `roles` | `groups` |
| Best for | Application-specific permissions | Org-wide groupings |
| Assignment | Per-app basis | Across all apps |
| Limit | 250 roles per app | No limit |

This solution uses **App Roles** because:
- ✅ More granular control per application
- ✅ Doesn't require Group claims configuration  
- ✅ Roles are meaningful ("Admin" vs a GUID)
- ✅ Easy to manage in Enterprise Applications

## Troubleshooting

### Roles not appearing in token

1. Ensure the user is assigned the role in **Enterprise Applications** (not App Registrations)
2. Sign out and sign back in to get a fresh token
3. Check the token at https://jwt.ms

### White screen after login

1. Check browser console for errors
2. Verify `clientId` and `authority` in msalConfig.js
3. Ensure redirect URI matches exactly (including trailing slash)

### "AADSTS50011: Reply URL does not match"

Ensure you're using **SPA** redirect URIs (not Web):
```bash
APP_OBJECT_ID=$(az ad app show --id <APP_ID> --query id -o tsv)
az rest --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications/$APP_OBJECT_ID" \
  --headers "Content-Type=application/json" \
  --body '{"spa":{"redirectUris":["https://your-exact-url/"]}}'
```

### MIME type error for JavaScript modules

If you see "Expected a JavaScript module but got application/octet-stream", ensure your `staticwebapp.config.json` includes:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "*.js", "*.css"]
  },
  "mimeTypes": {
    ".js": "text/javascript"
  }
}
```

## Resources

- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [App Roles in Microsoft Entra ID](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps)
- [ID Token Claims Reference](https://docs.microsoft.com/azure/active-directory/develop/id-tokens)

## License

MIT
