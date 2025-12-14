const { loadLocalConfig } = require("../../utils/loadLocalConfig");
const { createCanvasApi } = require("../../utils/canvasApi");
const {
  expectIfDefined,
  expectBooleanGroup,
} = require("../../utils/testAssertions");

describe("Course settings", () => {
  const cfg = loadLocalConfig();
  const api = createCanvasApi();
  const settingsCfg = cfg.expected?.settings;

  let settings;

  beforeAll(async () => {
    settings = await api.courseSettings(cfg.courseId);
  });

  test("discussions", () => {
    expectBooleanGroup(
      settings,
      settingsCfg?.discussionsAllowed,
      [
        "allow_student_discussion_topics",
        "allow_student_forum_attachments",
        "allow_student_discussion_editing",
        "allow_student_anonymous_discussion_topics",
      ],
      "lock_all_announcements"
    );
  });

  test("view before start date", () => {
    expectIfDefined(
      settings.restrict_student_future_view,
      settingsCfg?.restrictFutureView
    );
  });

  test("view after end date", () => {
    expectIfDefined(
      settings.restrict_student_past_view,
      settingsCfg?.restrictPastView
    );
  });
});
