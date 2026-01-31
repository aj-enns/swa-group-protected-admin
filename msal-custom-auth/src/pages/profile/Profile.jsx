import { useMsal } from "@azure/msal-react";

export default function Profile() {
  const { instance } = useMsal();
  const account = instance.getActiveAccount();

  if (!account) {
    return <p>Please sign in to view your profile.</p>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Profile</h1>
      <table>
        <tbody>
          <tr>
            <td><strong>Name:</strong></td>
            <td>{account.name}</td>
          </tr>
          <tr>
            <td><strong>Email:</strong></td>
            <td>{account.username}</td>
          </tr>
          <tr>
            <td><strong>Roles:</strong></td>
            <td>{(account.idTokenClaims?.roles ?? []).join(", ") || "None"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}