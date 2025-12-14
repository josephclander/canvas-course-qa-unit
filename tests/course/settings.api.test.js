const { loadLocalConfig } = require("../../utils/loadLocalConfig");
const { createCanvasApi } = require("../../utils/canvasApi");

describe("Course settings", () => {
  const cfg = loadLocalConfig();
  const api = createCanvasApi();

  let settings;

  beforeAll(async () => {
    settings = await api.courseSettings(cfg.courseId);
  });

  test("discussions", () => {
    if (cfg.expected?.settings?.discussionsAllowed === undefined) return;

    const allowed = cfg.expected.settings.discussionsAllowed;

    expect(settings.allow_student_discussion_topics).toBe(allowed);
    expect(settings.allow_student_forum_attachments).toBe(allowed);
    expect(settings.allow_student_discussion_editing).toBe(allowed);
    expect(settings.allow_student_anonymous_discussion_topics).toBe(allowed);

    // announcements are inverse of discussions in your model
    expect(settings.lock_all_announcements).toBe(!allowed);
  });

  test("view before start date", () => {
    if (cfg.expected?.settings?.restrictFutureView === undefined) return;

    expect(settings.restrict_student_future_view).toBe(
      cfg.expected.settings.restrictFutureView
    );
  });

  test("view after end date", () => {
    if (cfg.expected?.settings?.restrictPastView === undefined) return;

    expect(settings.restrict_student_past_view).toBe(
      cfg.expected.settings.restrictPastView
    );
  });
});
