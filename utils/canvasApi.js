// utils/canvasApi.js

// For each new endpoint you need to add the scope to the .env file

import { createCanvasClient } from "./canvasClient.js";

export function createCanvasApi() {
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
