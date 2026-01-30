import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "398fb3f0-e265-4644-a92b-b5d736cedd72",
    authority: "https://login.microsoftonline.com/d967678a-e358-4218-9a75-5cc7ca5fdefb",
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