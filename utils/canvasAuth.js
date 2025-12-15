// utils/canvasAuth.js
const fetch = require("node-fetch");
const fs = require("fs");
const os = require("os");
const path = require("path");

// token stored in home directory for light safety against commits
const TOKEN_FILE = path.join(os.homedir(), "canvas-course-qa-unit.token.json");

function minutesRemaining(ms) {
  return Math.max(0, Math.ceil(ms / 60000));
}

function readTokenFromDisk() {
  try {
    const raw = fs.readFileSync(TOKEN_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed?.access_token || !parsed?.expires_at) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeTokenToDisk(tokenObj) {
  // mode is best-effort on Windows but harmless elsewhere
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenObj, null, 2), {
    mode: 0o600,
  });
}

function createAuth() {
  const authMode = process.env.CANVAS_AUTH_MODE || "pat";
  const baseUrl = process.env.CANVAS_BASE_URL;

  if (!baseUrl) throw new Error("Missing CANVAS_BASE_URL.");

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
  // OAuth2 auth (client_credentials)
  // --------------------
  if (authMode === "oauth2") {
    const clientId = process.env.CANVAS_CLIENT_ID;
    const clientSecret = process.env.CANVAS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        "Missing CANVAS_CLIENT_ID or CANVAS_CLIENT_SECRET (OAuth2 auth)."
      );
    }

    // Load cached token from disk at startup (so repeated node runs reuse it)
    const cached = readTokenFromDisk();
    let cachedToken = cached?.access_token || null;
    let tokenExpiry = cached?.expires_at || 0;

    async function fetchToken() {
      const res = await fetch(`${baseUrl}/login/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
      tokenExpiry = Date.now() + (data.expires_in ?? 3600) * 1000;

      writeTokenToDisk({
        access_token: cachedToken,
        expires_at: tokenExpiry,
      });

      console.log(
        `[Canvas auth] New token acquired. ~${minutesRemaining(
          (data.expires_in ?? 3600) * 1000
        )} min valid.`
      );

      return cachedToken;
    }

    return {
      async getAuthHeader() {
        const now = Date.now();

        if (!cachedToken || now >= tokenExpiry) {
          await fetchToken();
        } else {
          console.log(
            `[Canvas auth] Reusing token. ~${minutesRemaining(
              tokenExpiry - now
            )} min remaining.`
          );
        }

        return { Authorization: `Bearer ${cachedToken}` };
      },
    };
  }

  throw new Error(`Unknown CANVAS_AUTH_MODE: ${authMode}`);
}

module.exports = { createAuth };
