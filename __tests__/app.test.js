const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const testEndPointsData = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  connection.end();
});

// task 2

describe("GET api/topics", () => {
  test("Returns 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("Non-Existent Endpoint, should return 404", (done) => {
    request(app)
      .get("/api/topix")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  test("Expect length of topics array to be greater than one", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBeGreaterThan(1);
      });
  });
  test("Topics array has slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topicsArray = response.body.topics;
        topicsArray.forEach((element) => {
          expect(element.hasOwnProperty("slug")).toBe(true);
          expect(element.hasOwnProperty("description")).toBe(true);
        });
      });
  });
});

// task 3
describe("GET /api/", () => {
  test("Returns 200 status code", () => {
    return request(app).get("/api/").expect(200);
  });

  test("Checking response is an object in JSON format", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
      });
  });

  test("checking response matches up with endpoints.json object", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(testEndPointsData);
      });
  });
});

// task 4

describe("GET /api/articles/:article_id", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles/1").expect(200);
  });

  test("Non-Existent ID, should return 404", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .expect((response) => {
        const { message } = response.body;
        expect(message).toBe("ID not found!");
      });
  });
});

test("Non-Numerical ID, should return 400 bad path", () => {
  return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .expect((response) => {
      const { message } = response.body;
      expect(message).toBe("Bad path! ID must be a number");
    });
});

test("Has the expected properties and values", () => {
  return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then((response) => {
      expect(response.body.articles.hasOwnProperty("author")).toBe(true);
      expect(response.body.articles.hasOwnProperty("article_img_url")).toBe(
        true
      );
      expect(response.body.articles.hasOwnProperty("title")).toBe(true);
      expect(response.body.articles.hasOwnProperty("article_id")).toBe(true);
      expect(response.body.articles.hasOwnProperty("body")).toBe(true);
      expect(response.body.articles.hasOwnProperty("topic")).toBe(true);
      expect(response.body.articles.hasOwnProperty("created_at")).toBe(true);
      expect(response.body.articles.hasOwnProperty("votes")).toBe(true);
    });
});
