function createAuth() {
  const authMode = process.env.CANVAS_AUTH_MODE || "pat";

  if (authMode === "pat") {
    const token = process.env.CANVAS_TOKEN;
    if (!token) throw new Error("Missing CANVAS_TOKEN (PAT auth).");

    return {
      async getAuthHeader() {
        return { Authorization: `Bearer ${token}` };
      },
    };
  }

  if (authMode === "oauth2") {
    // Implement later when you can test enterprise.
    return {
      async getAuthHeader() {
        throw new Error(
          "OAuth2 auth not implemented yet. Set CANVAS_AUTH_MODE=pat for now."
        );
      },
    };
  }

  throw new Error(`Unknown CANVAS_AUTH_MODE: ${authMode}`);
}

module.exports = { createAuth };
