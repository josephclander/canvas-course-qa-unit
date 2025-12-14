const { loadLocalConfig } = require("../../utils/loadLocalConfig");
const { createCanvasApi } = require("../../utils/canvasApi");

describe("Course details (live API)", () => {
  const cfg = loadLocalConfig();
  const api = createCanvasApi();

  test("can fetch course details", async () => {
    const details = await api.courseDetails(cfg.courseId);
    expect(details).toHaveProperty("id");
    expect(String(details.id)).toBe(String(cfg.courseId));
  });
});
