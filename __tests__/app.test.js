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

// TOPICS

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

// /API/ Endpoint
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

// START OF ARTICLES ENDPOINT TESTS

describe("GET /api/articles/:article_id", () => {
  test("returns 200 status code", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {});
  });

  test("Non-Existent ID, should return 404", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .expect((response) => {
        const message = response.body.msg;
        expect(message).toBe("article doesn't exist");
      });
  });

  test("Has the expected properties and values", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        articles.forEach((article) => {
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
        });
      });
  });
});

describe("GET /api/articles/", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles").expect(200);
  });
});

test("Handles non-existent endpoint with 404", () => {
  return request(app)
    .get("/api/artixsdfdf")
    .expect(404)
    .then((response) => {});
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
          index === articlesArray.length - 1 ||
          article.created_at >= articlesArray[index + 1].created_at
        );
      });
      expect(isDescending).toBe(true);
    });
});
test("Returns object without body property", async () => {
  const response = await request(app).get("/api/articles").expect(200);

  const articlesArray = response.body.articles;

  const hasNoBody = articlesArray.every((article) => {
    return !article.hasOwnProperty("body");
  });

  expect(hasNoBody).toBe(true);
});

// ARTICLES WITH TOPIC QUERY

test("should only return articles based on topic passed in query ", () => {
  return request(app)
    .get("/api/articles")
    .query({ topic: "mitch" })
    .expect(200)
    .then((response) => {
      const articlesTopicsArray = response.body.articles;

      articlesTopicsArray.forEach((article) => {
        expect(article.topic).toBe("mitch");
      });
    });
});

test("Non-Existent query should return 404", () => {
  return request(app)
    .get("/api/articles")
    .query({ topic: "mtch" })
    .expect(404)
    .expect((response) => {
      const message = response.body.msg;
      expect(message).toBe("Not Found");
    });
});

// GETTING COMMENTS BY ARTICLE ID

describe("GET /api/articles/:article_id/comments", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("Non-Existent ID, should return 404", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .expect((response) => {
        const message = response.body.msg;
        expect(message).toBe("article doesn't exist");
      });
  });
  test("Non-Numerical ID, should return 400 bad path", () => {
    return request(app)
      .get("/api/articles/bannaa/comments")
      .expect(400)
      .expect((response) => {
        const message = response.body.msg;
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
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(comment.hasOwnProperty("votes")).toBe(true);
          expect(comment.hasOwnProperty("created_at")).toBe(true);
          expect(comment.hasOwnProperty("author")).toBe(true);
          expect(comment.hasOwnProperty("body")).toBe(true);
          expect(comment.hasOwnProperty("article_id")).toBe(true);

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
            index === commentsArray.length - 1 ||
            comment.created_at >= commentsArray[index + 1].created_at
          );
        });
        expect(isDescending).toBe(true);
      });
  });
});

// POST COMMENT TO A SPECIFIC ARTICLE

describe("POST /api/articles/:article_id/comments", () => {
  test("returns 201 status code and the posted comment", () => {
    const comment = {
      username: "icellusedkars",
      body: "A truly inspiring article",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(comment)
      .expect(201);
  });
  test("returns 201 status code and the posted comment", () => {
    const comment = {
      username: "icellusedkars",
      body: "A truly inspiring article",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(comment)
      .then((response) => {
        expect(response.body.author).toEqual("icellusedkars");
        expect(response.body.body).toEqual("A truly inspiring article");
      });
  });
});

// 8 INCREASE NUMBER OF VOTES (Patch)

describe("PATCH /api/articles/:article_id", () => {
  test("returns 201 status code and the posted comment", () => {
    const increaseVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(increaseVotes)
      .expect(201)
      .then((response) => {});
  });
  test("Increases votes by number passed", () => {
    const increaseVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(increaseVotes)
      .expect(201)
      .then((response) => {
        expect(response.body.votes).toEqual(101);
      });
  });
});

// 11 GET COMMENTS BY ARTICLE ID
describe("GET /api/articles/:article_id/comments", () => {
  test("returns 200 status code", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const commentArray = response.body;
        commentArray.forEach((comment) => {
          expect(comment.article_id).toBe(1);
        });
      });
  });
});

// COMMENTS ENDPOINT
// DELETE COMMENTS

describe("DELETE /api/comments/:comment_id", () => {
  test("should delete artciles by id ", () => {
    return request(app)
      .delete("/api/comments/3")
      .then((response) => {
        const deletedComment = response.body;
        expect(response.status).toBe(204);
        expect(deletedComment).toEqual({});
      });
  });
});

//10 USERS ENDPOINT

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
        console.log(usersArray);
        usersArray.forEach((element) => {
          expect(element.hasOwnProperty("username")).toBe(true);
          expect(element.hasOwnProperty("name")).toBe(true);
          expect(element.hasOwnProperty("avatar_url")).toBe(true);
        });
      });
  });
  test("Handles non-existent endpoint with 404", () => {
    return request(app).get("/api/usrs").expect(404);
  });
});
