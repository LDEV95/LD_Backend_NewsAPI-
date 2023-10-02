const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  connection.end();
});

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
        console.log(err);
        done();
      });
  });
});
