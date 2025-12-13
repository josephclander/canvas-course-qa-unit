// tests/course.test.js

const courseDetails = require("../data/courseDetails.json");
const courseSettings = require("../data/courseSettings.json");
const TIMEZONES = require("../utils/timezones");

const selectedTimeZone = TIMEZONES.RIYADH;

// API: GET https://{{domain}}/api/v1/accounts/:account_id/courses/:id
describe("Course Details", () => {
  test.skip("has start date", () => {
    expect(courseDetails.start_at).not.toBeNull();
  });

  test("has end date", () => {
    expect(courseDetails.end_at).not.toBeNull();
  });

  test("is not a blueprint", () => {
    expect(courseDetails.blueprint).toBe(false);
  });

  test("has correct timezone", () => {
    expect(courseDetails.time_zone).toBe(selectedTimeZone);
  });
});

// API: GET https://{{domain}}/api/v1/courses/:course_id/settings
describe("Course Settings", () => {
  test("doesn't allow discussions", () => {
    expect(courseSettings.allow_student_discussion_topics).toBe(false);
    expect(courseSettings.allow_student_forum_attachments).toBe(false);
    expect(courseSettings.allow_student_discussion_editing).toBe(false);
    expect(courseSettings.allow_student_anonymous_discussion_topics).toBe(
      false
    );
    expect(courseSettings.lock_all_announcements).toBe(true);
  });

  test.skip("restricts viewing before start date", () => {
    expect(courseSettings.restrict_student_future_view).toBe(true);
  });

  test("restricts viewing after end date", () => {
    expect(courseSettings.restrict_student_past_view).toBe(true);
  });
});
