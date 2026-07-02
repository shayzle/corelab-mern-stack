jest.mock("../src/middleware/auth.middleware", () => ({
  protect: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
}));

const request = require("supertest");
const app = require("../src/app");

describe("POST /api/lessons validation", () => {
  it("rejects a lesson without a title", async () => {
    const res = await request(app).post("/api/lessons").send({
      title: "",
      htmlContent: "<p>helloo helloo</p>",
      courseId: "6a19e962a731e71487d48cdf",
    });

    expect(res.status).toBe(400);
  });

  it("rejects a lesson with an invalid courseid", async () => {
    const res = await request(app).post("/api/lessons").send({
      title: "Lesson 1",
      htmlContent: "<p>helloooo</p>",
      courseId: "123",
    });

    expect(res.status).toBe(400);
  });
});
