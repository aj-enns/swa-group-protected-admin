const { app } = require("@azure/functions");
const jwt = require("jsonwebtoken");

// Replace with same GUID as in frontend
const ADMIN_GROUP_ID = "00000000-0000-0000-0000-000000000000";

app.http("secure-admin", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const auth = request.headers.get("authorization");

    if (!auth) {
      return { status: 401, body: "Missing token" };
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.decode(token);

    const groups = decoded?.groups || [];
    if (!groups.includes(ADMIN_GROUP_ID)) {
      return { status: 403, body: "Forbidden" };
    }

    return {
      jsonBody: { message: "Welcome admin!" }
    };
  }
});
