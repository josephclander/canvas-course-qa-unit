const { loadLocalConfig } = require("../../utils/loadLocalConfig");
const { createCanvasApi } = require("../../utils/canvasApi");

describe("Course settings (live API)", () => {
  const cfg = loadLocalConfig();
  const api = createCanvasApi();

  test("can fetch course settings", async () => {
    const settings = await api.courseSettings(cfg.courseId);
    expect(settings).toBeTruthy();
    // Add real assertions once you decide expectations per course type.
  });
});
