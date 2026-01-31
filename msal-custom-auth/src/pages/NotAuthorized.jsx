export default function NotAuthorized() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🚫 Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/">Return to Home</a>
    </div>
  );
}
