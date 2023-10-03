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
