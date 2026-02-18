// tests/course/details.api.test.js
import { loadLocalConfig } from "../../utils/loadLocalConfig.js";
import { createCanvasApi } from "../../utils/canvasApi.js";
import { expectIfDefined, expectPresence } from "../../utils/testAssertions.js";

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
    expectIfDefined(details.name, detailsCfg?.name);
  });

  test("course code", () => {
    expectIfDefined(details.course_code, detailsCfg?.courseCode);
  });

  test("restrict enrollments to course dates", () => {
    expectIfDefined(
      details.restrict_enrollments_to_course_dates,
      detailsCfg?.restrictEnrollmentsToCourseDates
    );
  });

  test("timezone", () => {
    expectIfDefined(details.time_zone, detailsCfg?.timeZone);
  });

  test("start date", () => {
    expectPresence(details.start_at, detailsCfg?.startDateRequired);
  });

  test("end date", () => {
    expectPresence(details.end_at, detailsCfg?.endDateRequired);
  });

  test("blueprint", () => {
    expectIfDefined(details.blueprint, detailsCfg?.blueprint);
  });
});
