# Azure Static Web Apps Authentication Patterns

This repository demonstrates **two different approaches** to implementing authentication and role-based access control (RBAC) in Azure Static Web Apps.

## 🎯 Purpose

Help developers and architects understand when to use each authentication pattern for their Azure Static Web Apps projects.

## 📁 Examples

| Folder | Approach | Best For |
|--------|----------|----------|
| [msal-custom-auth](./msal-custom-auth/) | MSAL + Entra ID App Roles | Enterprise apps needing full token access |
| [swa-builtin-auth](./swa-builtin-auth/) | SWA Built-in Authentication | Simple apps, quick setup |

## 🔄 Comparison

| Feature | MSAL Custom Auth | SWA Built-in Auth |
|---------|------------------|-------------------|
| **Setup complexity** | More code, App Registration required | Minimal code, config-based |
| **Token access** | Full JWT with all claims | Simplified via `/.auth/me` |
| **Role source** | Entra ID App Roles | Custom roles in `staticwebapp.config.json` |
| **Providers** | Entra ID (customizable) | Entra ID, GitHub, Twitter, Google |
| **Logout control** | Full control | Limited customization |
| **Token for APIs** | Bearer token available | Client principal header |
| **Offline support** | Tokens cached in localStorage | Session-based |
| **Best for** | Complex enterprise requirements | Rapid development, simple auth |

## 🏗️ Architecture Comparison

### MSAL Custom Auth
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│    MSAL     │────▶│  Entra ID   │
│    App      │◀────│   Library   │◀────│  (tokens)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       │ Bearer Token
       ▼
┌─────────────┐
│  Azure      │  ← Validates JWT, checks "roles" claim
│  Function   │
└─────────────┘
```

### SWA Built-in Auth
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│    SWA      │────▶│  Entra ID   │
│    App      │◀────│   Proxy     │◀────│  (session)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       │ x-ms-client-principal header (automatic)
       ▼
┌─────────────┐
│  Azure      │  ← SWA validates before request reaches function
│  Function   │
└─────────────┘
```

## 🤔 When to Use Which?

### Use MSAL Custom Auth when you need:
- ✅ Access to full JWT token claims
- ✅ Custom token validation logic
- ✅ Entra ID App Roles for fine-grained permissions
- ✅ Silent token refresh for long sessions
- ✅ Multiple APIs with different scopes
- ✅ B2C or external identity providers

### Use SWA Built-in Auth when you need:
- ✅ Quick setup with minimal code
- ✅ Simple role-based access (authenticated/anonymous)
- ✅ Built-in social providers (GitHub, Google, Twitter)
- ✅ No custom token handling
- ✅ Automatic session management

## 📚 Documentation

- [SECURITY.md](./SECURITY.md) - Shared security concepts and best practices
- [msal-custom-auth/README.md](./msal-custom-auth/README.md) - MSAL implementation details
- [swa-builtin-auth/README.md](./swa-builtin-auth/README.md) - SWA built-in auth details

## 🚀 Quick Start

### MSAL Custom Auth
```bash
cd msal-custom-auth
npm install
npm run dev
```
Requires Entra ID App Registration setup. See [msal-custom-auth/README.md](./msal-custom-auth/README.md).

### SWA Built-in Auth
```bash
cd swa-builtin-auth
npm install
npm run dev
```
Works with SWA CLI for local development. See [swa-builtin-auth/README.md](./swa-builtin-auth/README.md).

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- [SWA CLI](https://github.com/Azure/static-web-apps-cli) (for local testing)
- An Azure subscription
- A Microsoft Entra ID tenant

## 🔗 Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [SWA Authentication & Authorization](https://docs.microsoft.com/azure/static-web-apps/authentication-authorization)
- [Entra ID App Roles](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps)

## 📄 License

MIT
