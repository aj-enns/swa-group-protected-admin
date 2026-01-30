import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalConfig";

// MSAL must be initialized before rendering
msalInstance.initialize().then(() => {
  // Handle redirect promise (for redirect login flow)
  msalInstance.handleRedirectPromise().then(() => {
    // Check if user is already logged in
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  }).catch((error) => {
    console.error("MSAL redirect error:", error);
  });
}).catch((error) => {
  console.error("MSAL initialization error:", error);
});