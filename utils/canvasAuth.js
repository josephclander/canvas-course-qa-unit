// utils/canvasAuth.js
const fetch = require("node-fetch");

function createAuth() {
  const authMode = process.env.CANVAS_AUTH_MODE || "pat";
  const baseUrl = process.env.CANVAS_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing CANVAS_BASE_URL.");
  }

  // --------------------
  // PAT auth
  // --------------------
  if (authMode === "pat") {
    const token = process.env.CANVAS_TOKEN;
    if (!token) throw new Error("Missing CANVAS_TOKEN (PAT auth).");

    return {
      async getAuthHeader() {
        return { Authorization: `Bearer ${token}` };
      },
    };
  }

  // --------------------
  // OAuth2 auth
  // --------------------
  if (authMode === "oauth2") {
    const clientId = process.env.CANVAS_CLIENT_ID;
    const clientSecret = process.env.CANVAS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        "Missing CANVAS_CLIENT_ID or CANVAS_CLIENT_SECRET (OAuth2 auth)."
      );
    }

    let cachedToken = null;
    let tokenExpiry = 0;

    async function fetchToken() {
      const res = await fetch(`${baseUrl}/login/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`OAuth2 token request failed: ${text}`);
      }

      const data = await res.json();

      cachedToken = data.access_token;
      tokenExpiry = Date.now() + data.expires_in * 1000;

      return cachedToken;
    }

    return {
      async getAuthHeader() {
        if (!cachedToken || Date.now() >= tokenExpiry) {
          await fetchToken();
        }

        return { Authorization: `Bearer ${cachedToken}` };
      },
    };
  }

  throw new Error(`Unknown CANVAS_AUTH_MODE: ${authMode}`);
}

module.exports = { createAuth };
