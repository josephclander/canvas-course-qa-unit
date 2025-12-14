const { createCanvasClient } = require("./canvasClient");

function createCanvasApi() {
  const client = createCanvasClient();

  return {
    // GET /api/v1/courses/:course_id
    courseDetails(courseId) {
      if (!courseId) throw new Error("courseId is required");
      return client.get(`/api/v1/courses/${courseId}`);
    },

    // GET /api/v1/courses/:course_id/settings
    courseSettings(courseId) {
      if (!courseId) throw new Error("courseId is required");
      return client.get(`/api/v1/courses/${courseId}/settings`);
    },

    // Later: modulesList(courseId), moduleItems(courseId, moduleId), etc.
  };
}

module.exports = { createCanvasApi };
