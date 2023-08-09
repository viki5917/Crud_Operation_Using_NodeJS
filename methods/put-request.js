const requestBodyParser = require("../utilities/body-parser");
const writeToFile = require("../utilities/write-to-file");
module.exports = async (request, response) => {
  let baseUrl = request.url.substring(0, request.url.lastIndexOf("/") + 1);
  let id = request.url.split("/")[3];
  const regexV4 = new RegExp(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i
  );

  if (!regexV4.test(id)) {
    response.writeHead(400, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "UUID is not valid",
      })
    );
  } else if (baseUrl === "/api/movies/" && regexV4.test(id)) {
    try {
      let body = await requestBodyParser(request);
      const index = request.movies.findIndex((movie) => {
        return movie.id === id;
      });
      if (index === -1) {
        response.statusCode = 404;
        response.write(
          JSON.stringify({ title: "Not Found!", message: "Movie not found" })
        );
        response.end();
      } else {
        request.movies[index] = { id, ...body };
        writeToFile(request.movies);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(request.movies[index]));
      }
    } catch (error) {
      console.log(error);
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          title: "Validation Failed",
          message: "Request body is not valid",
        })
      );
    }
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({ title: "Not Found!", message: "Route not found" })
    );
  }
};
