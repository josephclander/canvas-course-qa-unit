const { loadLocalConfig } = require("../../utils/loadLocalConfig");
const { createCanvasApi } = require("../../utils/canvasApi");

describe("Course details", () => {
  const cfg = loadLocalConfig();
  const api = createCanvasApi();
  const detailsCfg = cfg.expected?.details;

  let details;

  beforeAll(async () => {
    details = await api.courseDetails(cfg.courseId);
  });

  test("course id", () => {
    expect(String(details.id)).toBe(String(cfg.courseId));
  });

  test("name", () => {
    if (detailsCfg?.name === undefined) return;
    expect(details.name).toBe(detailsCfg.name);
  });

  test("course code", () => {
    if (detailsCfg?.courseCode === undefined) return;
    expect(details.course_code).toBe(detailsCfg.courseCode);
  });

  test("restrict enrollments to course dates", () => {
    if (detailsCfg?.restrictEnrollmentsToCourseDates === undefined) return;
    expect(details.restrict_enrollments_to_course_dates).toBe(
      detailsCfg.restrictEnrollmentsToCourseDates
    );
  });

  test("timezone", () => {
    if (detailsCfg?.timeZone === undefined) return;
    expect(details.time_zone).toBe(detailsCfg.timeZone);
  });

  test("start date", () => {
    if (detailsCfg?.startDateRequired === true) {
      expect(details.start_at).not.toBeNull();
    }
    if (detailsCfg?.startDateRequired === false) {
      expect(details.start_at).toBeNull();
    }
  });

  test("end date", () => {
    if (detailsCfg?.endDateRequired === true) {
      expect(details.end_at).not.toBeNull();
    }
    if (detailsCfg?.endDateRequired === false) {
      expect(details.end_at).toBeNull();
    }
  });

  test("blueprint", () => {
    if (detailsCfg?.blueprint === undefined) return;
    expect(details.blueprint).toBe(detailsCfg.blueprint);
  });
});
