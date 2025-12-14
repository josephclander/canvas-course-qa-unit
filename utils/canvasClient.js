const { createAuth } = require("./canvasAuth");

function createCanvasClient() {
  const baseUrl = process.env.CANVAS_BASE_URL;
  if (!baseUrl) throw new Error("Missing CANVAS_BASE_URL.");

  const root = baseUrl.replace(/\/+$/, "");
  const auth = createAuth();

  async function get(path) {
    const headers = {
      Accept: "application/json",
      ...(await auth.getAuthHeader()),
    };

    const res = await fetch(`${root}${path}`, { method: "GET", headers });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Canvas API failed (${res.status}) GET ${path}\n${text}`.trim()
      );
    }

    return res.json();
  }

  return { get };
}

module.exports = { createCanvasClient };
