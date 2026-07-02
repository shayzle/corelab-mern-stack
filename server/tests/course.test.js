jest.mock("../src/middleware/auth.middleware", () => ({
  protect: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
}));

const request = require("supertest");
const app = require("../src/app");

describe("POST /api/courses validation", () => {
  it("rejects a course without a title", async () => {
    const res = await request(app)
      .post("/api/courses")
      .send({title: "", description: "a test !"});

    expect(res.status).toBe(400);
  });

  it("rejects a course without a description", async () => {
    const res = await request(app)
      .post("/api/courses")
      .send({title: "valid title !"});

    expect(res.status).toBe(400);
  });
});
