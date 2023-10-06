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
});

//task 5
// 200 status code
describe("GET /api/articles/", () => {
  test("returns 200 status code", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {});
  });

  test("Handles non-existent endpoint with 404", () => {
    return request(app)
      .get("/api/artixsdfdf")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not Found");
      });
  });

  test("Checking response is an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true);
      });
  });

  test("Each article object has required properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articlesArray = response.body.articles;
        articlesArray.forEach((article) => {
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
        });
      });
  });
  test("Checking that the articles are ordered by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articlesArray = response.body.articles;
        const isDescending = articlesArray.every((article, index) => {
          return (
            // checking if current article being loopedover is the last one in the array if it is, returns true
            index === articlesArray.length - 1 ||
            article.created_at >= articlesArray[index + 1].created_at
          );
        });
        expect(isDescending).toBe(true); // each is in decending order
      });
  });
  test("Returns object without body property", async () => {
    const response = await request(app).get("/api/articles").expect(200);

    const articlesArray = response.body.articles;

    // Check if every article does not have the 'body' property
    const hasNoBody = articlesArray.every((article) => {
      return !article.hasOwnProperty("body");
    });

    expect(hasNoBody).toBe(true);
  });
});

//task 6
describe("GET /api/articles/:article_id/comments", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("Non-Existent ID, should return 404", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .expect((response) => {
        const { message } = response.body;
        expect(message).toBe("Not found");
      });
  });
  test("Non-Numerical ID, should return 400 bad path", () => {
    return request(app)
      .get("/api/articles/bannaa/comments")
      .expect(400)
      .expect((response) => {
        const { message } = response.body;
        expect(message).toBe("Bad path! ID must be a number");
      });
  });

  test("Each comment object has required properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const commentsArray = response.body;
        commentsArray.forEach((comment) => {
          // checking if has property
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(comment.hasOwnProperty("votes")).toBe(true);
          expect(comment.hasOwnProperty("created_at")).toBe(true);
          expect(comment.hasOwnProperty("author")).toBe(true);
          expect(comment.hasOwnProperty("body")).toBe(true);
          expect(comment.hasOwnProperty("article_id")).toBe(true);

          // checking if datatype of property is right
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("Checking that the comments are ordered by date", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const commentsArray = response.body;
        const isDescending = commentsArray.every((comment, index) => {
          return (
            // checking if current comment being loopedover is the last one in the array if it is, returns true
            index === commentsArray.length - 1 ||
            comment.created_at >= commentsArray[index + 1].created_at
          );
        });
        expect(isDescending).toBe(true); // each is in decending order
      });
  });
});
// 7
describe("POST /api/articles/:article_id/comments", () => {
  test("returns 201 status code and the posted comment", () => {
    const comment = {
      username: "icellusedkars",
      body: "A truly inspiring article",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(comment)
      .expect(201)
      .then((response) => {
        console.log(response);
      });
  });
});

//10

describe("GET api/users", () => {
  test("Returns 200 status code", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("Expect length of users array to be greater than one", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBeGreaterThan(1);
      });
  });
  test("Each user object has following properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const usersArray = response.body.users;
        usersArray.forEach((element) => {
          expect(element.hasOwnProperty("username")).toBe(true);
          expect(element.hasOwnProperty("name")).toBe(true);
          expect(element.hasOwnProperty("avatar_url")).toBe(true);
        });
      });
  });
});
