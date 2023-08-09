//npm init
//npm i --save-dev nodemon
//npm i dotenv

const http = require("http");
require("dotenv").config();
const getReq = require("./methods/get-request");
const postReq = require("./methods/post-request");
const putReq = require("./methods/put-request");
const deleteReq = require("./methods/delete-request");
let movies = require("./data/movies.json");

const PORT = process.env.PORT || 5001;

const server = http.createServer((request, response) => {
  request.movies = movies;
  switch (request.method) {
    case "GET":
      getReq(request, response);
      break;
    case "POST":
      postReq(request, response);
      break;
    case "PUT":
      putReq(request, response);
      break;
    case "DELETE":
      deleteReq(request, response);
      break;
    default:
      response.statusCode = 404;
      response.setHeader = ("Content-Type", "application/json");
      response.write(
        JSON.stringify({ title: "Not Found!", message: "Route not found" })
      );
      response.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server Started on port : ${PORT} `);
});
