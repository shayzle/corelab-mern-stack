jest.mock("../src/middleware/auth.middleware", () => ({
  protect: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
}));

const request = require("supertest");
const app = require("../src/app");

describe("POST /api/quizzes validation", () => {
  it("rejects a quiz without a title", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .send({
        title: "",
        courseId: "6a19e962a731e71487d48cdf",
        passingScore: 70,
        questions: [
          {
            question: "What is HTML?",
            options: ["A", "B"],
            correctAnswers: ["A"],
          },
        ],
      });

    expect(res.status).toBe(400);
  });

  it("rejects a quiz with only one option", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .send({
        title: "Quiz 1",
        courseId: "6a19e962a731e71487d48cdf",
        passingScore: 70,
        questions: [
          {question: "What is HTML?", options: ["A"], correctAnswers: ["A"]},
        ],
      });

    expect(res.status).toBe(400);
  });
});
